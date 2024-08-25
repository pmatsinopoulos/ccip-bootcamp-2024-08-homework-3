// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.20;

// Panagiotis Matsinopoulos
// Taken from https://sepolia.etherscan.io/address/0x68793ea49297eb75dfb4610b68e076d2a5c7646c#code
// for the purposeof the home exercise 3 for the CCIP Bootcamp
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";

contract Fauceteer {
    /// @notice Mapping of user address -> asset address -> last time the user
    /// received that asset
    mapping(address => mapping(address => uint)) public lastReceived;

    /* errors */
    error BalanceTooLow();
    error RequestedTooFrequently();
    error TransferFailed();

    function drip(address token) public {
        uint balance = IERC20(token).balanceOf(address(this));
        if (balance <= 0) revert BalanceTooLow();

        if (block.timestamp - lastReceived[msg.sender][token] < 1 days)
            revert RequestedTooFrequently();

        lastReceived[msg.sender][token] = block.timestamp;

        bool success = IERC20(token).transfer(msg.sender, balance / 10000); // 0.01%
        if (!success) revert TransferFailed();
    }
}
