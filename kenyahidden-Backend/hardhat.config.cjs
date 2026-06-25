require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const RPC_URL    = process.env.RPC_URL    || "https://api.avax-test.network/ext/bc/C/rpc";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },

  networks: {
    // Local Hardhat node (default)
    hardhat: {},

    // Avalanche Fuji Testnet
    fuji: {
      url: RPC_URL,
      chainId: 43113,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 25_000_000_000, // 25 gwei — Fuji minimum
    },
  },

  // Etherscan-compatible verification via Snowtrace (optional)
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "verifyContract",
    },
    customChains: [
      {
        network: "avalancheFujiTestnet",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io",
        },
      },
    ],
  },

  paths: {
    sources:  "./contracts",
    tests:    "./test",
    cache:    "./cache",
    artifacts: "./artifacts",
  },
};
