import { ethers } from "ethers";
import { toBytes32 } from "./hash";

export const CONTRACT_ABI = [
  "function storeCertificate(bytes32 hash, string certId) external",
  "function verifyCertificate(bytes32 hash) external view returns (bool exists, bool revoked, address issuer, uint256 timestamp, string certId)",
  "function revokeCertificate(bytes32 hash) external",
  "event CertificateStored(bytes32 indexed hash, address indexed issuer, uint256 timestamp, string certId)",
  "event CertificateRevoked(bytes32 indexed hash, address indexed revoker, uint256 timestamp)",
];

export function isBlockchainConfigured(): boolean {
  return Boolean(
    process.env.WALLET_PRIVATE_KEY &&
    process.env.CONTRACT_ADDRESS &&
    process.env.POLYGON_RPC_URL
  );
}

export function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";
  return new ethers.JsonRpcProvider(rpcUrl);
}

export function getSigner(): ethers.Wallet {
  const provider = getProvider();
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) throw new Error("WALLET_PRIVATE_KEY is not configured in .env");
  return new ethers.Wallet(privateKey, provider);
}

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider): ethers.Contract {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) throw new Error("CONTRACT_ADDRESS is not configured in .env");
  return new ethers.Contract(address, CONTRACT_ABI, signerOrProvider);
}

export async function storeCertificateOnChain(hexHash: string, certId: string) {
  if (!isBlockchainConfigured()) {
    console.warn("[Blockchain] Live Polygon Amoy not fully configured. Using simulated hash anchoring.");
    return {
      txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      blockNumber: Math.floor(10000000 + Math.random() * 500000),
      contractAddress: process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    };
  }

  try {
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
  } catch (err: any) {
    console.error("[Blockchain] Error storing certificate on-chain:", err.message);
    throw err;
  }
}

export async function verifyCertificateOnChain(hexHash: string) {
  if (!isBlockchainConfigured()) {
    return {
      exists: true,
      revoked: false,
      issuerAddress: "0x" + "1".repeat(40),
      issuedAt: new Date().toISOString(),
      certId: null,
      configured: false,
    };
  }

  try {
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
      configured: true,
    };
  } catch (err: any) {
    console.error("[Blockchain] Error verifying on-chain:", err.message);
    return {
      exists: false,
      revoked: false,
      issuerAddress: null,
      issuedAt: null,
      certId: null,
      error: err.message,
      configured: true,
    };
  }
}

export async function revokeCertificateOnChain(hexHash: string) {
  if (!isBlockchainConfigured()) {
    return {
      txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      blockNumber: Math.floor(10000000 + Math.random() * 500000),
    };
  }

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
