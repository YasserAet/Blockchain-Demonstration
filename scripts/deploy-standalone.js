// STANDALONE DEPLOYMENT SCRIPT
// This script compiles and deploys the contract without needing Hardhat CLI
// Works directly with Ganache

const ethers = require("ethers");
const solc = require("solc");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log(" Blockchain Demo - Contract Deployment");
  console.log("═══════════════════════════════════════════════\n");

  // Step 1: Check Ganache connection
  console.log("📡 Connecting to Ganache at http://127.0.0.1:8545...");
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  try {
    const network = await provider.getNetwork();
    console.log(` Connected to network (Chain ID: ${network.chainId})\n`);
  } catch (error) {
    console.error(" Cannot connect to Ganache!");
    console.error("   Make sure Ganache is running: ganache --port 8545 --chain.chainId 31337\n");
    process.exit(1);
  }

  // Step 2: Get deployer account
  const signer = await provider.getSigner(0);
  const address = await signer.getAddress();
  const balance = await provider.getBalance(address);
  
  console.log(" Deployer Account:");
  console.log(`   Address: ${address}`);
  console.log(`   Balance: ${ethers.formatEther(balance)} ETH\n`);

  // Step 3: Read and compile contract
  console.log(" Reading contract source...");
  const contractPath = path.join(__dirname, "../contracts/BlockchainDemo.sol");
  const source = fs.readFileSync(contractPath, "utf8");

  console.log("  Compiling contract...");
  const input = {
    language: "Solidity",
    sources: {
      "BlockchainDemo.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Check for errors
  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === "error");
    if (errors.length > 0) {
      console.error(" Compilation errors:");
      errors.forEach(error => console.error(error.formattedMessage));
      process.exit(1);
    }
  }

  const contract = output.contracts["BlockchainDemo.sol"]["BlockchainDemo"];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  console.log(` Contract compiled successfully\n`);

  // Step 4: Deploy contract
  console.log(" Deploying BlockchainDemo contract...");
  
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const deployedContract = await factory.deploy();
  
  console.log(" Waiting for deployment transaction to be mined...");
  await deployedContract.waitForDeployment();
  
  const contractAddress = await deployedContract.getAddress();
  
  console.log("\n═══════════════════════════════════════════════");
  console.log(" Deployment Successful!");
  console.log("══════════════════════════════════════════════");
  console.log(`\n Contract Address: ${contractAddress}\n`);

  // Step 5: Save configuration
  console.log("💾 Saving contract configuration...");
  
  const libDir = path.join(__dirname, "../lib");
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  const config = {
    address: contractAddress,
    abi: abi,
    network: "localhost",
    chainId: 31337,
    deployed: new Date().toISOString()
  };

  const configPath = path.join(libDir, "contract-config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log(` Configuration saved to: lib/contract-config.json\n`);

  // Step 6: Test contract
  console.log(" Testing contract...");
  const value = await deployedContract.storedValue();
  console.log(`   Initial stored value: "${value}"`);
  console.log(" Contract is working!\n");

  // Final instructions
  console.log("═══════════════════════════════════════════════");
  console.log(" Setup Complete!");
  console.log("═══════════════════════════════════════════════\n");
  
  console.log(" Next Steps:\n");
  console.log("1. Configure MetaMask:");
  console.log("   Network Name: Ganache Local");
  console.log("   RPC URL: http://127.0.0.1:8545");
  console.log("   Chain ID: 31337");
  console.log("   Currency: ETH\n");
  
  console.log("2. Import Test Account:");
  console.log("   (Copy a private key from the Ganache terminal)\n");
  
  console.log("3. Start Your App:");
  console.log("   npm run dev\n");
  
  console.log("4. Open http://localhost:3000\n");
  
  console.log("5. Connect Wallet & Test Real Transactions! \n");
  
  console.log("═══════════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n Deployment Failed!");
    console.error("═══════════════════════════════════════════════");
    console.error(error);
    process.exit(1);
  });
