// Quick script to verify Ganache connection and show account balances
const ethers = require("ethers");

async function checkGanache() {
  console.log("🔍 Checking Ganache Connection...\n");
  
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Check connection
    const network = await provider.getNetwork();
    console.log("✅ Connected to Ganache!");
    console.log(`   Chain ID: ${network.chainId}\n`);
    
    // Get first 3 accounts
    console.log("📋 First 3 Ganache Accounts:\n");
    
    for (let i = 0; i < 3; i++) {
      const signer = await provider.getSigner(i);
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);
      
      console.log(`Account ${i}:`);
      console.log(`   Address: ${address}`);
      console.log(`   Balance: ${ethBalance} ETH`);
      console.log("");
    }
    
    console.log("═══════════════════════════════════════════════");
    console.log("MetaMask Network Settings:");
    console.log("═══════════════════════════════════════════════");
    console.log("Network Name: Ganache Local");
    console.log("RPC URL: http://127.0.0.1:8545");
    console.log("Chain ID: 31337");
    console.log("Currency: ETH");
    console.log("═══════════════════════════════════════════════\n");
    
    console.log("✅ If your imported account matches one of the addresses above,");
    console.log("   make sure MetaMask is connected to 'Ganache Local' network!\n");
    
  } catch (error) {
    console.error("❌ Cannot connect to Ganache!");
    console.error("   Make sure Ganache is running on port 8545");
    console.error(`   Error: ${error.message}\n`);
  }
}

checkGanache();
