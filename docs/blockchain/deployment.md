# Blockchain Deployment Guide & Multi-Network Configuration

## 1. Supported Networks

ProofHire supports both local isolated development nodes and public EVM testnets:

| Network | Chain ID | RPC URL Environment Variable | Purpose |
| :--- | :--- | :--- | :--- |
| **Hardhat Local** | `31337` | In-memory or `http://127.0.0.1:8545` | Instant automated tests and zero-gas local simulation |
| **Polygon Amoy** | `80002` | `AMOY_RPC_URL` (e.g. `https://rpc-amoy.polygon.technology/`) | Public EVM testnet with low gas fees and high finality |
| **Ethereum Sepolia** | `11155111` | `SEPOLIA_RPC_URL` (optional) | Canonical Ethereum testnet verification |

---

## 2. Environment Variables Configuration

Create a `.env` in the repository root or in `blockchain/.env`:

```env
# Deployment Private Key (Without 0x prefix or with 0x prefix)
# NEVER commit a real private key. For local node, standard Hardhat accounts are used.
DEPLOYER_PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# RPC Endpoints
AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Optional Etherscan / Polygonscan API Key for contract verification
POLYGONSCAN_API_KEY=
```

---

## 3. Local Deployment Workflow

To compile and deploy contracts to a local Hardhat node:

```bash
# Compile contracts
npm run compile --workspace=@proofhire/blockchain

# Run full unit test suite (23 tests)
npm run test --workspace=@proofhire/blockchain

# Deploy locally
npx hardhat run scripts/deploy.ts --network hardhat --workspace=@proofhire/blockchain
```

### Generated Artifacts
The deployment script outputs:
1. `blockchain/deployments/hardhat.json` (Machine-readable deployment receipt)
2. `services/api/src/blockchain/contract-config.json` (Synced to NestJS backend for real-time ABI and contract address loading)

Example manifest:
```json
{
  "network": "hardhat",
  "chainId": 31337,
  "contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "deployedAt": "2026-10-27T18:31:00.000Z",
  "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "abi": [ ... ]
}
```

---

## 4. Deploying to Polygon Amoy Testnet

When deploying to Polygon Amoy:

1. Obtain testnet POL tokens from the official Polygon Faucet (`https://faucet.polygon.technology/`).
2. Ensure `DEPLOYER_PRIVATE_KEY` and `AMOY_RPC_URL` are populated in your `.env`.
3. Execute the deployment script targeting `amoy`:

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network amoy
```

4. The script will automatically output the transaction hash and block explorer URL (`https://amoy.polygonscan.com/address/<contractAddress>`).
5. Copy the generated `deployments/amoy.json` into `services/api/src/blockchain/contract-config.json` or set `CREDENTIAL_CONTRACT_ADDRESS` in `services/api/.env`.
