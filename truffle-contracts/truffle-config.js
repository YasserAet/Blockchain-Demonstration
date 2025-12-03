module.exports = {
  networks: {
    // Development network (Ganache)
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Standard Ganache port
      network_id: "*",       // Match any network id
      gas: 6721975,          // Gas limit
      gasPrice: 20000000000  // 20 gwei
    },

    // Ganache GUI
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },

    // Local Hardhat network
    hardhat: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "31337"
    }
  },

  // Configure compilers
  compilers: {
    solc: {
      version: "0.8.19",      // Fetch exact version from solc-bin
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "paris"
      }
    }
  },

  // Configure plugins
  plugins: [],

  // Set default mocha options
  mocha: {
    timeout: 100000
  },

  // Configure contracts directory
  contracts_directory: './contracts',
  contracts_build_directory: './build/contracts',

  // Configure migrations directory
  migrations_directory: './migrations'
};
