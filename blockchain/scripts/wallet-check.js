/**
 * Week 7: Wallet + environment setup check.
 *
 * Run this before deploying to confirm everything is configured correctly.
 *   node scripts/wallet-check.js
 *
 * What it checks:
 *   1. Required env vars are present
 *   2. Wallet private key is valid
 *   3. RPC connection to Polygon Amoy testnet works
 *   4. Wallet has enough MATIC to pay gas
 *   5. Contract is reachable (if CONTRACT_ADDRESS is set)
 */

require("dotenv").config({ path: "../backend/.env" });
const { ethers } = require("ethers");

const RPC_URL = process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const MIN_MATIC = "0.01"; // minimum MATIC needed to deploy / send tx

async function main() {
  console.log("=== Blockchain Environment Check ===\n");

  let allPassed = true;

  // ── 1. Env vars ────────────────────────────────────────────────────────────
  const required = ["WALLET_PRIVATE_KEY", "POLYGON_RPC_URL"];
  for (const key of required) {
    if (process.env[key]) {
      console.log(`✅  ${key} is set`);
    } else {
      console.log(`❌  ${key} is MISSING — add it to backend/.env`);
      allPassed = false;
    }
  }

  if (CONTRACT_ADDRESS) {
    console.log(`✅  CONTRACT_ADDRESS is set: ${CONTRACT_ADDRESS}`);
  } else {
    console.log(`⚠️   CONTRACT_ADDRESS not set — deploy the contract first (Week 8)`);
  }

  console.log();

  // ── 2. Private key format ──────────────────────────────────────────────────
  if (!PRIVATE_KEY) {
    console.log("⏩  Skipping wallet checks — WALLET_PRIVATE_KEY not set\n");
    allPassed = false;
  } else {
    let wallet;
    try {
      const key = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : "0x" + PRIVATE_KEY;
      wallet = new ethers.Wallet(key);
      console.log(`✅  Private key is valid`);
      console.log(`    Wallet address: ${wallet.address}`);
      console.log(`    (Add this address to MetaMask to manage the same wallet)\n`);
    } catch {
      console.log("❌  WALLET_PRIVATE_KEY is invalid — re-export from MetaMask\n");
      allPassed = false;
    }

    // ── 3. RPC connection ────────────────────────────────────────────────────
    if (wallet) {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const network = await provider.getNetwork();
        console.log(`✅  Connected to network: ${network.name} (chainId: ${network.chainId})`);

        if (network.chainId !== 80002n) {
          console.log("⚠️   Expected Polygon Amoy (chainId 80002) — check POLYGON_RPC_URL");
        }

        // ── 4. MATIC balance ─────────────────────────────────────────────────
        const connectedWallet = wallet.connect(provider);
        const balance = await provider.getBalance(connectedWallet.address);
        const balanceEther = ethers.formatEther(balance);
        const hasEnough = parseFloat(balanceEther) >= parseFloat(MIN_MATIC);

        if (hasEnough) {
          console.log(`✅  Wallet balance: ${balanceEther} MATIC (enough for transactions)\n`);
        } else {
          console.log(`❌  Wallet balance: ${balanceEther} MATIC — need at least ${MIN_MATIC} MATIC`);
          console.log(`    Get testnet MATIC at: https://faucet.polygon.technology/\n`);
          allPassed = false;
        }

        // ── 5. Contract reachability ─────────────────────────────────────────
        if (CONTRACT_ADDRESS) {
          try {
            const code = await provider.getCode(CONTRACT_ADDRESS);
            if (code !== "0x") {
              console.log(`✅  Contract found at ${CONTRACT_ADDRESS}`);
              console.log(`    Ready to store and verify certificate hashes\n`);
            } else {
              console.log(`❌  No contract found at ${CONTRACT_ADDRESS}`);
              console.log(`    The address exists but has no code — re-deploy the contract\n`);
              allPassed = false;
            }
          } catch (err) {
            console.log(`❌  Could not reach contract: ${err.message}\n`);
            allPassed = false;
          }
        }
      } catch (err) {
        console.log(`❌  Could not connect to RPC (${RPC_URL}): ${err.message}`);
        console.log(`    Check POLYGON_RPC_URL in backend/.env\n`);
        allPassed = false;
      }
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("=== Summary ===");
  if (allPassed) {
    console.log("✅  All checks passed — ready to deploy or send transactions");
  } else {
    console.log("❌  Some checks failed — fix the issues above before deploying");
    console.log("\nNext steps:");
    if (!PRIVATE_KEY) {
      console.log("  1. Open MetaMask → Account Details → Export Private Key");
      console.log("  2. Add WALLET_PRIVATE_KEY=0x... to ../backend/.env");
    }
    if (!CONTRACT_ADDRESS) {
      console.log("  3. Run: npx hardhat run scripts/deploy.js --network amoy");
      console.log("  4. Copy the printed CONTRACT_ADDRESS into backend/.env");
    }
  }
}

main().catch((err) => {
  console.error("Check failed:", err.message);
  process.exit(1);
});
