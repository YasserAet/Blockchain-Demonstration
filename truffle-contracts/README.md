# Truffle Transaction Smart Contract

A comprehensive Truffle project for managing blockchain transactions with advanced features.

##  Project Structure

```
truffle-contracts/
├── contracts/
│   ├── TransactionManager.sol    # Main transaction contract
│   └── Migrations.sol             # Truffle migrations contract
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_transaction_manager.js
├── test/
│   └── TransactionManager.test.js # Comprehensive test suite
├── package.json
└── truffle-config.js              # Truffle configuration
```

---

##  Features

### TransactionManager Contract

#### 1️⃣ **Deposit & Withdraw**
- Deposit ETH into the contract
- Withdraw funds with balance checks
- Event tracking for all transactions

#### 2️⃣ **Transaction Management**
- Create transactions with sender, receiver, amount, and message
- Execute pending transactions
- Cancel pending transactions
- Track transaction status (Pending, Completed, Failed, Cancelled)

#### 3️⃣ **Advanced Features**
- Direct send (create + execute in one call)
- User transaction history
- Contract statistics (total transactions, volume, balance)
- Role-based permissions

#### 4️⃣ **Security**
- Balance validation
- Authorization checks
- Safe fund transfers
- Reentrancy protection

---

##  Installation

### Prerequisites
- Node.js v16+ (v24.11.1 in your case)
- Ganache (already running on port 8545)
- Truffle

### Install Dependencies

```powershell
cd truffle-contracts
npm install
```

This will install:
- `truffle` - Smart contract development framework
- `@truffle/hdwallet-provider` - Wallet provider for deployments
- `@openzeppelin/contracts` - Secure, audited contract library

---

##  Configuration

The project is configured to work with your existing **Ganache** setup:

### Networks (truffle-config.js)
- **development**: Localhost:8545 (your current Ganache)
- **ganache**: Localhost:7545 (Ganache GUI)
- **hardhat**: Localhost:8545, Chain ID 31337

### Compiler
- Solidity: `0.8.19`
- Optimizer: Enabled (200 runs)
- EVM Version: Paris

---

## 🛠️ Usage

### 1. Compile Contracts

```powershell
npm run compile
# or
truffle compile
```

### 2. Deploy to Ganache

Make sure Ganache is running on port 8545, then:

```powershell
npm run migrate
# or
truffle migrate
```

To reset and redeploy:

```powershell
npm run migrate:reset
# or
truffle migrate --reset
```

### 3. Run Tests

```powershell
npm test
# or
truffle test
```

**Test Coverage:**
- ✅ Contract deployment
- ✅ Deposit and withdraw functionality
- ✅ Transaction creation
- ✅ Transaction execution
- ✅ Transaction cancellation
- ✅ Direct send transactions
- ✅ User transaction history
- ✅ Statistics and reporting
- ✅ Error handling and security

### 4. Truffle Console

Interact with deployed contracts:

```powershell
npm run console
# or
truffle console
```

Example console commands:

```javascript
// Get deployed contract
let manager = await TransactionManager.deployed()

// Get accounts
let accounts = await web3.eth.getAccounts()

// Deposit funds
await manager.deposit({ from: accounts[0], value: web3.utils.toWei("5", "ether") })

// Check balance
let balance = await manager.getBalance(accounts[0])
console.log(web3.utils.fromWei(balance, "ether"))

// Send transaction
await manager.sendTransaction(
  accounts[1], 
  web3.utils.toWei("1", "ether"), 
  "Test transaction",
  { from: accounts[0] }
)

// Get statistics
let stats = await manager.getStatistics()
console.log("Total transactions:", stats.totalTxns.toString())
console.log("Total volume:", web3.utils.fromWei(stats.totalVolume, "ether"))
```

### 5. Truffle Develop (Built-in Blockchain)

Start Truffle's built-in blockchain:

```powershell
npm run dev
# or
truffle develop
```

This starts a development blockchain on port 9545 with 10 test accounts.

---

##  Contract API

### Main Functions

#### Deposit & Withdraw
```solidity
function deposit() public payable
function withdraw(uint256 _amount) public
function getBalance(address _user) public view returns (uint256)
```

#### Transaction Management
```solidity
function createTransaction(
    address _receiver,
    uint256 _amount,
    string memory _message
) public returns (uint256)

function executeTransaction(uint256 _transactionId) public

function cancelTransaction(uint256 _transactionId) public

function sendTransaction(
    address _receiver,
    uint256 _amount,
    string memory _message
) public returns (uint256)
```

