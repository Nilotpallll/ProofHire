// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CredentialRegistry
 * @dev Decentralized, privacy-conscious cryptographic credential registry for ProofHire.
 * Supports accredited institutional issuance, document digest anchoring, auditability,
 * and immutable revocation records on EVM-compatible blockchains.
 */
contract CredentialRegistry is Ownable {

    struct IssuerInfo {
        string name;
        bool isAuthorized;
        bool isSuspended;
        uint256 authorizedAt;
    }

    struct CredentialRecord {
        string credentialId;
        bytes32 subjectReference; // Salted pseudonym hash or student identifier commitment
        address issuer;           // Authorized issuing institution address
        bytes32 documentDigest;   // Cryptographic Keccak-256 / SHA-256 digest of canonical document
        string metadataUri;       // IPFS CID or verifiable metadata URI
        uint256 issuedAt;         // Block timestamp at issuance
        bool isRevoked;           // Revocation status
        uint256 revokedAt;        // Timestamp when revoked (0 if active)
        string revocationReason;  // Explicit reason for revocation audit trail
    }

    // Issuer address => IssuerInfo
    mapping(address => IssuerInfo) public issuers;

    // Credential ID => CredentialRecord
    mapping(string => CredentialRecord) private credentials;

    // Track credential ID existence
    mapping(string => bool) private credentialExists;

    // Events (Privacy-conscious: No personal identifiable information)
    event IssuerAuthorized(address indexed issuer, string name, uint256 timestamp);
    event IssuerSuspended(address indexed issuer, uint256 timestamp);
    event IssuerRevoked(address indexed issuer, uint256 timestamp);

    event CredentialIssued(
        string indexed credentialId,
        address indexed issuer,
        bytes32 indexed subjectReference,
        bytes32 documentDigest,
        string metadataUri,
        uint256 timestamp
    );

    event CredentialRevoked(
        string indexed credentialId,
        address indexed revoker,
        string reason,
        uint256 timestamp
    );

    error CallerNotAuthorizedIssuer();
    error IssuerIsSuspended();
    error CredentialAlreadyExists(string credentialId);
    error CredentialNotFound(string credentialId);
    error CredentialAlreadyRevoked(string credentialId);
    error UnauthorizedRevoker();
    error InvalidZeroAddress();
    error EmptyCredentialId();
    error EmptyDocumentDigest();

    modifier onlyAuthorizedIssuer() {
        IssuerInfo memory issuer = issuers[msg.sender];
        if (!issuer.isAuthorized) revert CallerNotAuthorizedIssuer();
        if (issuer.isSuspended) revert IssuerIsSuspended();
        _;
    }

    constructor() Ownable(msg.sender) {
        // Authorize contract deployer as bootstrap administrator/issuer for testing
        issuers[msg.sender] = IssuerInfo({
            name: "ProofHire Governance Root",
            isAuthorized: true,
            isSuspended: false,
            authorizedAt: block.timestamp
        });
        emit IssuerAuthorized(msg.sender, "ProofHire Governance Root", block.timestamp);
    }

    // -------------------------------------------------------------
    // Issuer Management (Admin Governance)
    // -------------------------------------------------------------

    /**
     * @notice Authorizes an institution to issue verifiable credentials.
     * @param issuer The address of the institutional signing key.
     * @param name The legal accredited name of the institution.
     */
    function authorizeIssuer(address issuer, string calldata name) external onlyOwner {
        if (issuer == address(0)) revert InvalidZeroAddress();
        issuers[issuer] = IssuerInfo({
            name: name,
            isAuthorized: true,
            isSuspended: false,
            authorizedAt: block.timestamp
        });
        emit IssuerAuthorized(issuer, name, block.timestamp);
    }

    /**
     * @notice Suspends an issuer's issuance rights without deleting history.
     */
    function suspendIssuer(address issuer) external onlyOwner {
        if (!issuers[issuer].isAuthorized) revert CallerNotAuthorizedIssuer();
        issuers[issuer].isSuspended = true;
        emit IssuerSuspended(issuer, block.timestamp);
    }

    /**
     * @notice Completely revokes an issuer's issuance rights.
     */
    function revokeIssuer(address issuer) external onlyOwner {
        if (!issuers[issuer].isAuthorized) revert CallerNotAuthorizedIssuer();
        issuers[issuer].isAuthorized = false;
        issuers[issuer].isSuspended = false;
        emit IssuerRevoked(issuer, block.timestamp);
    }

    // -------------------------------------------------------------
    // Credential Issuance & Revocation
    // -------------------------------------------------------------

    /**
     * @notice Issues a verifiable credential record.
     * @param credentialId Unique platform credential identifier.
     * @param subjectReference Privacy-conscious pseudonym hash (e.g., keccak256(student_id + salt)).
     * @param documentDigest Keccak-256 / SHA-256 digest of the canonical credential document.
     * @param metadataUri IPFS CID or verifiable metadata URI.
     */
    function issueCredential(
        string calldata credentialId,
        bytes32 subjectReference,
        bytes32 documentDigest,
        string calldata metadataUri
    ) external onlyAuthorizedIssuer {
        if (bytes(credentialId).length == 0) revert EmptyCredentialId();
        if (documentDigest == bytes32(0)) revert EmptyDocumentDigest();
        if (credentialExists[credentialId]) revert CredentialAlreadyExists(credentialId);

        credentials[credentialId] = CredentialRecord({
            credentialId: credentialId,
            subjectReference: subjectReference,
            issuer: msg.sender,
            documentDigest: documentDigest,
            metadataUri: metadataUri,
            issuedAt: block.timestamp,
            isRevoked: false,
            revokedAt: 0,
            revocationReason: ""
        });

        credentialExists[credentialId] = true;

        emit CredentialIssued(
            credentialId,
            msg.sender,
            subjectReference,
            documentDigest,
            metadataUri,
            block.timestamp
        );
    }

    /**
     * @notice Revokes an issued credential. Revocation preserves immutable historical records.
     * @param credentialId The credential identifier to revoke.
     * @param reason Documented audit justification for revocation.
     */
    function revokeCredential(string calldata credentialId, string calldata reason) external {
        if (!credentialExists[credentialId]) revert CredentialNotFound(credentialId);

        CredentialRecord storage record = credentials[credentialId];
        if (record.isRevoked) revert CredentialAlreadyRevoked(credentialId);

        // Only original issuer or contract owner can revoke
        if (msg.sender != record.issuer && msg.sender != owner()) {
            revert UnauthorizedRevoker();
        }

        record.isRevoked = true;
        record.revokedAt = block.timestamp;
        record.revocationReason = reason;

        emit CredentialRevoked(credentialId, msg.sender, reason, block.timestamp);
    }

    // -------------------------------------------------------------
    // Verification & Read Methods
    // -------------------------------------------------------------

    /**
     * @notice Performs complete status and cryptographic digest verification.
     * @param credentialId Credential identifier.
     * @param expectedDigest Document digest to compare against (or bytes32(0) to skip digest check).
     * @return isValid True only if credential exists, issuer is authorized, not revoked, and digest matches.
     * @return exists True if credential is registered on chain.
     * @return isRevoked True if credential was revoked.
     * @return digestMatches True if expectedDigest matches on-chain digest (or if expectedDigest is 0).
     * @return issuer Address of the issuing institution.
     * @return issuedAt Block timestamp of issuance.
     */
    function verifyCredential(
        string calldata credentialId,
        bytes32 expectedDigest
    ) external view returns (
        bool isValid,
        bool exists,
        bool isRevoked,
        bool digestMatches,
        address issuer,
        uint256 issuedAt
    ) {
        if (!credentialExists[credentialId]) {
            return (false, false, false, false, address(0), 0);
        }

        CredentialRecord memory record = credentials[credentialId];
        exists = true;
        isRevoked = record.isRevoked;
        issuer = record.issuer;
        issuedAt = record.issuedAt;

        bool digestOk = (expectedDigest == bytes32(0)) || (expectedDigest == record.documentDigest);
        digestMatches = digestOk;

        // Valid only if issuer is currently authorized (not revoked or suspended), credential is not revoked, and digest matches
        bool issuerOk = issuers[record.issuer].isAuthorized && !issuers[record.issuer].isSuspended;
        isValid = exists && !isRevoked && digestOk && issuerOk;

        return (isValid, exists, isRevoked, digestMatches, issuer, issuedAt);
    }

    /**
     * @notice Retrieves the full credential record.
     */
    function getCredential(string calldata credentialId) external view returns (CredentialRecord memory) {
        if (!credentialExists[credentialId]) revert CredentialNotFound(credentialId);
        return credentials[credentialId];
    }

    /**
     * @notice Checks if an institution issuer is authorized and active.
     */
    function isIssuerAuthorized(address issuer) external view returns (bool) {
        return issuers[issuer].isAuthorized && !issuers[issuer].isSuspended;
    }

    /**
     * @notice Returns metadata about an institution issuer.
     */
    function getIssuer(address issuer) external view returns (
        string memory name,
        bool isAuthorized,
        bool isSuspended,
        uint256 authorizedAt
    ) {
        IssuerInfo memory info = issuers[issuer];
        return (info.name, info.isAuthorized, info.isSuspended, info.authorizedAt);
    }

    /**
     * @notice Helper to check existence.
     */
    function doesCredentialExist(string calldata credentialId) external view returns (bool) {
        return credentialExists[credentialId];
    }
}
