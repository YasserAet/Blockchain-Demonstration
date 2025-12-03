# Blockchain Demonstration Platform

An interactive educational platform demonstrating core blockchain concepts including immutability, consensus mechanisms, smart contracts, supply chain tracking, and cryptocurrency transactions.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Ganache Blockchain](#running-ganache-blockchain)
- [Deploying Smart Contracts](#deploying-smart-contracts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Available Demos](#available-demos)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Concepts
- **Immutability & Hashing**: Visualize how cryptographic hashing creates an unbreakable chain
- **Avalanche Effect**: See how tiny input changes create dramatically different hash outputs
- **Consensus Mechanisms**: Explore PoW, PoS, DPoS, and BFT consensus algorithms

### Real-World Applications
- **Cryptocurrency Transactions**: Simulate blockchain transactions
- **Supply Chain Tracking**: Track products from origin to consumer
- **Smart Contracts**: Deploy and interact with self-executing contracts

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## 📦 Installation

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <your-repository-url>
cd blockchain-demonstration-plan

# Or download and extract the ZIP file, then navigate to the folder
cd blockchain-demonstration-plan
```

### Step 2: Install Dependencies

Install the main project dependencies:

```bash
npm install
```

This will install:
- Next.js 16 (React framework)
- Ethers.js 6 (Ethereum library)
- Ganache CLI (Local blockchain)
- Hardhat (Smart contract development)
- Framer Motion (Animations)
- Radix UI components
- And all other required dependencies

### Step 3: Install Truffle Contract Dependencies

Navigate to the Truffle contracts folder and install its dependencies:

```bash
cd truffle-contracts
npm install
cd ..
```

## 🚀 Running the Application

### Option 1: Quick Start (Recommended)

Run everything with a single command:

```bash
# Start Ganache and the Next.js app
npm run dev
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### Option 2: Step-by-Step Start

#### 1. Start Ganache Blockchain

Open a **first terminal** and run:

```bash
npm run blockchain:start
```

This starts Ganache with:
- **Port**: 8545
- **Chain ID**: 31337
- **Accounts**: 20 pre-funded accounts
- **Default Balance**: 10,000 ETH per account

**Keep this terminal running!** You should see output like:

```
ganache v7.9.2 (@ganache/cli: 0.10.2, @ganache/core: 0.10.2)
Starting RPC server

Available Accounts
==================
(0) 0x12CAC184EaF07fbf21C37a3154C5E63B9ADcb503 (10000 ETH)
(1) 0x4b89... (10000 ETH)
...

Listening on 127.0.0.1:8545
```

#### 2. Start the Next.js Application

Open a **second terminal** and run:

```bash
npm run dev
```

You should see:

```
  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2s
```

#### 3. Open Your Browser

Navigate to: **http://localhost:3000**

## 🔗 Running Ganache Blockchain

### Using npm Script (Recommended)

```bash
npm run blockchain:start
```

### Manual Ganache Commands

If you need custom configuration:

```bash
# Basic start
npx ganache --port 8545

# With more accounts and higher balance
npx ganache --port 8545 --wallet.totalAccounts 50 --wallet.defaultBalance 50000

# With deterministic accounts (same accounts each time)
npx ganache --port 8545 --wallet.deterministic
```

### Verifying Ganache is Running

Check if Ganache is running:

```bash
curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

You should see a response with the current block number.

## 📜 Deploying Smart Contracts (Truffle)

### Deploy the TransactionManager Contract

The project includes a Truffle-based smart contract for managing transactions.

#### 1. Ensure Ganache is Running

```bash
npm run blockchain:start
```

#### 2. Deploy the Contracts

Open a **new terminal** and run:

```bash
cd truffle-contracts
npm run migrate
```

Or use the Truffle CLI directly:

```bash
cd truffle-contracts
npx truffle migrate --network development
```

You should see output like:

```
Compiling your contracts...
===========================
✔ Fetching solc version list from solc-bin. Attempt #1
✔ Downloading compiler. Attempt #1.
> Compiled successfully using:
   - solc: 0.8.19

Starting migrations...
======================
> Network name:    'development'
> Network id:      1764723088012
> Block gas limit: 30000000 (0x1c9c380)

1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x...
   > contract address:    0x5CD72bD8c093c27FD3cB36670650D0eD50515503
   > block number:        1
   > account:             0x12CAC184EaF07fbf21C37a3154C5E63B9ADcb503

2_deploy_transaction_manager.js
================================

   Deploying 'TransactionManager'
   ------------------------------
   > transaction hash:    0x...
   > contract address:    0x25539b73108Fed40b65065620eA8b8E35511D89F
   > block number:        3

Summary
=======
> Total deployments:   2
> Final cost:          0.02733648 ETH
```

#### 3. Verify Deployment

Check if the contract is deployed:

```bash
cd truffle-contracts
node check-deployment.js
```

Expected output:

```
Checking contract deployment on Ganache...

✅ Contract is deployed!
Contract Address: 0x25539b73108Fed40b65065620eA8b8E35511D89F
Code Size: 6234 bytes
Owner: 0x12CAC184EaF07fbf21C37a3154C5E63B9ADcb503
Transaction Counter: 0
```

## 🧪 Testing

### Test Truffle Smart Contracts

```bash
cd truffle-contracts
npm test
```

This runs the comprehensive test suite for the TransactionManager contract:

```
  Contract: TransactionManager
    Deployment
      ✓ should deploy successfully
      ✓ should set the correct owner
    Deposits
      ✓ should accept deposits
      ✓ should update user balance
      ✓ should reject zero deposits
    ... (20+ tests)

  21 passing (2s)
```

### Run Next.js Tests (if configured)

```bash
npm test
```

## 📁 Project Structure

```
blockchain-demonstration-plan/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── blockchain-simulator.tsx # Main simulator component
│   ├── demos/                   # Demo components
│   │   ├── consensus-demo.tsx
│   │   ├── immutability-demo.tsx
│   │   ├── smart-contract-demo.tsx
│   │   ├── supply-chain-demo.tsx
│   │   └── transaction-demo.tsx
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility libraries
│   ├── utils.ts
│   └── web3-context.tsx         # Web3 provider
├── truffle-contracts/           # Truffle smart contracts
│   ├── contracts/
│   │   ├── Migrations.sol
│   │   └── TransactionManager.sol
│   ├── migrations/              # Deployment scripts
│   ├── test/                    # Contract tests
│   ├── build/                   # Compiled contracts
│   ├── truffle-config.js        # Truffle configuration
│   └── package.json
├── public/                      # Static assets
├── package.json                 # Main dependencies
├── next.config.mjs              # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🎯 Available Demos

### 1. Immutability & Hashing Demo
- **Hashing Tab**: Enter text and see its cryptographic hash
- **Tampering Tab**: Add blocks and try to tamper with them to see how the chain breaks
- **Avalanche Tab**: Compare two similar inputs to see how tiny changes create completely different hashes

### 2. Consensus Mechanisms Demo
- **Proof of Work (PoW)**: Simulate Bitcoin-style mining
- **Proof of Stake (PoS)**: Validator selection based on stake
- **Delegated Proof of Stake (DPoS)**: Vote for delegates
- **Byzantine Fault Tolerance (BFT)**: Multi-round voting consensus

### 3. Cryptocurrency Transactions
- Create and broadcast transactions
- Watch transactions get verified
- See blocks being mined
- Visualize the blockchain growing

### 4. Supply Chain Tracking
- Track products through the supply chain
- Add verification at each stage
- View complete product history
- Ensure authenticity and transparency

### 5. Smart Contracts
- Deploy simple smart contracts
- Interact with contract functions
- See contract state changes
- View transaction history

## 🔍 Troubleshooting

### Issue: "Port 3000 is already in use"

**Solution**: Either stop the process using port 3000 or use a different port:

```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: "Port 8545 is already in use" (Ganache)

**Solution**: Kill the process using port 8545:

**Windows (PowerShell)**:
```powershell
# Find the process
netstat -ano | findstr :8545

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux**:
```bash
# Find and kill the process
lsof -ti:8545 | xargs kill -9
```

### Issue: "Cannot connect to Ganache"

**Solutions**:
1. Ensure Ganache is running: `npm run blockchain:start`
2. Check if it's listening on the correct port (8545)
3. Verify network configuration in `truffle-config.js`

### Issue: "Contract deployment failed"

**Solutions**:
1. Ensure Ganache is running before deploying
2. Clear the Truffle build folder:
   ```bash
   cd truffle-contracts
   rm -rf build/
   npx truffle migrate --reset
   ```
3. Check gas limits in `truffle-config.js`

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Also for truffle-contracts
cd truffle-contracts
rm -rf node_modules package-lock.json
npm install
```

### Issue: Next.js build errors

**Solution**: Clear Next.js cache:

```bash
rm -rf .next
npm run dev
```

## 📚 Additional Resources

### Truffle Documentation
- Truffle Docs: https://trufflesuite.com/docs/truffle/
- Ganache: https://trufflesuite.com/ganache/

### Next.js Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev/

### Blockchain Resources
- Ethereum: https://ethereum.org/en/developers/docs/
- Solidity: https://docs.soliditylang.org/

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Start local blockchain
npm run blockchain:start

# Deploy smart contracts (Hardhat - legacy)
npm run blockchain:deploy

# Test smart contracts (Hardhat - legacy)
npm run blockchain:test

# Truffle commands (in truffle-contracts/)
cd truffle-contracts
npm run compile    # Compile contracts
npm run migrate    # Deploy contracts
npm test          # Run tests
npx truffle console  # Interactive console
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is for educational purposes.

## 🎓 Educational Use

This platform is designed for:
- Learning blockchain fundamentals
- Understanding consensus mechanisms
- Visualizing cryptographic hashing
- Exploring smart contract development
- Teaching supply chain transparency
- Demonstrating cryptocurrency transactions

---

**Happy Learning! 🚀**

For questions or issues, please open an issue on the repository.
