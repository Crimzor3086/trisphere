// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title TriSphereReputation — on-chain contributor reputation across roles
contract TriSphereReputation is Ownable {
    mapping(address => uint256) public totalScore;
    mapping(address => mapping(bytes32 => uint256)) public metric;

    event ReputationUpdated(address indexed user, bytes32 indexed metricKey, uint256 newValue, int256 delta);

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyRegistrar() {
        require(msg.sender == owner() || registrars[msg.sender], "Not registrar");
        _;
    }

    mapping(address => bool) public registrars;

    function setRegistrar(address account, bool allowed) external onlyOwner {
        registrars[account] = allowed;
    }

    function record(address user, bytes32 metricKey, uint256 delta) external onlyRegistrar {
        metric[user][metricKey] += delta;
        totalScore[user] += delta;
        emit ReputationUpdated(user, metricKey, metric[user][metricKey], int256(delta));
    }
}
