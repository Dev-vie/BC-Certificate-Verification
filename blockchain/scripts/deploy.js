/**
 * Week 8: Deploy CertificateVerification.sol to Polygon Amoy testnet.
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network amoy
 *
 * After deployment:
 *   1. Copy the CONTRACT_ADDRESS printed below into backend/.env
 *   2. Share CONTRACT_ADDRESS + ABI with Sean (backend/src/utils/blockchain.js has the ABI)
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Wallet balance:", hre.ethers.formatEther(balance), "MATIC");

  if (balance === 0n) {
    console.error("ERROR: Wallet has 0 MATIC. Get testnet MATIC from https://faucet.polygon.technology/");
    process.exit(1);
  }

  console.log("\nDeploying CertificateVerification...");
  const factory = await hre.ethers.getContractFactory("CertificateVerification");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ CertificateVerification deployed to:", address);
  console.log("   Network:", hre.network.name);
  console.log("   Tx hash:", contract.deploymentTransaction()?.hash);

  // Persist deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployedBy: deployer.address,
    deployedAt: new Date().toISOString(),
    txHash: contract.deploymentTransaction()?.hash,
  };

  const outDir = path.join(__dirname, "../../deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, `${hre.network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", outFile);

  // Suggest .env update
  console.log("\nAdd to ../backend/.env:");
  console.log(`CONTRACT_ADDRESS=${address}`);

  // Optional: verify on Polygonscan
  if (process.env.POLYGONSCAN_API_KEY && hre.network.name === "amoy") {
    console.log("\nVerifying on Polygonscan...");
    await hre.run("verify:verify", { address, constructorArguments: [] });
    console.log("Contract verified on Polygonscan");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
