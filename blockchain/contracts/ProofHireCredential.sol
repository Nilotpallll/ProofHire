// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofHireCredential
 * @notice Decentralized Credential Registry contract for ProofHire platform.
 * Allows accredited institutions to issue, verify, and revoke academic and professional credentials.
 */
contract ProofHireCredential {
    address public owner;

    enum CredentialStatus { NOT_FOUND, ISSUED, REVOKED }

    struct Credential {
        bytes32 credentialHash;   // Keccak-256 hash of credential metadata + recipient
        address issuer;           // Institution wallet that issued the credential
        address recipient;        // Student / Candidate wallet
        string credentialType;    // e.g. "DEGREE", "CERTIFICATE", "BADGE"
        string ipfsMetadataUri;   // IPFS CID or metadata URI
        uint256 issueDate;        // Unix timestamp
        uint256 revocationDate;   // Unix timestamp if revoked, 0 otherwise
        string revocationReason;  // Reason if revoked
        CredentialStatus status;  // Current lifecycle status
    }

    // Hash => Credential
    mapping(bytes32 => Credential) private _credentials;

    // Authorized institution issuers: address => bool
    mapping(address => bool) public authorizedIssuers;

    // Total counts
    uint256 public totalIssued;
    uint256 public totalRevoked;

    // Events
    event IssuerAuthorized(address indexed issuer);
    event IssuerDeauthorized(address indexed issuer);
    event CredentialIssued(
        bytes32 indexed credentialHash,
        address indexed issuer,
        address indexed recipient,
        string credentialType,
        string ipfsMetadataUri,
        uint256 issueDate
    );
    event CredentialRevoked(
        bytes32 indexed credentialHash,
        address indexed issuer,
        string reason,
        uint256 revocationDate
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "ProofHire: Only owner can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "ProofHire: Only authorized institution can issue");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    /**
     * @notice Authorize an educational or certification institution to issue credentials.
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "ProofHire: Invalid address");
        require(!authorizedIssuers[issuer], "ProofHire: Already authorized");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    /**
     * @notice Revoke authorization from an institution.
     */
    function deauthorizeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "ProofHire: Not an authorized issuer");
        authorizedIssuers[issuer] = false;
        emit IssuerDeauthorized(issuer);
    }

    /**
     * @notice Issue a verifiable credential on-chain.
     */
    function issueCredential(
        bytes32 credentialHash,
        address recipient,
        string calldata credentialType,
        string calldata ipfsMetadataUri
    ) external onlyIssuer {
        require(credentialHash != bytes32(0), "ProofHire: Invalid credential hash");
        require(recipient != address(0), "ProofHire: Invalid recipient address");
        require(_credentials[credentialHash].status == CredentialStatus.NOT_FOUND, "ProofHire: Credential already exists");

        _credentials[credentialHash] = Credential({
            credentialHash: credentialHash,
            issuer: msg.sender,
            recipient: recipient,
            credentialType: credentialType,
            ipfsMetadataUri: ipfsMetadataUri,
            issueDate: block.timestamp,
            revocationDate: 0,
            revocationReason: "",
            status: CredentialStatus.ISSUED
        });

        totalIssued++;

        emit CredentialIssued(
            credentialHash,
            msg.sender,
            recipient,
            credentialType,
            ipfsMetadataUri,
            block.timestamp
        );
    }

    /**
     * @notice Revoke an issued credential (only issuing institution or contract owner).
     */
    function revokeCredential(bytes32 credentialHash, string calldata reason) external {
        Credential storage cred = _credentials[credentialHash];
        require(cred.status == CredentialStatus.ISSUED, "ProofHire: Credential is not active or not found");
        require(cred.issuer == msg.sender || msg.sender == owner, "ProofHire: Not authorized to revoke this credential");

        cred.status = CredentialStatus.REVOKED;
        cred.revocationDate = block.timestamp;
        cred.revocationReason = reason;

        totalRevoked++;

        emit CredentialRevoked(credentialHash, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Public verification function to verify credential validity.
     */
    function verifyCredential(bytes32 credentialHash)
        external
        view
        returns (
            bool isValid,
            address issuer,
            address recipient,
            uint256 issueDate,
            bool isRevoked,
            string memory revocationReason,
            string memory credentialType,
            string memory ipfsMetadataUri
        )
    {
        Credential memory cred = _credentials[credentialHash];
        if (cred.status == CredentialStatus.NOT_FOUND) {
            return (false, address(0), address(0), 0, false, "Credential not found", "", "");
        }

        bool valid = (cred.status == CredentialStatus.ISSUED);
        bool revoked = (cred.status == CredentialStatus.REVOKED);

        return (
            valid,
            cred.issuer,
            cred.recipient,
            cred.issueDate,
            revoked,
            cred.revocationReason,
            cred.credentialType,
            cred.ipfsMetadataUri
        );
    }
}
