require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../backend/.env" });

const rawKey = process.env.WALLET_PRIVATE_KEY || "";
const PRIVATE_KEY =
  rawKey && rawKey.length >= 64
    ? rawKey.startsWith("0x") ? rawKey : "0x" + rawKey
    : "0x" + "a".repeat(64); // dummy key for local/compile only
const POLYGON_AMOY_RPC = process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";
const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    amoy: {
      url: POLYGON_AMOY_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
  sourcify: {
    enabled: false,
  },
};