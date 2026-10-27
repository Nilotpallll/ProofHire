import { expect } from "chai";
import { ethers } from "hardhat";
import { CredentialRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CredentialRegistry Smart Contract Suite", function () {
  let registry: CredentialRegistry;
  let owner: HardhatEthersSigner;
  let stanfordIssuer: HardhatEthersSigner;
  let mitIssuer: HardhatEthersSigner;
  let student: HardhatEthersSigner;
  let attacker: HardhatEthersSigner;

  const testCredentialId = "cred-stanford-cs-2025-001";
  const testSubjectRef = ethers.keccak256(ethers.toUtf8Bytes("student-alex-rivera-salt-9871"));
  const testDocumentDigest = ethers.keccak256(ethers.toUtf8Bytes("CANONICAL_PDF_CONTENT_HASH_STANFORD_DIPLOMA"));
  const testIpfsUri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

  beforeEach(async function () {
    [owner, stanfordIssuer, mitIssuer, student, attacker] = await ethers.getSigners();

    const RegistryFactory = await ethers.getContractFactory("CredentialRegistry");
    registry = await RegistryFactory.deploy();
    await registry.waitForDeployment();

    // Authorize Stanford as verified institution
    await registry.authorizeIssuer(stanfordIssuer.address, "Stanford University");
  });

  describe("1. Issuer Authorization & Governance", function () {
    it("Should authorize deployer as default root issuer", async function () {
      const isAuth = await registry.isIssuerAuthorized(owner.address);
      expect(isAuth).to.be.true;

      const issuerInfo = await registry.getIssuer(owner.address);
      expect(issuerInfo[0]).to.equal("ProofHire Governance Root");
      expect(issuerInfo[1]).to.be.true;
    });

    it("Should allow owner to authorize an institution", async function () {
      const isAuth = await registry.isIssuerAuthorized(stanfordIssuer.address);
      expect(isAuth).to.be.true;

      const info = await registry.getIssuer(stanfordIssuer.address);
      expect(info.name).to.equal("Stanford University");
      expect(info.isAuthorized).to.be.true;
      expect(info.isSuspended).to.be.false;
    });

    it("Should prevent non-owner from authorizing an issuer", async function () {
      await expect(
        registry.connect(attacker).authorizeIssuer(mitIssuer.address, "MIT")
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to suspend and resume/revoke an issuer", async function () {
      await registry.suspendIssuer(stanfordIssuer.address);
      expect(await registry.isIssuerAuthorized(stanfordIssuer.address)).to.be.false;

      // Suspended issuer cannot issue
      await expect(
        registry
          .connect(stanfordIssuer)
          .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri)
      ).to.be.revertedWithCustomError(registry, "IssuerIsSuspended");

      // Revoke issuer
      await registry.revokeIssuer(stanfordIssuer.address);
      const info = await registry.getIssuer(stanfordIssuer.address);
      expect(info.isAuthorized).to.be.false;
    });

    it("Should emit IssuerAuthorized and IssuerRevoked events", async function () {
      await expect(registry.authorizeIssuer(mitIssuer.address, "MIT"))
        .to.emit(registry, "IssuerAuthorized")
        .withArgs(mitIssuer.address, "MIT", (v: any) => v > 0);

      await expect(registry.revokeIssuer(mitIssuer.address))
        .to.emit(registry, "IssuerRevoked")
        .withArgs(mitIssuer.address, (v: any) => v > 0);
    });
  });

  describe("2. Credential Issuance", function () {
    it("Should allow authorized institution to issue a credential", async function () {
      const tx = await registry
        .connect(stanfordIssuer)
        .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri);

      await expect(tx)
        .to.emit(registry, "CredentialIssued")
        .withArgs(
          testCredentialId,
          stanfordIssuer.address,
          testSubjectRef,
          testDocumentDigest,
          testIpfsUri,
          (ts: any) => ts > 0
        );

      expect(await registry.doesCredentialExist(testCredentialId)).to.be.true;
    });

    it("Should reject issuance by an unauthorized caller", async function () {
      await expect(
        registry
          .connect(attacker)
          .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri)
      ).to.be.revertedWithCustomError(registry, "CallerNotAuthorizedIssuer");
    });

    it("Should reject duplicate credential IDs", async function () {
      await registry
        .connect(stanfordIssuer)
        .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri);

      await expect(
        registry
          .connect(stanfordIssuer)
          .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri)
      ).to.be.revertedWithCustomError(registry, "CredentialAlreadyExists")
        .withArgs(testCredentialId);
    });

    it("Should reject empty credential ID or zero document digest", async function () {
      await expect(
        registry
          .connect(stanfordIssuer)
          .issueCredential("", testSubjectRef, testDocumentDigest, testIpfsUri)
      ).to.be.revertedWithCustomError(registry, "EmptyCredentialId");

      await expect(
        registry
          .connect(stanfordIssuer)
          .issueCredential("valid-id", testSubjectRef, ethers.ZeroHash, testIpfsUri)
      ).to.be.revertedWithCustomError(registry, "EmptyDocumentDigest");
    });
  });

  describe("3. Credential Verification & Document Matching", function () {
    beforeEach(async function () {
      await registry
        .connect(stanfordIssuer)
        .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri);
    });

    it("Should verify an authentic credential with matching digest", async function () {
      const result = await registry.verifyCredential(testCredentialId, testDocumentDigest);
      expect(result.isValid).to.be.true;
      expect(result.exists).to.be.true;
      expect(result.isRevoked).to.be.false;
      expect(result.digestMatches).to.be.true;
      expect(result.issuer).to.equal(stanfordIssuer.address);
      expect(result.issuedAt).to.be.gt(0);
    });

    it("Should return digestMatches = false if document digest does not match", async function () {
      const forgedDigest = ethers.keccak256(ethers.toUtf8Bytes("TAMPERED_OR_FORGED_DOCUMENT"));
      const result = await registry.verifyCredential(testCredentialId, forgedDigest);
      expect(result.isValid).to.be.false;
      expect(result.exists).to.be.true;
      expect(result.isRevoked).to.be.false;
      expect(result.digestMatches).to.be.false;
    });

    it("Should return false for non-existent credential", async function () {
      const result = await registry.verifyCredential("non-existent-id", testDocumentDigest);
      expect(result.isValid).to.be.false;
      expect(result.exists).to.be.false;
      expect(result.isRevoked).to.be.false;
    });

    it("Should retrieve full credential record for an existing credential", async function () {
      const record = await registry.getCredential(testCredentialId);
      expect(record.credentialId).to.equal(testCredentialId);
      expect(record.subjectReference).to.equal(testSubjectRef);
      expect(record.issuer).to.equal(stanfordIssuer.address);
      expect(record.documentDigest).to.equal(testDocumentDigest);
      expect(record.metadataUri).to.equal(testIpfsUri);
      expect(record.isRevoked).to.be.false;
    });
  });

  describe("4. Credential Revocation Workflow", function () {
    beforeEach(async function () {
      await registry
        .connect(stanfordIssuer)
        .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri);
    });

    it("Should allow the issuing institution to revoke its credential", async function () {
      const reason = "Administrative revocation: Degree awarded under incorrect specialization";
      const tx = await registry
        .connect(stanfordIssuer)
        .revokeCredential(testCredentialId, reason);

      await expect(tx)
        .to.emit(registry, "CredentialRevoked")
        .withArgs(testCredentialId, stanfordIssuer.address, reason, (ts: any) => ts > 0);

      // Verify that revocation fails current-validity verification
      const verifyResult = await registry.verifyCredential(testCredentialId, testDocumentDigest);
      expect(verifyResult.isValid).to.be.false;
      expect(verifyResult.isRevoked).to.be.true;
      expect(verifyResult.exists).to.be.true;

      const record = await registry.getCredential(testCredentialId);
      expect(record.isRevoked).to.be.true;
      expect(record.revokedAt).to.be.gt(0);
      expect(record.revocationReason).to.equal(reason);
    });

    it("Should allow contract owner (governance) to revoke a credential", async function () {
      const reason = "Accreditation board sanction";
      await expect(
        registry.connect(owner).revokeCredential(testCredentialId, reason)
      )
        .to.emit(registry, "CredentialRevoked")
        .withArgs(testCredentialId, owner.address, reason, (ts: any) => ts > 0);

      const result = await registry.verifyCredential(testCredentialId, testDocumentDigest);
      expect(result.isValid).to.be.false;
      expect(result.isRevoked).to.be.true;
    });

    it("Should reject revocation attempt by an unauthorized third-party", async function () {
      await expect(
        registry
          .connect(attacker)
          .revokeCredential(testCredentialId, "Malicious revocation attempt")
      ).to.be.revertedWithCustomError(registry, "UnauthorizedRevoker");
    });

    it("Should reject revoking an already revoked credential", async function () {
      await registry.connect(stanfordIssuer).revokeCredential(testCredentialId, "First revocation");

      await expect(
        registry.connect(stanfordIssuer).revokeCredential(testCredentialId, "Duplicate revocation attempt")
      ).to.be.revertedWithCustomError(registry, "CredentialAlreadyRevoked")
        .withArgs(testCredentialId);
    });

    it("Should reject revoking an unknown credential", async function () {
      await expect(
        registry.connect(stanfordIssuer).revokeCredential("unknown-id", "Does not exist")
      ).to.be.revertedWithCustomError(registry, "CredentialNotFound")
        .withArgs("unknown-id");
    });
  });

  describe("5. Edge Cases & Security Invariants", function () {
    it("Should reject authorizing an issuer with zero address", async function () {
      await expect(
        registry.authorizeIssuer(ethers.ZeroAddress, "Bogus")
      ).to.be.revertedWithCustomError(registry, "InvalidZeroAddress");
    });

    it("Should reject non-owner trying to suspend or revoke an issuer", async function () {
      await expect(
        registry.connect(attacker).suspendIssuer(stanfordIssuer.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");

      await expect(
        registry.connect(attacker).revokeIssuer(stanfordIssuer.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("Should reject suspending or revoking an unauthorized issuer", async function () {
      await expect(
        registry.suspendIssuer(attacker.address)
      ).to.be.revertedWithCustomError(registry, "CallerNotAuthorizedIssuer");

      await expect(
        registry.revokeIssuer(attacker.address)
      ).to.be.revertedWithCustomError(registry, "CallerNotAuthorizedIssuer");
    });

    it("Should invalidate credentials when issuer is subsequently suspended or revoked", async function () {
      await registry
        .connect(stanfordIssuer)
        .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri);

      // Verify authentic initially
      let result = await registry.verifyCredential(testCredentialId, testDocumentDigest);
      expect(result.isValid).to.be.true;

      // Suspend Stanford
      await registry.suspendIssuer(stanfordIssuer.address);

      // Credential verification should now report invalid due to issuer suspension
      result = await registry.verifyCredential(testCredentialId, testDocumentDigest);
      expect(result.isValid).to.be.false;
      expect(result.exists).to.be.true;

      // Revoke Stanford completely
      await registry.revokeIssuer(stanfordIssuer.address);
      result = await registry.verifyCredential(testCredentialId, testDocumentDigest);
      expect(result.isValid).to.be.false;
    });

    it("Should verify successfully without document digest when expectedDigest is bytes32(0)", async function () {
      await registry
        .connect(stanfordIssuer)
        .issueCredential(testCredentialId, testSubjectRef, testDocumentDigest, testIpfsUri);

      const result = await registry.verifyCredential(testCredentialId, ethers.ZeroHash);
      expect(result.isValid).to.be.true;
      expect(result.digestMatches).to.be.true;
    });

    it("Should revert getCredential for non-existent credential identifier", async function () {
      await expect(
        registry.getCredential("bogus-credential-id")
      ).to.be.revertedWithCustomError(registry, "CredentialNotFound")
        .withArgs("bogus-credential-id");
    });
  });
});
