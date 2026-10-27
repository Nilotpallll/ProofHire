import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log(`\n======================================================`);
  console.log(`Deploying ProofHire CredentialRegistry to network: ${network.name}`);
  console.log(`======================================================\n`);

  const [deployer, institutionAccount] = await ethers.getSigners();
  console.log("Deployer account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const RegistryFactory = await ethers.getContractFactory("CredentialRegistry");
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log(`\n✔ CredentialRegistry deployed successfully at: ${registryAddress}`);

  // In local development or Hardhat network, bootstrap sample institutions and credentials
  if (network.name === "localhost" || network.name === "hardhat") {
    console.log("\nConfiguring development bootstrap state...");
    
    // Authorize sample institution
    const institutionAddr = institutionAccount ? institutionAccount.address : deployer.address;
    const authTx = await registry.authorizeIssuer(institutionAddr, "Stanford University (Accredited)");
    await authTx.wait();
    console.log(`✔ Authorized institution issuer: ${institutionAddr} (Stanford University)`);

    // Issue a verified test credential
    const testCredId = "cred-demo-stanford-cs-2025";
    const subjectRef = ethers.keccak256(ethers.toUtf8Bytes("alex.rivera@example.com:SALT_4892"));
    const documentDigest = ethers.keccak256(ethers.toUtf8Bytes("STANFORD_BACHELOR_COMPUTER_SCIENCE_ALEX_RIVERA_2025"));
    const ipfsUri = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

    const issueTx = await registry.connect(institutionAccount || deployer).issueCredential(
      testCredId,
      subjectRef,
      documentDigest,
      ipfsUri
    );
    await issueTx.wait();
    console.log(`✔ Issued test credential: ${testCredId}`);
  }

  // Write deployment artifact
  const deploymentDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentData = {
    network: network.name,
    chainId: network.config.chainId || 31337,
    contractAddress: registryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contractName: "CredentialRegistry",
    abi: (RegistryFactory.interface as any).formatJson(),
  };

  const artifactPath = path.join(deploymentDir, `${network.name}.json`);
  fs.writeFileSync(artifactPath, JSON.stringify(deploymentData, null, 2));
  console.log(`✔ Saved deployment artifact to: ${artifactPath}`);

  // Also write to services/api for backend consumer integration
  const apiContractDir = path.join(__dirname, "..", "..", "services", "api", "src", "blockchain");
  if (!fs.existsSync(apiContractDir)) {
    fs.mkdirSync(apiContractDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(apiContractDir, "contract-config.json"),
    JSON.stringify({
      address: registryAddress,
      network: network.name,
      chainId: network.config.chainId || 31337,
      abi: JSON.parse((RegistryFactory.interface as any).formatJson()),
    }, null, 2)
  );
  console.log(`✔ Synced contract config to backend: services/api/src/blockchain/contract-config.json`);

  console.log("\n======================================================");
  console.log("Deployment complete!");
  console.log("======================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
