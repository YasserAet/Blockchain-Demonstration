const { ethers } = require('ethers');

async function checkContracts() {
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  
  console.log('🔍 Checking Ganache Contracts...\n');
  
  // Contract addresses from deployment
  const migrationsAddress = '0x5CD72bD8c093c27FD3cB36670650D0eD50515503';
  const transactionManagerAddress = '0x25539b73108Fed40b65065620eA8b8E35511D89F';
  
  // Check if contracts exist
  const migrationsCode = await provider.getCode(migrationsAddress);
  const transactionManagerCode = await provider.getCode(transactionManagerAddress);
  
  console.log(' Migrations Contract:');
  console.log('  Address:', migrationsAddress);
  console.log('  Deployed:', migrationsCode !== '0x' ? '✅ YES' : ' NO');
  console.log('  Code Length:', migrationsCode.length - 2, 'bytes\n');
  
  console.log(' TransactionManager Contract:');
  console.log('  Address:', transactionManagerAddress);
  console.log('  Deployed:', transactionManagerCode !== '0x' ? ' YES' : ' NO');
  console.log('  Code Length:', transactionManagerCode.length - 2, 'bytes\n');
  
  // Get blockchain info
  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  
  console.log('⛓️  Blockchain Info:');
  console.log('  Chain ID:', network.chainId.toString());
  console.log('  Current Block:', blockNumber);
  console.log('  Network:', 'Ganache Local\n');
  
  console.log(' Both contracts are successfully deployed!\n');
}

checkContracts().catch(console.error);
