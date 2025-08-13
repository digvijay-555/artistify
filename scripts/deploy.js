const path = require("path");
const fs = require("fs");
const { ethers } = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/_3LaR8WP4c_tMAlD4WfkpUd4iOit1Mn3");
  // const blockNumber = "latest";
  // const block = await provider.getBlock(blockNumber);
  // console.log(block);

  // const SongFractionalized = await ethers.getContractFactory("SongFractionalized");
  // const songFractionalized = await SongFractionalized.deploy();

  // await songFractionalized.deployed();
  // console.log("SongFractionalized deployed to:", songFractionalized.address);
  // saveFrontendFiles(songFractionalized, "SongFractionalized");

  // const SongEscrow = await ethers.getContractFactory("SongEscrow");
  // const songEscrow = await SongEscrow.deploy(songFractionalized.address);

  // await songEscrow.deployed();
  // console.log("songEscrow deployed to:", songEscrow.address);
  // saveFrontendFiles(songEscrow, "SongEscrow");

  // const FractionPurchase = await ethers.getContractFactory("FractionPurchase");
  // const fractionPurchase = await FractionPurchase.deploy(songFractionalized.address, songEscrow.address);

  // await fractionPurchase.deployed();
  // console.log("FractionPurchase deployed to:", fractionPurchase.address);
  // saveFrontendFiles(fractionPurchase, "FractionPurchase");

  // const SongRevenue = await ethers.getContractFactory("SongRevenue");
  // const songRevenue = await SongRevenue.deploy(songFractionalized.address);

  // await songRevenue.deployed();
  // console.log("SongRevenue deployed to:", songRevenue.address);
  // saveFrontendFiles(songRevenue, "SongRevenue");

  const Fein = await ethers.getContractFactory("Fein");
  const fein = await Fein.deploy();

  await fein.deployed();
  console.log("Fein deployed to:", fein.address);
  saveFrontendFiles(fein, "Fein");
}

function saveFrontendFiles(contract, name) {
  const contractsDir = path.join(__dirname, "../src/contract_data/");

  // Ensure the directory exists
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  // Save contract ABI
  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
