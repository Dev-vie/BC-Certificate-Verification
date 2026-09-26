// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateVerification
 * @notice Stores and verifies SHA-256 hashes of issued certificates on-chain.
 * @dev Deployed to Polygon Amoy testnet (Week 8). Share ABI with Sean for ethers.js integration.
 */
contract CertificateVerification {
    address public owner;

    struct CertificateRecord {
        bool exists;
        bool revoked;
        address issuer;
        uint256 timestamp;
        string certId;
    }

    mapping(bytes32 => CertificateRecord) private certificates;

    event CertificateStored(bytes32 indexed hash, address indexed issuer, uint256 timestamp, string certId);
    event CertificateRevoked(bytes32 indexed hash, address indexed revoker, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Store a certificate hash on-chain.
     * @param hash SHA-256 hash of the certificate (as bytes32).
     * @param certId Off-chain certificate UUID for cross-referencing with DB.
     */
    function storeCertificate(bytes32 hash, string calldata certId) external {
        require(!certificates[hash].exists, "Certificate already exists");
        require(bytes(certId).length > 0, "certId cannot be empty");

        certificates[hash] = CertificateRecord({
            exists: true,
            revoked: false,
            issuer: msg.sender,
            timestamp: block.timestamp,
            certId: certId
        });

        emit CertificateStored(hash, msg.sender, block.timestamp, certId);
    }

    /**
     * @notice Verify whether a certificate hash exists on-chain.
     * @param hash SHA-256 hash of the certificate (as bytes32).
     * @return exists     Whether the hash was ever stored.
     * @return revoked    Whether the certificate has been revoked.
     * @return issuer     Address of the wallet that stored the certificate.
     * @return timestamp  Unix timestamp of when it was stored.
     * @return certId     Off-chain certificate UUID.
     */
    function verifyCertificate(bytes32 hash)
        external
        view
        returns (
            bool exists,
            bool revoked,
            address issuer,
            uint256 timestamp,
            string memory certId
        )
    {
        CertificateRecord memory r = certificates[hash];
        return (r.exists, r.revoked, r.issuer, r.timestamp, r.certId);
    }

    /**
     * @notice Revoke a certificate. Only the original issuer or contract owner can revoke.
     * @param hash SHA-256 hash of the certificate (as bytes32).
     */
    function revokeCertificate(bytes32 hash) external {
        CertificateRecord storage r = certificates[hash];
        require(r.exists, "Certificate not found");
        require(!r.revoked, "Already revoked");
        require(r.issuer == msg.sender || msg.sender == owner, "Not authorized to revoke");

        r.revoked = true;
        emit CertificateRevoked(hash, msg.sender, block.timestamp);
    }

    /**
     * @notice Transfer contract ownership.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
