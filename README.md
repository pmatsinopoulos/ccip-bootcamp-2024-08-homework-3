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
