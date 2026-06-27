require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY || '';
const isValid = /^0x[0-9a-fA-F]{64}$/.test(PRIVATE_KEY);

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    fuji: {
      url: process.env.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: isValid ? [PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: './src',
    artifacts: './artifacts',
    cache: './cache',
  },
};
