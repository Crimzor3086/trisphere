const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  console.log('TriSphere Commerce Layer — Fuji deploy');
  console.log('Deployer:', deployer.address);
  console.log('Balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'AVAX');

  const Treasury = await hre.ethers.getContractFactory('TriSphereTreasury');
  const treasury = await Treasury.deploy(deployer.address);
  await treasury.waitForDeployment();

  const Reputation = await hre.ethers.getContractFactory('TriSphereReputation');
  const reputation = await Reputation.deploy(deployer.address);
  await reputation.waitForDeployment();

  const PaymentEscrow = await hre.ethers.getContractFactory('PaymentEscrow');
  const escrow = await PaymentEscrow.deploy(await treasury.getAddress(), await reputation.getAddress(), 250);
  await escrow.waitForDeployment();

  const MockUSDC = await hre.ethers.getContractFactory('MockUSDC');
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  await reputation.setRegistrar(escrowAddress, true);

  const mintAmount = hre.ethers.parseUnits('100000', 6);
  await usdc.mint(deployer.address, mintAmount);

  const manifest = {
    network: 'fuji',
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      paymentEscrow: escrowAddress,
      treasury: await treasury.getAddress(),
      reputation: await reputation.getAddress(),
      mockUsdc: await usdc.getAddress(),
      platformFeeBps: 250,
    },
  };

  const outDir = path.join(__dirname, '..', '..', '..', 'deployments');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'trisphere-commerce-fuji.json');
  fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));

  const rootManifest = path.join(outDir, 'trisphere-fuji.json');
  if (fs.existsSync(rootManifest)) {
    const root = JSON.parse(fs.readFileSync(rootManifest, 'utf8'));
    root.contracts = { ...root.contracts, ...manifest.contracts };
    root.commerceDeployedAt = manifest.deployedAt;
    fs.writeFileSync(rootManifest, JSON.stringify(root, null, 2));
  }

  console.log('\nDeployed:');
  console.log(JSON.stringify(manifest.contracts, null, 2));
  console.log('\nManifest:', outFile);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
