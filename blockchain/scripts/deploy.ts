import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ProofHireCredential smart contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const ProofHireCredentialFactory = await ethers.getContractFactory("ProofHireCredential");
  const contract = await ProofHireCredentialFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("ProofHireCredential deployed successfully to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
