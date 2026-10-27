import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProofHireCredential Smart Contract", function () {
  let contract: any;
  let owner: any;
  let institution: any;
  let student: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, institution, student, otherAccount] = await ethers.getSigners();
    const ProofHireCredentialFactory = await ethers.getContractFactory("ProofHireCredential");
    contract = await ProofHireCredentialFactory.deploy();
    await contract.waitForDeployment();
  });

  it("Should set owner as initial authorized issuer", async function () {
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.authorizedIssuers(owner.address)).to.equal(true);
  });

  it("Owner should authorize new institution issuer", async function () {
    await contract.authorizeIssuer(institution.address);
    expect(await contract.authorizedIssuers(institution.address)).to.equal(true);
  });

  it("Authorized issuer can issue a verifiable credential", async function () {
    await contract.authorizeIssuer(institution.address);

    const credentialHash = ethers.keccak256(ethers.toUtf8Bytes("BSc-Computer-Science-Nilotpal-2025"));
    const ipfsUri = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

    await contract.connect(institution).issueCredential(
      credentialHash,
      student.address,
      "DEGREE",
      ipfsUri
    );

    const verification = await contract.verifyCredential(credentialHash);
    expect(verification.isValid).to.equal(true);
    expect(verification.issuer).to.equal(institution.address);
    expect(verification.recipient).to.equal(student.address);
    expect(verification.isRevoked).to.equal(false);
    expect(verification.credentialType).to.equal("DEGREE");
    expect(verification.ipfsMetadataUri).to.equal(ipfsUri);
  });

  it("Issuer can revoke an issued credential", async function () {
    await contract.authorizeIssuer(institution.address);

    const credentialHash = ethers.keccak256(ethers.toUtf8Bytes("BSc-Data-Nilotpal-2025"));
    await contract.connect(institution).issueCredential(
      credentialHash,
      student.address,
      "CERTIFICATE",
      "ipfs://QmTest123"
    );

    await contract.connect(institution).revokeCredential(credentialHash, "Administrative Error");

    const verification = await contract.verifyCredential(credentialHash);
    expect(verification.isValid).to.equal(false);
    expect(verification.isRevoked).to.equal(true);
    expect(verification.revocationReason).to.equal("Administrative Error");
  });

  it("Unregistered credential returns isValid = false", async function () {
    const randomHash = ethers.keccak256(ethers.toUtf8Bytes("Random-Nonexistent-Hash"));
    const verification = await contract.verifyCredential(randomHash);
    expect(verification.isValid).to.equal(false);
    expect(verification.isRevoked).to.equal(false);
  });
});
