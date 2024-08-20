# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

# Day 3, Exercise 4

I have used
```bash
$ npx hardhat ignition deploy ./ignition/modules/TransferUSDC.ts --network avalancheFuji
```

This deployed the `TransferUSDC` contract to Avalanche Fuji.

Then I allowed Ethereum Sepolia as destination on Avalanche Fuji TransferUSDC contract:

```bash
$ npx hardhat --network avalancheFuji run scripts/allowEthereumSepolia.ts
```

Then, on AvalancheFuji, I fund TransferUSDC with 3 LINK. This I can do it from my Metamask
chrome extension by sending LINK to the contract address.

Then I use the `https://testnet.snowtrace.io/address/0x5425890298aed601595a70AB815c96711a31Bc65/contract/43113/writeProxyContract?chainid=43113`
to approve the TransferUSDC contract to spend 1 USDC on behave of myself.

Then I call the `TransferUSDC#transferUsdc()` function:

```bash
$ npx hardhat --network avalancheFuji run scripts/transferUsdcToMyEthereumSepoliaWallet.ts
```

Then I watched the transaction via CCIP Explorer until it went to status `success`.

Then I confirmed that my wallet had 1 extra USDC on Ethereum Sepolia.

# Day 3, Homework 3

The first part of the homework was to do a gas estimation in my local environment,
by writing a test.

I wrote the test [test/EstimateCcipReceiveGas.ts](./test/EstimateCcipReceiveGas.ts).

When I ran it with

```bash
$ npx hardhat test --grep 'gas estimation'
```

I got back the results:

```
  Sender and Receiver
Gas Estimation TEST
Final Gas Usage Report:
Number of iterations 0 - Gas used: 6386
Number of iterations 50 - Gas used: 12786
Number of iterations 99 - Gas used: 19058
```
