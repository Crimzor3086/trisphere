// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title TriSphereTreasury — platform revenue from marketplace fees
contract TriSphereTreasury is Ownable {
    using SafeERC20 for IERC20;

    event RevenueReceived(address indexed token, address indexed from, uint256 amount, bytes32 indexed escrowId);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function depositFee(address token, uint256 amount, bytes32 escrowId) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit RevenueReceived(token, msg.sender, amount, escrowId);
    }

    function withdraw(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }
}
