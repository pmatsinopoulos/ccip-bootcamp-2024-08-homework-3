import { ethers, network } from "hardhat";
import { SupportedNetworks, getCCIPConfig } from "../ccip.config";
import deployedContracts from "./generatedData.json";

async function allowAvalancheFujiForCrossChainReceiver(
  currentNetwork: SupportedNetworks
) {
  // Get the CrossChainReceiver contract instance
  const crossChainReceiverAddress = (
    deployedContracts[currentNetwork] as { crossChainReceiverAddress: string }
  ).crossChainReceiverAddress;
  const crossChainReceiver = await ethers.getContractAt(
    "CrossChainReceiver",
    crossChainReceiverAddress
  );

  // Iterate over each supported network
  for (const network in deployedContracts) {
    const supportedNetwork = network as SupportedNetworks;
    const sender = (deployedContracts[supportedNetwork] as { sender: string })
      .sender; // TransferUSDC.sol

    if (sender) {
      // Fetch the destination chain selector
      const sourceChainSelector = getCCIPConfig(supportedNetwork).chainSelector;

      let trx = await crossChainReceiver.allowlistSourceChain(
        sourceChainSelector,
        true
      );

      let receipt = await trx.wait();

      console.debug("Allow list source chain, Receipt", receipt);

      trx = await crossChainReceiver.allowlistSender(sender, true);

      receipt = await trx.wait();

      console.debug("Allow list sender smart contract, Receipt", receipt);

      console.log(`Allowlisted: ${supportedNetwork} , ${sender}`);
    }
  }
}

allowAvalancheFujiForCrossChainReceiver(
  network.name as SupportedNetworks
).catch((error) => {
  console.error(error);
  process.exit(1);
});
