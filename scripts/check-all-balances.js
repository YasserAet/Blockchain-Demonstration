// Check balances of all your imported MetaMask accounts
const ethers = require("ethers");

async function checkAllBalances() {
  console.log("💰 Checking All Account Balances...\n");
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  try {
    const network = await provider.getNetwork();
    console.log(`✅ Connected to Ganache (Chain ID: ${network.chainId})\n`);
    
    // Common Ganache accounts you might have imported
    const accounts = [
      { name: "Account #0 (Deployer)", address: "0x12CAC184EaF07fbf21C37a3154C5E63B9ADcb503" },
      { name: "Account #1", address: "0x1adf130d1532E15C3E5769E1b318A4dCD40Eb0f7" },
      { name: "Account #2", address: "0x4Cdf84A9CCcf9d4CC0c8E344889d49c98906dE5a" },
      { name: "Account #3", address: "0xd2a6eC6bdCF13363fE31A92F9359edD8E77B4F19" },
      { name: "Account #4", address: "0xE655bBE0289F0f04A49B9Eb6a59e548AaAdaBf72" },
    ];
    
    console.log("📊 Account Balances:");
    console.log("=".repeat(70));
    
    for (const account of accounts) {
      const balance = await provider.getBalance(account.address);
      const ethBalance = ethers.formatEther(balance);
      const hasBalance = parseFloat(ethBalance) > 0;
      
      const icon = hasBalance ? "✅" : "⚪";
      const balanceStr = hasBalance 
        ? ethBalance.padEnd(25) + " ETH"
        : "0 ETH (Not used)".padEnd(30);
      
      console.log(`${icon} ${account.name.padEnd(25)} ${balanceStr}`);
      console.log(`   Address: ${account.address}`);
      console.log();
    }
    
    console.log("=".repeat(70));
    console.log("\n💡 Tips:");
    console.log("   - ✅ = Account has been used (has ETH)");
    console.log("   - ⚪ = Account not used yet");
    console.log("\n   To import an account to MetaMask:");
    console.log("   1. Look at Ganache terminal for private keys");
    console.log("   2. Find the key for the account you want");
    console.log("   3. Import it: MetaMask → Import Account → Paste key");
    console.log("\n   To see balance updates:");
    console.log("   - Switch between accounts in MetaMask");
    console.log("   - Run this script again after transactions");
    
  } catch (error) {
    console.error("❌ Cannot connect to Ganache!");
    console.error("   Make sure Ganache is running: npm run blockchain:start");
  }
}

checkAllBalances();
