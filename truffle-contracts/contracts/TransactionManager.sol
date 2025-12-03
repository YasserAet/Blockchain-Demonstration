// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TransactionManager
 * @dev A smart contract for managing blockchain transactions with advanced features
 * @notice This contract demonstrates real transaction management on the blockchain
 */
contract TransactionManager {
    
    // Transaction struct to store transaction details
    struct Transaction {
        uint256 id;
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
        string message;
        TransactionStatus status;
        bool exists;
    }
    
    // Transaction status enum
    enum TransactionStatus {
        Pending,
        Completed,
        Failed,
        Cancelled
    }
    
    // State variables
    address public owner;
    uint256 public transactionCounter;
    uint256 public totalTransactionVolume;
    
    // Mappings
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userTransactions;
    mapping(address => uint256) public balances;
    
    // Events
    event TransactionCreated(
        uint256 indexed transactionId,
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );
    
    event TransactionCompleted(
        uint256 indexed transactionId,
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );
    
    event TransactionFailed(
        uint256 indexed transactionId,
        string reason
    );
    
    event TransactionCancelled(
        uint256 indexed transactionId,
        address indexed cancelledBy
    );
    
    event BalanceDeposited(
        address indexed user,
        uint256 amount,
        uint256 newBalance
    );
    
    event BalanceWithdrawn(
        address indexed user,
        uint256 amount,
        uint256 newBalance
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier transactionExists(uint256 _transactionId) {
        require(transactions[_transactionId].exists, "Transaction does not exist");
        _;
    }
    
    modifier hasBalance(uint256 _amount) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        _;
    }
    
    /**
     * @dev Constructor sets the contract owner
     */
    constructor() {
        owner = msg.sender;
        transactionCounter = 0;
        totalTransactionVolume = 0;
    }
    
    /**
     * @dev Deposit funds into the contract
     * @notice Users can deposit ETH to use for transactions
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        balances[msg.sender] += msg.value;
        
        emit BalanceDeposited(msg.sender, msg.value, balances[msg.sender]);
    }
    
    /**
     * @dev Withdraw funds from the contract
     * @param _amount Amount to withdraw
     */
    function withdraw(uint256 _amount) public hasBalance(_amount) {
        balances[msg.sender] -= _amount;
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Withdrawal failed");
        
        emit BalanceWithdrawn(msg.sender, _amount, balances[msg.sender]);
    }
    
    /**
     * @dev Create a new transaction
     * @param _receiver Address of the receiver
     * @param _amount Amount to transfer
     * @param _message Optional message for the transaction
     * @return transactionId The ID of the created transaction
     */
    function createTransaction(
        address _receiver,
        uint256 _amount,
        string memory _message
    ) public hasBalance(_amount) returns (uint256) {
        require(_receiver != address(0), "Invalid receiver address");
        require(_receiver != msg.sender, "Cannot send to yourself");
        require(_amount > 0, "Amount must be greater than 0");
        
        transactionCounter++;
        uint256 transactionId = transactionCounter;
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            sender: msg.sender,
            receiver: _receiver,
            amount: _amount,
            timestamp: block.timestamp,
            message: _message,
            status: TransactionStatus.Pending,
            exists: true
        });
        
        userTransactions[msg.sender].push(transactionId);
        userTransactions[_receiver].push(transactionId);
        
        emit TransactionCreated(
            transactionId,
            msg.sender,
            _receiver,
            _amount,
            block.timestamp
        );
        
        return transactionId;
    }
    
    /**
     * @dev Execute a pending transaction
     * @param _transactionId ID of the transaction to execute
     */
    function executeTransaction(uint256 _transactionId) 
        public 
        transactionExists(_transactionId) 
    {
        Transaction storage txn = transactions[_transactionId];
        
        require(txn.status == TransactionStatus.Pending, "Transaction is not pending");
        require(msg.sender == txn.sender || msg.sender == owner, "Not authorized");
        require(balances[txn.sender] >= txn.amount, "Insufficient balance");
        
        // Transfer funds
        balances[txn.sender] -= txn.amount;
        balances[txn.receiver] += txn.amount;
        
        // Update transaction status
        txn.status = TransactionStatus.Completed;
        totalTransactionVolume += txn.amount;
        
        emit TransactionCompleted(
            _transactionId,
            txn.sender,
            txn.receiver,
            txn.amount
        );
    }
    
    /**
     * @dev Cancel a pending transaction
     * @param _transactionId ID of the transaction to cancel
     */
    function cancelTransaction(uint256 _transactionId) 
        public 
        transactionExists(_transactionId) 
    {
        Transaction storage txn = transactions[_transactionId];
        
        require(txn.status == TransactionStatus.Pending, "Transaction is not pending");
        require(msg.sender == txn.sender || msg.sender == owner, "Not authorized");
        
        txn.status = TransactionStatus.Cancelled;
        
        emit TransactionCancelled(_transactionId, msg.sender);
    }
    
    /**
     * @dev Get transaction details
     * @param _transactionId ID of the transaction
     * @return id The transaction ID
     * @return sender The sender's address
     * @return receiver The receiver's address
     * @return amount The transaction amount
     * @return timestamp The transaction timestamp
     * @return message The transaction message
     * @return status The transaction status
     */
    function getTransaction(uint256 _transactionId) 
        public 
        view 
        transactionExists(_transactionId)
        returns (
            uint256 id,
            address sender,
            address receiver,
            uint256 amount,
            uint256 timestamp,
            string memory message,
            TransactionStatus status
        ) 
    {
        Transaction memory txn = transactions[_transactionId];
        return (
            txn.id,
            txn.sender,
            txn.receiver,
            txn.amount,
            txn.timestamp,
            txn.message,
            txn.status
        );
    }
    
    /**
     * @dev Get all transaction IDs for a user
     * @param _user Address of the user
     * @return transactions Array of transaction IDs
     */
    function getUserTransactions(address _user) 
        public 
        view 
        returns (uint256[] memory transactions) 
    {
        return userTransactions[_user];
    }
    
    /**
     * @dev Get balance of a user
     * @param _user Address of the user
     * @return balance Balance of the user
     */
    function getBalance(address _user) public view returns (uint256 balance) {
        return balances[_user];
    }
    
    /**
     * @dev Get contract statistics
     * @return totalTxns Total number of transactions
     * @return totalVolume Total transaction volume
     * @return contractBalance Contract's ETH balance
     */
    function getStatistics() 
        public 
        view 
        returns (
            uint256 totalTxns,
            uint256 totalVolume,
            uint256 contractBalance
        ) 
    {
        return (
            transactionCounter,
            totalTransactionVolume,
            address(this).balance
        );
    }
    
    /**
     * @dev Send transaction directly (combined create and execute)
     * @param _receiver Address of the receiver
     * @param _amount Amount to transfer
     * @param _message Optional message
     * @return transactionId The ID of the created and executed transaction
     */
    function sendTransaction(
        address _receiver,
        uint256 _amount,
        string memory _message
    ) public hasBalance(_amount) returns (uint256) {
        uint256 txnId = createTransaction(_receiver, _amount, _message);
        executeTransaction(txnId);
        return txnId;
    }
    
    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {
        deposit();
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        deposit();
    }
}
