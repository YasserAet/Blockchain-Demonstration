// Check Ganache accounts and their balances
const ethers = require("ethers");

async function checkAccounts() {
  console.log("🔍 Checking Ganache Accounts...\n");
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  try {
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network (Chain ID: ${network.chainId})\n`);
    
    // Check the deployer account that's showing 0 balance
    const deployerAddress = "0x12CAC184EaF07fbf21C37a3154C5E63B9ADcb503";
    const balance = await provider.getBalance(deployerAddress);
    
    console.log("📍 Deployer Account:");
    console.log(`   Address: ${deployerAddress}`);
    console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance === 0n) {
      console.log("\n⚠️  This account has 0 ETH!");
      console.log("   This is the account your app is trying to use.");
      console.log("\n💡 Solution:");
      console.log("   1. Look at your Ganache terminal");
      console.log("   2. Find the account with this address: " + deployerAddress);
      console.log("   3. Copy its private key");
      console.log("   4. Import that private key to MetaMask");
      console.log("\n   OR restart Ganache to get new accounts.");
    } else {
      console.log("\n✅ This account has funds! Import it to MetaMask.");
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("\n📋 To see all Ganache accounts:");
    console.log("   Look at the Ganache terminal window");
    console.log("   Scroll to 'Available Accounts' section");
    console.log("   Find the account matching: " + deployerAddress);
    console.log("   Copy its private key and import to MetaMask");
    
  } catch (error) {
    console.error("❌ Cannot connect to Ganache!");
    console.error("   Make sure Ganache is running on port 8545");
    console.error("\n   Start it with: npm run blockchain:start");
  }
}

checkAccounts();
