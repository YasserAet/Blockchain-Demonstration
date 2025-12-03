// This script is used to deploy the contract to a local Hardhat node
// Run with: npx hardhat run scripts/deploy.js --network localhost

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
// Run with: npx hardhat run scripts/deploy.js --network localhost

import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying BlockchainDemo contract...");

  // 1. Get the ContractFactory
  const BlockchainDemo = await hre.ethers.getContractFactory("BlockchainDemo");

  // 2. Deploy the contract
  const demo = await BlockchainDemo.deploy();

  // 3. Wait for deployment to finish
  await demo.waitForDeployment();

  const address = await demo.getAddress();
  console.log(`BlockchainDemo deployed to: ${address}`);

  // 4. Save the address and ABI for the frontend to use
  // Ensure lib directory exists
  const libDir = path.join(__dirname, "../lib");
  if (!fs.existsSync(libDir)){
      fs.mkdirSync(libDir);
  }

  const configPath = path.join(libDir, "contract-config.json");
  const artifact = await hre.artifacts.readArtifact("BlockchainDemo");

  const config = {
    address: address,
    abi: artifact.abi,
    network: "localhost" // or "sepolia", "mainnet" etc.
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Config saved to ${configPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
