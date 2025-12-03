// Simple deployment script that works with Ganache
// Uses ethers.js directly without Hardhat plugins

const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying BlockchainDemo contract to Ganache...\n");

  // Connect to Ganache
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Get the first account (signer)
  const signer = await provider.getSigner(0);
  const address = await signer.getAddress();
  console.log(`📍 Deploying from: ${address}`);
  
  const balance = await provider.getBalance(address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);

  // Read the compiled contract
  const contractPath = path.join(__dirname, "../artifacts/contracts/BlockchainDemo.sol/BlockchainDemo.json");
  
  if (!fs.existsSync(contractPath)) {
    console.error("❌ Contract not compiled! Run: npx hardhat compile");
    process.exit(1);
  }

  const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  
  // Create contract factory
  const factory = new ethers.ContractFactory(
    contractJson.abi,
    contractJson.bytecode,
    signer
  );

  // Deploy
  console.log("⏳ Deploying contract...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log(`✅ BlockchainDemo deployed to: ${contractAddress}\n`);

  // Save config for frontend
  const libDir = path.join(__dirname, "../lib");
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir);
  }

  const config = {
    address: contractAddress,
    abi: contractJson.abi,
    network: "localhost"
  };

  const configPath = path.join(libDir, "contract-config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`📄 Config saved to: ${configPath}`);
  
  console.log("\n✨ Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("   1. Configure MetaMask with network:");
  console.log("      RPC URL: http://127.0.0.1:8545");
  console.log("      Chain ID: 31337");
  console.log("   2. Import a test account private key");
  console.log("   3. Start your app: npm run dev");
  console.log("   4. Connect wallet and test transactions!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
