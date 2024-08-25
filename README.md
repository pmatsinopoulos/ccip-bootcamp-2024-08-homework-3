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

# Day 3, Homework 3 - Preparation

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

Then I continued with gas estimation on a testnet.

I deployed Sender on the Avalanche Fuji and the Receiver on Ethereum Sepolia

```bash
$ npx hardhat run scripts/deploySender.ts --network avalancheFuji
```

and

```bash
$ npx hardhat run scripts/deployReceiver.ts --network ethereumSepolia
```

Then I allowed the Sender on Avalanche Fuji to send messages to Ethereum Sepolia.

```bash
$ npx hardhat run scripts/allowlistingForSender.ts --network avalancheFuji
```

and then I allowed the Receiver on Ethereum Sepolia to receive messages from the Sender.

```bash
$ npx hardhat run scripts/allowlistingForReceiver.ts --network ethereumSepolia
```

Then I sent 3 CCIP messages with different number of iterations:

```bash
$ npx hardhat run scripts/sendCCIPMessages.ts --network avalancheFuji
```

I got back these message ids per iteration:

```
Number of iterations 0 - Gas limit: 5685 - Message Id: 0x9a60f348a87944abcc18cec87640941055dfee1f96e488aaa3f7a5785cd611a2
Number of iterations 50 - Gas limit: 16190 - Message Id: 0x4f7dff51047644d0d5c1208157d9152afe737d6b2f743266b5b4225e4277fef6
Number of iterations 99 - Gas limit: 26485 - Message Id: 0xccdc2b5abdce83cc381c5ffc8aede7fa6aeb53f0d1486c263ec5eff4cc6b786a
```