#### Query Functions
```solidity
function getTransaction(uint256 _transactionId) public view returns (...)

function getUserTransactions(address _user) public view returns (uint256[] memory)

function getStatistics() public view returns (
    uint256 totalTxns,
    uint256 totalVolume,
    uint256 contractBalance
)
```

---

##  Events

```solidity
event TransactionCreated(uint256 indexed transactionId, address indexed sender, address indexed receiver, uint256 amount, uint256 timestamp)

event TransactionCompleted(uint256 indexed transactionId, address indexed sender, address indexed receiver, uint256 amount)

event TransactionFailed(uint256 indexed transactionId, string reason)

event TransactionCancelled(uint256 indexed transactionId, address indexed cancelledBy)

event BalanceDeposited(address indexed user, uint256 amount, uint256 newBalance)

event BalanceWithdrawn(address indexed user, uint256 amount, uint256 newBalance)
```

---

##  Security Features

1. **Access Control**
   - Owner-only functions
   - Sender authorization checks
   - Transaction existence validation

2. **Balance Protection**
   - Balance checks before transactions
   - Safe fund transfers
   - Withdrawal validation

3. **State Management**
   - Transaction status tracking
   - Immutable transaction history
   - Event logging for transparency

---

##  Test Results

The test suite includes **20+ test cases** covering:

- ✅ Deployment and initialization
- ✅ Deposit functionality
- ✅ Withdrawal with validation
- ✅ Transaction creation with various scenarios
- ✅ Transaction execution and balance updates
- ✅ Transaction cancellation and authorization
- ✅ Direct send functionality
- ✅ User transaction tracking
- ✅ Statistics and reporting
- ✅ Error handling and edge cases

---

##  Example Workflow

### Scenario: Alice sends 1 ETH to Bob

```javascript
// 1. Deploy contract
const manager = await TransactionManager.deployed()
const accounts = await web3.eth.getAccounts()
const alice = accounts[0]
const bob = accounts[1]

// 2. Alice deposits 5 ETH
await manager.deposit({ 
  from: alice, 
  value: web3.utils.toWei("5", "ether") 
})

// 3. Alice creates and executes transaction to Bob
const txId = await manager.sendTransaction(
  bob,
  web3.utils.toWei("1", "ether"),
  "Payment for services",
  { from: alice }
)

// 4. Check balances
const aliceBalance = await manager.getBalance(alice)
const bobBalance = await manager.getBalance(bob)

console.log("Alice:", web3.utils.fromWei(aliceBalance, "ether"), "ETH")
console.log("Bob:", web3.utils.fromWei(bobBalance, "ether"), "ETH")

// 5. Get transaction details
const txn = await manager.getTransaction(txId.receipt.logs[0].args.transactionId)
console.log("Transaction:", txn)
```

---

##  Integration with Your Next.js App

To use this contract in your blockchain demonstration:

1. **Copy the ABI after compilation:**
   ```powershell
   # After running: truffle compile
   # Copy from: truffle-contracts/build/contracts/TransactionManager.json
   ```

2. **Update your web3 integration:**
   ```typescript
   import TransactionManagerABI from './truffle-contracts/build/contracts/TransactionManager.json'
   
   const contract = new ethers.Contract(
     contractAddress,
     TransactionManagerABI.abi,
     signer
   )
   ```

3. **Use in your demo:**
   ```typescript
   // Deposit
   await contract.deposit({ value: ethers.parseEther("1.0") })
   
   // Send transaction
   await contract.sendTransaction(
     receiverAddress,
     ethers.parseEther("0.5"),
     "Demo transaction"
   )
   ```

---

##  Additional Resources

- [Truffle Documentation](https://trufflesuite.com/docs/truffle/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)

---

##  Next Steps

1. ✅ **Installed dependencies**: `npm install`
2. ✅ **Compile contracts**: `npm run compile`
3. ✅ **Deploy to Ganache**: `npm run migrate`
4. ✅ **Run tests**: `npm test`
5. 🔄 **Integrate with Next.js app**
6. 🔄 **Test real transactions in your demo**

---

## 💡 Tips

- **Keep Ganache Running**: The contract needs the blockchain on port 8545
- **Check Gas Prices**: Adjust in truffle-config.js if needed
- **Test First**: Always run tests before integrating
- **Use Console**: Great for debugging and experimenting
- **Event Logging**: Monitor events for transaction tracking

---

##  Troubleshooting

### "Network not found"
- Make sure Ganache is running on port 8545
- Check `truffle-config.js` network settings

### "Insufficient funds"
- Ensure the account has enough balance
- Deposit funds before creating transactions

### "Transaction reverted"
- Check error messages in transaction receipt
- Verify contract state and permissions

---