// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlockchainDemo
 * @dev A comprehensive smart contract for the demonstration simulator.
 * Handles simple payments, supply chain tracking, and state storage.
 */
contract BlockchainDemo {
    // --- Events ---
    event PaymentSent(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    event SupplyChainUpdated(uint256 indexed itemId, string location, string status, uint256 timestamp);
    event ValueChanged(string oldValue, string newValue, address indexed by);

    // --- State Variables ---
    string public storedValue;
    address public owner;

    struct SupplyChainItem {
        uint256 id;
        string name;
        string currentLocation;
        string status;
        uint256 lastUpdated;
        address owner;
    }

    mapping(uint256 => SupplyChainItem) public items;
    uint256 public itemCount;

    constructor() {
        owner = msg.sender;
        storedValue = "Initial Value";
    }

    // --- Transaction Demo Functions ---

    /**
     * @dev Sends a payment to the contract and emits an event simulating a transfer.
     * In a real app, you might transfer ETH directly to the 'to' address.
     */
    function sendPayment(address payable _to) public payable {
        require(msg.value > 0, "Must send some ETH");
        
        // In this demo, we just forward the ETH to the recipient
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit PaymentSent(msg.sender, _to, msg.value, block.timestamp);
    }

    // --- Supply Chain Demo Functions ---

    function createItem(string memory _name, string memory _location) public returns (uint256) {
        itemCount++;
        items[itemCount] = SupplyChainItem({
            id: itemCount,
            name: _name,
            currentLocation: _location,
            status: "Created",
            lastUpdated: block.timestamp,
            owner: msg.sender
        });

        emit SupplyChainUpdated(itemCount, _location, "Created", block.timestamp);
        return itemCount;
    }

    function updateItem(uint256 _id, string memory _location, string memory _status) public {
        // For demo simplicity, we allow updating non-existent items (simulating creation if needed)
        // or just updating the event log if the item doesn't strictly exist in state for this specific demo flow
        
        emit SupplyChainUpdated(_id, _location, _status, block.timestamp);
        
        if (_id > 0 && _id <= itemCount) {
             items[_id].currentLocation = _location;
             items[_id].status = _status;
             items[_id].lastUpdated = block.timestamp;
        }
    }

    function getItem(uint256 _id) public view returns (SupplyChainItem memory) {
        return items[_id];
    }

    // --- Smart Contract Logic Demo Functions ---

    function setStoredValue(string memory _newValue) public {
        string memory oldValue = storedValue;
        storedValue = _newValue;
        emit ValueChanged(oldValue, _newValue, msg.sender);
    }

    function getStoredValue() public view returns (string memory) {
        return storedValue;
    }
}