I went to [CCIP Explorer](https://ccip.chain.link/) and I tried to locate each one of these messages to follow up with their
state, until they are successful and I can see the Ethereum Sepolia (destination) transaction hash.

The destination transaction hashes per message were:

| message id                                                         | Ethereum Sepolia transaction hash                                  |
|--------------------------------------------------------------------|--------------------------------------------------------------------|
| 0x9a60f348a87944abcc18cec87640941055dfee1f96e488aaa3f7a5785cd611a2 | 0xe6cdcd9032c5b3b4595b7152e5221bb1a394f95ac601b695d2e3f2e6f3e39f63 |
| 0x4f7dff51047644d0d5c1208157d9152afe737d6b2f743266b5b4225e4277fef6 | 0x990dbe5ae2d1f659f078f8ee62faa9d5a7336cd8aa5225191ae5ab1eca087d4b |
| 0xccdc2b5abdce83cc381c5ffc8aede7fa6aeb53f0d1486c263ec5eff4cc6b786a | 0x990dbe5ae2d1f659f078f8ee62faa9d5a7336cd8aa5225191ae5ab1eca087d4b |

Note that the first transaction, initially, has failed and I had to repeat it manually. It failed because I ran out of gas. I didn't have
enough ETH in my wallet to pay for the gas.

Then I went Tenderly to locate the transactions and the `_callWithExactGasSafeReturnData` to find out how much gas was actually used.

| Number of iterations | Gas used during local testing | Gas limit on testnet          | Gas used on testnet |
|----------------------|-------------------------------|-------------------------------|---------------------|
| 0                    | 5685                          | 10000 (this was set manually) | 6260                |
| 50                   | 16190                         | 16190                         | 12660               |
| 99                   | 26485                         | 26485                         | 18932               |

I can see that in testnet, the gas used was quite less. Maybe because I executed the CCIP transfers the next day?

Then I used Offchain methods.

First the estimation of gas using a Web3 provider

```bash
$ npm run estimate-gas-provider
```

which returned:

Final Gas Usage Report:
Number of iterations: 0 - Gas used: 6609
Number of iterations: 50 - Gas used: 13022
Number of iterations: 99 - Gas used: 19306

These results are quite close the testnet results. A little bit higher.

Then I used the Offchain method with Tenderly.

```bash
$ npm run estimate-gas-tenderly
```

which returned:

Final Gas Usage Report:
Number of iterations: 0 - Gas used: 6260
Number of iterations: 50 - Gas used: 12660
Number of iterations: 99 - Gas used: 18932

This actually, was **very accurate**. Compare it to the testnet results above.

# Day 3, Homework 3 - Actual

I am now following the [Exercise #2: Deposit transferred USDC to Compound V3](https://cll-devrel.gitbook.io/ccip-masterclass-4/ccip-masterclass/exercise-2-deposit-transferred-usdc-to-compound-v3)

I create the `SwapTestnetUSDC.sol` file and I copy / paste the content from the page of the exercise.

Then I deploy the `SwapTestnetUSDC` contract in Ethereum Sepolia and I verify it:

```bash
$ npx hardhat --network ethereumSepolia run scripts/deploySwapTestnetUSDC.ts
```
This printed:

```
wait for 5 blocks
SwapTestnetUSDC contract deployed at: 0x5129A2bd7F6F8eA96C3184e1282bd07b2Be53A1B
Verifying SwapTestnetUSDC contract on ethereumSepolia...
Successfully submitted source code for contract
contracts/SwapTestnetUSDC.sol:SwapTestnetUSDC at 0x5129A2bd7F6F8eA96C3184e1282bd07b2Be53A1B
for verification on the block explorer. Waiting for verification result...

Successfully verified contract SwapTestnetUSDC on the block explorer.
https://sepolia.etherscan.io/address/0x5129A2bd7F6F8eA96C3184e1282bd07b2Be53A1B#code

SwapTestnetUSDC contract verified on ethereumSepolia!
Writing to config file: ./scripts/generatedData.json {
  avalancheFuji: { sender: '0xA726270ddddAcfE794c291A594d79fA16F9720E6' },
  ethereumSepolia: {
    receiver: '0x255C2FE20c414E93e51162C73E044e17d6afedAc',
    swapTestnetUSDCAddress: '0x5129A2bd7F6F8eA96C3184e1282bd07b2Be53A1B'
  }
}
```

happily having deployed and verified the contract.

On step 2, I have created the file `CrossChainReceiver.sol`. I have compiled it using `npx hardhat compile`, after
having, first, corrected some errors (wrong paths to imported files).

Then I deployed this contract on Ethereum Sepolia:

```bash
$ npx hardhat --network ethereumSepolia run scripts/deployCrossChainReceiver.ts
```

This printed out:

```
wait for 5 blocks
CrossChainReceiver contract deployed at: 0x5449951e0a77df2A75beF0F2b724b68F22B1f557
Verifying CrossChainReceiver contract on ethereumSepolia...
Successfully submitted source code for contract
contracts/CrossChainReceiver.sol:CrossChainReceiver at 0x5449951e0a77df2A75beF0F2b724b68F22B1f557
for verification on the block explorer. Waiting for verification result...

Successfully verified contract CrossChainReceiver on the block explorer.
https://sepolia.etherscan.io/address/0x5449951e0a77df2A75beF0F2b724b68F22B1f557#code

CrossChainReceiver contract verified on ethereumSepolia!
Writing to config file: ./scripts/generatedData.json {
  avalancheFuji: { sender: '0xA726270ddddAcfE794c291A594d79fA16F9720E6' },
  ethereumSepolia: {
    receiver: '0x255C2FE20c414E93e51162C73E044e17d6afedAc',
    swapTestnetUSDCAddress: '0x5129A2bd7F6F8eA96C3184e1282bd07b2Be53A1B',
    crossChainReceiverAddress: '0x5449951e0a77df2A75beF0F2b724b68F22B1f557'
  }
}
```

which happily confirmed that the contract is deployed and verified.

Then I need to allow `Avalanche Fuji` as the source chain on `Ethereum Sepolia`, The `TransferUSDC` contract on `Avalanche Fuji` as allowed sender in
`CrossChainReceiver` in `Ethereum Sepolia`. So, I need to call two functions:

- `allowlistSourceChain()` and
- `allowlistSender()`

both on `Ethereum Sepolia#CrossChainReceiver` smart contract.

I do it with the script:

```bash
$ npx hardhat --network ethereumSepolia run scripts/allowAvalancheFujiForCrossChainReceiver.ts
```

I go to the USDC token contract (`0x5425890298aed601595a70AB815c96711a31Bc65`) (on Avalanche Fuji) and I approve
the spender TransferUSDC Smart Contract (`0x0881F2eB42931C565c3dEf5c0b1DB302A2505E9d`) to spend `1` USDC i.e. `1000000`
from my Avalanche Fuji USDC balance.

Then I run the script:

```bash
$ npx hardhat --network avalancheFuji run scripts/transferUsdcToMyEthereumSepoliaWalletExercise2.ts
```

This gave me the transaction hash: `0x7a937b1ee2a9a55209191201801ae1513963d710691df77336948087bf79e322` which I can watch
on [CCIP explorer](https://ccip.chain.link/msg/0xa20dd2b56be4003ecf2cf6eae65dc82cb9565e25eefbaea6435f767939ef3ef6).

I waited until this has become "Success".

Then I confirmed that my `Ethereum Sepolia` account had one more USDC.

But, the Gas Limit was `500_000` as initially set in the body of the method, hard coded. Can I know how much was actually
used? I can trace it in Tenderly, using the destination transaction hash, I go to Tenderly and I try to locate
the function call `_callWithExactGasSafeReturnData` with payload the message id `0xa20dd2b56be4003ecf2cf6eae65dc82cb9565e25eefbaea6435f767939ef3ef6`.
We are looking for the call trace from Router to CrossChainReceiver.

```
"gas":{
  "gas_left":7463927
  "gas_used":193309
  "total_gas_used":536073
}
```
We set gas limit to `500_000`, but the actual initial gas assumed was `7_463_927`. Maybe network was congested.
But, at the end, `gas_used` is giving `193_309`.

Do we have any other means to estimate the gas?

1. We can use the `MockCCIPRouter` contract:
