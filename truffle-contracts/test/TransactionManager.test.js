const TransactionManager = artifacts.require("TransactionManager");

contract("TransactionManager", (accounts) => {
  let transactionManager;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  beforeEach(async () => {
    transactionManager = await TransactionManager.new({ from: owner });
  });

  describe("Deployment", () => {
    it("should deploy successfully", async () => {
      const address = await transactionManager.address;
      assert.notEqual(address, "");
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("should set the correct owner", async () => {
      const contractOwner = await transactionManager.owner();
      assert.equal(contractOwner, owner);
    });

    it("should initialize with zero transactions", async () => {
      const counter = await transactionManager.transactionCounter();
      assert.equal(counter.toNumber(), 0);
    });
  });

  describe("Deposit and Withdraw", () => {
    it("should allow users to deposit funds", async () => {
      const depositAmount = web3.utils.toWei("1", "ether");
      
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });

      const balance = await transactionManager.getBalance(user1);
      assert.equal(balance.toString(), depositAmount);
    });

    it("should emit BalanceDeposited event on deposit", async () => {
      const depositAmount = web3.utils.toWei("1", "ether");
      
      const receipt = await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });

      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "BalanceDeposited");
      assert.equal(receipt.logs[0].args.user, user1);
      assert.equal(receipt.logs[0].args.amount.toString(), depositAmount);
    });

    it("should allow users to withdraw funds", async () => {
      const depositAmount = web3.utils.toWei("1", "ether");
      const withdrawAmount = web3.utils.toWei("0.5", "ether");

      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });

      const initialBalance = await web3.eth.getBalance(user1);
      
      await transactionManager.withdraw(withdrawAmount, { from: user1 });

      const contractBalance = await transactionManager.getBalance(user1);
      assert.equal(
        contractBalance.toString(), 
        web3.utils.toWei("0.5", "ether")
      );
    });

    it("should fail to withdraw with insufficient balance", async () => {
      const withdrawAmount = web3.utils.toWei("1", "ether");

      try {
        await transactionManager.withdraw(withdrawAmount, { from: user1 });
        assert.fail("Expected revert not received");
      } catch (error) {
        assert(
          error.message.includes("Insufficient balance"),
          "Expected 'Insufficient balance' error"
        );
      }
    });
  });

  describe("Transaction Creation", () => {
    beforeEach(async () => {
      const depositAmount = web3.utils.toWei("5", "ether");
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });
    });

    it("should create a transaction", async () => {
      const amount = web3.utils.toWei("1", "ether");
      const message = "Test transaction";

      const receipt = await transactionManager.createTransaction(
        user2,
        amount,
        message,
        { from: user1 }
      );

      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "TransactionCreated");

      const counter = await transactionManager.transactionCounter();
      assert.equal(counter.toNumber(), 1);
    });

    it("should store transaction details correctly", async () => {
      const amount = web3.utils.toWei("1", "ether");
      const message = "Test transaction";

      await transactionManager.createTransaction(
        user2,
        amount,
        message,
        { from: user1 }
      );

      const txn = await transactionManager.getTransaction(1);
      
      assert.equal(txn.id.toNumber(), 1);
      assert.equal(txn.sender, user1);
      assert.equal(txn.receiver, user2);
      assert.equal(txn.amount.toString(), amount);
      assert.equal(txn.message, message);
      assert.equal(txn.status.toNumber(), 0); // Pending
    });

    it("should fail to create transaction with zero amount", async () => {
      try {
        await transactionManager.createTransaction(
          user2,
          0,
          "Test",
          { from: user1 }
        );
        assert.fail("Expected revert not received");
      } catch (error) {
        assert(
          error.message.includes("Amount must be greater than 0"),
          "Expected 'Amount must be greater than 0' error"
        );
      }
    });

    it("should fail to create transaction to self", async () => {
      const amount = web3.utils.toWei("1", "ether");

      try {
        await transactionManager.createTransaction(
          user1,
          amount,
          "Test",
          { from: user1 }
        );
        assert.fail("Expected revert not received");
      } catch (error) {
        assert(
          error.message.includes("Cannot send to yourself"),
          "Expected 'Cannot send to yourself' error"
        );
      }
    });
  });

  describe("Transaction Execution", () => {
    beforeEach(async () => {
      const depositAmount = web3.utils.toWei("5", "ether");
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });
    });

    it("should execute a transaction", async () => {
      const amount = web3.utils.toWei("1", "ether");

      await transactionManager.createTransaction(
        user2,
        amount,
        "Test transaction",
        { from: user1 }
      );

      const receipt = await transactionManager.executeTransaction(1, {
        from: user1,
      });

      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "TransactionCompleted");

      const user1Balance = await transactionManager.getBalance(user1);
      const user2Balance = await transactionManager.getBalance(user2);

      assert.equal(user1Balance.toString(), web3.utils.toWei("4", "ether"));
      assert.equal(user2Balance.toString(), amount);
    });

    it("should update transaction status after execution", async () => {
      const amount = web3.utils.toWei("1", "ether");

      await transactionManager.createTransaction(
        user2,
        amount,
        "Test",
        { from: user1 }
      );

      await transactionManager.executeTransaction(1, { from: user1 });

      const txn = await transactionManager.getTransaction(1);
      assert.equal(txn.status.toNumber(), 1); // Completed
    });

    it("should update total transaction volume", async () => {
      const amount = web3.utils.toWei("1", "ether");

      await transactionManager.createTransaction(
        user2,
        amount,
        "Test",
        { from: user1 }
      );

      await transactionManager.executeTransaction(1, { from: user1 });

      const stats = await transactionManager.getStatistics();
      assert.equal(stats.totalVolume.toString(), amount);
    });
  });

  describe("Transaction Cancellation", () => {
    beforeEach(async () => {
      const depositAmount = web3.utils.toWei("5", "ether");
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });

      const amount = web3.utils.toWei("1", "ether");
      await transactionManager.createTransaction(
        user2,
        amount,
        "Test",
        { from: user1 }
      );
    });

    it("should allow sender to cancel transaction", async () => {
      const receipt = await transactionManager.cancelTransaction(1, {
        from: user1,
      });

      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "TransactionCancelled");

      const txn = await transactionManager.getTransaction(1);
      assert.equal(txn.status.toNumber(), 3); // Cancelled
    });

    it("should not allow non-sender to cancel transaction", async () => {
      try {
        await transactionManager.cancelTransaction(1, { from: user2 });
        assert.fail("Expected revert not received");
      } catch (error) {
        assert(
          error.message.includes("Not authorized"),
          "Expected 'Not authorized' error"
        );
      }
    });
  });

  describe("Direct Send Transaction", () => {
    beforeEach(async () => {
      const depositAmount = web3.utils.toWei("5", "ether");
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });
    });

    it("should create and execute transaction in one call", async () => {
      const amount = web3.utils.toWei("1", "ether");

      const receipt = await transactionManager.sendTransaction(
        user2,
        amount,
        "Direct send",
        { from: user1 }
      );

      // Should emit both TransactionCreated and TransactionCompleted
      assert.equal(receipt.logs.length, 2);

      const user1Balance = await transactionManager.getBalance(user1);
      const user2Balance = await transactionManager.getBalance(user2);

      assert.equal(user1Balance.toString(), web3.utils.toWei("4", "ether"));
      assert.equal(user2Balance.toString(), amount);
    });
  });

  describe("User Transactions", () => {
    beforeEach(async () => {
      const depositAmount = web3.utils.toWei("5", "ether");
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });
    });

    it("should track user transactions", async () => {
      const amount = web3.utils.toWei("1", "ether");

      await transactionManager.createTransaction(
        user2,
        amount,
        "Test 1",
        { from: user1 }
      );

      await transactionManager.createTransaction(
        user2,
        amount,
        "Test 2",
        { from: user1 }
      );

      const user1Txns = await transactionManager.getUserTransactions(user1);
      const user2Txns = await transactionManager.getUserTransactions(user2);

      assert.equal(user1Txns.length, 2);
      assert.equal(user2Txns.length, 2);
    });
  });

  describe("Statistics", () => {
    it("should return correct statistics", async () => {
      const depositAmount = web3.utils.toWei("5", "ether");
      await transactionManager.deposit({ 
        from: user1, 
        value: depositAmount 
      });

      const amount = web3.utils.toWei("1", "ether");
      await transactionManager.sendTransaction(
        user2,
        amount,
        "Test",
        { from: user1 }
      );

      const stats = await transactionManager.getStatistics();

      assert.equal(stats.totalTxns.toNumber(), 1);
      assert.equal(stats.totalVolume.toString(), amount);
      assert.equal(stats.contractBalance.toString(), depositAmount);
    });
  });
});
