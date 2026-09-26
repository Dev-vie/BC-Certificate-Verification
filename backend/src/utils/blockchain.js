const { ethers } = require("ethers");
const { toBytes32 } = require("./hash");

const CONTRACT_ABI = [
  "function storeCertificate(bytes32 hash, string certId) external",
  "function verifyCertificate(bytes32 hash) external view returns (bool exists, bool revoked, address issuer, uint256 timestamp, string certId)",
  "function revokeCertificate(bytes32 hash) external",
  "event CertificateStored(bytes32 indexed hash, address indexed issuer, uint256 timestamp, string certId)",
  "event CertificateRevoked(bytes32 indexed hash, address indexed revoker, uint256 timestamp)",
];

function getProvider() {
  const rpcUrl = process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getSigner() {
  const provider = getProvider();
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) throw new Error("WALLET_PRIVATE_KEY not set in .env");
  return new ethers.Wallet(privateKey, provider);
}

function getContract(signerOrProvider) {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) throw new Error("CONTRACT_ADDRESS not set in .env");
  return new ethers.Contract(address, CONTRACT_ABI, signerOrProvider);
}

async function storeCertificateOnChain(hexHash, certId) {
  const signer = getSigner();
  const contract = getContract(signer);
  const bytes32Hash = toBytes32(hexHash);

  const tx = await contract.storeCertificate(bytes32Hash, certId);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    contractAddress: process.env.CONTRACT_ADDRESS,
  };
}

async function verifyCertificateOnChain(hexHash) {
  const provider = getProvider();
  const contract = getContract(provider);
  const bytes32Hash = toBytes32(hexHash);

  const [exists, revoked, issuerAddress, timestamp, certId] =
    await contract.verifyCertificate(bytes32Hash);

  return {
    exists,
    revoked,
    issuerAddress: exists ? issuerAddress : null,
    issuedAt: exists ? new Date(Number(timestamp) * 1000).toISOString() : null,
    certId: exists ? certId : null,
  };
}

async function revokeCertificateOnChain(hexHash) {
  const signer = getSigner();
  const contract = getContract(signer);
  const bytes32Hash = toBytes32(hexHash);

  const tx = await contract.revokeCertificate(bytes32Hash);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

async function syncCertificatesWithChain(certificates) {
  const provider = getProvider();
  const contract = getContract(provider);

  const results = await Promise.all(
    certificates.map(async ({ certId, hexHash }) => {
      try {
        const bytes32Hash = toBytes32(hexHash);
        const [exists, revoked, issuerAddress, timestamp] =
          await contract.verifyCertificate(bytes32Hash);

        return {
          certId,
          hexHash,
          onChain: {
            exists,
            revoked,
            issuerAddress: exists ? issuerAddress : null,
            issuedAt: exists ? new Date(Number(timestamp) * 1000).toISOString() : null,
          },
        };
      } catch (err) {
        return { certId, hexHash, onChain: null, error: err.message };
      }
    })
  );

  return results;
}

function isBlockchainConfigured() {
  return !!(
    process.env.WALLET_PRIVATE_KEY &&
    process.env.CONTRACT_ADDRESS &&
    process.env.POLYGON_RPC_URL
  );
}

module.exports = {
  CONTRACT_ABI,
  storeCertificateOnChain,
  verifyCertificateOnChain,
  revokeCertificateOnChain,
  syncCertificatesWithChain,
  isBlockchainConfigured,
  getProvider,
  getSigner,
  getContract,
};
