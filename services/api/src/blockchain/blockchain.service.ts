import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as contractConfig from './contract-config.json';

export interface OnChainVerificationResult {
  isValid: boolean;
  exists: boolean;
  isRevoked: boolean;
  digestMatches: boolean;
  issuer: string;
  issuedAt: number;
  onChainDigest?: string;
  metadataUri?: string;
  revocationReason?: string;
  isRpcLive: boolean;
}

export interface OnChainTransactionResult {
  success: boolean;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signerContract: ethers.Contract | null = null;
  private institutionSigner: ethers.Wallet | null = null;
  private contractAddress: string;

  constructor() {
    const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
    this.contractAddress = process.env.PROOFHIRE_CONTRACT_ADDRESS || contractConfig.address;
    // Default to Hardhat local account #1 for development/testing if not configured in .env
    const institutionKey = process.env.INSTITUTION_PRIVATE_KEY || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.contract = new ethers.Contract(this.contractAddress, contractConfig.abi, this.provider);

      if (institutionKey) {
        this.institutionSigner = new ethers.Wallet(institutionKey, this.provider);
        this.signerContract = new ethers.Contract(this.contractAddress, contractConfig.abi, this.institutionSigner);
        this.logger.log(`Initialized blockchain signer: ${this.institutionSigner.address}`);
      }

      this.logger.log(`Initialized blockchain provider pointing to: ${rpcUrl} (Contract: ${this.contractAddress})`);
    } catch (err: any) {
      this.logger.warn(`Could not connect to live RPC: ${err.message}.`);
    }
  }

  private async getFreshNonce(): Promise<number> {
    if (!this.provider || !this.institutionSigner) return 0;
    const hexNonce = await this.provider.send('eth_getTransactionCount', [this.institutionSigner.address, 'latest']);
    return parseInt(hexNonce, 16);
  }

  /**
   * Issues a verifiable credential directly on the deployed smart contract.
   */
  async issueCredentialOnChain(
    credentialId: string,
    subjectReference: string,
    documentDigest: string,
    metadataUri: string,
  ): Promise<OnChainTransactionResult> {
    if (!this.signerContract || !this.institutionSigner || !this.provider) {
      return { success: false, error: 'Signer or RPC provider unavailable.' };
    }

    try {
      const subjectBytes32 = subjectReference.startsWith('0x') && subjectReference.length === 66
        ? subjectReference
        : ethers.keccak256(ethers.toUtf8Bytes(subjectReference));

      const digestBytes32 = documentDigest.startsWith('0x') && documentDigest.length === 66
        ? documentDigest
        : ethers.keccak256(ethers.toUtf8Bytes(documentDigest));

      const nonce = await this.getFreshNonce();

      this.logger.log(`Submitting on-chain issueCredential transaction for ID: ${credentialId} (nonce: ${nonce})`);
      const tx = await this.signerContract.issueCredential(
        credentialId,
        subjectBytes32,
        digestBytes32,
        metadataUri,
        { nonce },
      );

      const receipt = await tx.wait();
      this.logger.log(`Credential ${credentialId} confirmed on-chain in block ${receipt.blockNumber} (tx: ${receipt.hash})`);

      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : undefined,
      };
    } catch (err: any) {
      this.logger.error(`Failed to issue credential on-chain: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Revokes an issued credential directly on the deployed smart contract.
   */
  async revokeCredentialOnChain(
    credentialId: string,
    reason: string,
  ): Promise<OnChainTransactionResult> {
    if (!this.signerContract || !this.institutionSigner || !this.provider) {
      return { success: false, error: 'Signer or RPC provider unavailable.' };
    }

    try {
      const nonce = await this.getFreshNonce();

      this.logger.log(`Submitting on-chain revokeCredential transaction for ID: ${credentialId} (nonce: ${nonce})`);
      const tx = await this.signerContract.revokeCredential(
        credentialId,
        reason,
        { nonce },
      );

      const receipt = await tx.wait();
      this.logger.log(`Credential ${credentialId} revoked on-chain in block ${receipt.blockNumber} (tx: ${receipt.hash})`);

      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : undefined,
      };
    } catch (err: any) {
      this.logger.error(`Failed to revoke credential on-chain: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Verifies credential against the Ethereum smart contract registry.
   */
  async verifyCredentialOnChain(
    credentialId: string,
    expectedDigest?: string,
  ): Promise<OnChainVerificationResult> {
    const digestBytes32 = expectedDigest && expectedDigest.startsWith('0x') && expectedDigest.length === 66
      ? expectedDigest
      : expectedDigest
      ? ethers.keccak256(ethers.toUtf8Bytes(expectedDigest))
      : ethers.ZeroHash;

    if (this.contract && this.provider) {
      try {
        // Query smart contract
        const result = await this.contract.verifyCredential(credentialId, digestBytes32);
        const exists = result[1];
        let onChainDigest: string | undefined;
        let metadataUri: string | undefined;
        let revocationReason: string | undefined;

        if (exists) {
          try {
            const record = await this.contract.getCredential(credentialId);
            onChainDigest = record.documentDigest;
            metadataUri = record.metadataUri;
            revocationReason = record.revocationReason;
          } catch {
            // Ignore error if getCredential fails
          }
        }

        return {
          isValid: result[0],
          exists: result[1],
          isRevoked: result[2],
          digestMatches: result[3],
          issuer: result[4],
          issuedAt: Number(result[5]),
          onChainDigest,
          metadataUri,
          revocationReason,
          isRpcLive: true,
        };
      } catch (err: any) {
        this.logger.warn(`Live RPC call failed or node unreachable: ${err.message}`);
      }
    }

    // When the blockchain cannot be reached, return explicit UNAVAILABLE status.
    // Strict security rule: Never return isValid = true if node consensus cannot be reached!
    return {
      isValid: false,
      exists: false,
      isRevoked: false,
      digestMatches: false,
      issuer: ethers.ZeroAddress,
      issuedAt: 0,
      isRpcLive: false,
    };
  }

  /**
   * Computes canonical Keccak-256 digest of document bytes.
   */
  computeDocumentDigest(content: Buffer | string): string {
    if (typeof content === 'string') {
      return ethers.keccak256(ethers.toUtf8Bytes(content));
    }
    return ethers.keccak256(content);
  }

  getContractAddress(): string {
    return this.contractAddress;
  }
}
