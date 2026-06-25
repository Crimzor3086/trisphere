#!/usr/bin/env node
/**
 * KHC-DE Deploy Script — Avalanche Fuji Testnet
 *
 * Deploys KHCRegistry (on-chain verified champion registry).
 * Writes deployed address to: deployments/fuji.json
 *
 * Usage: npm run deploy:fuji
 */

const { ethers, network } = require("hardhat");
const fs   = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("\n=== KHC-DE Contract Deployment ===");
  console.log(`Network  : ${network.name} (chainId ${network.config.chainId})`);
  console.log(`Deployer : ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance  : ${ethers.formatEther(balance)} AVAX\n`);

  if (balance === 0n) {
    throw new Error(
      "Deployer wallet has 0 AVAX. Get Fuji test AVAX at: https://faucet.avax.network/"
    );
  }

  console.log("Deploying KHCRegistry…");
  const KHCRegistry = await ethers.getContractFactory("KHCRegistry");
  const registry = await KHCRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`✓ KHCRegistry → ${registryAddress}`);

  const deployments = {
    network:     network.name,
    chainId:       network.config.chainId,
    deployedAt:    new Date().toISOString(),
    deployer:      deployer.address,
    KHCRegistry:   registryAddress,
  };

  const outDir  = path.join(__dirname, "..", "deployments");
  const outFile = path.join(outDir, "fuji.json");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(deployments, null, 2), "utf8");

  console.log(`\n✓ Deployment record → ${outFile}`);
  console.log("\nAdd to .env:");
  console.log(`KHC_REGISTRY_ADDRESS=${registryAddress}`);
  console.log(`\nSnowtrace: https://testnet.snowtrace.io/address/${registryAddress}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
