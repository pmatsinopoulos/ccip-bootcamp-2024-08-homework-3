import hre, { ethers, network } from "hardhat";
import { SupportedNetworks, getCCIPConfig } from "../ccip.config";
import deployedContracts from "./generatedData.json";
import CustomNetworkConfig from "../types/CustomNetworkConfig";

// This function is designed to send CCIP messages across networks using the deployed Sender contract.
async function sendCCIPMessages(currentNetwork: SupportedNetworks) {
  // Retrieve the current signer to use for transactions. This will be Avalanche Fuji.

  console.debug("currentNetwork", currentNetwork);

  const provider = ethers.provider;
  const signer = await provider.getSigner();
  const balance = await provider.getBalance(signer);

  const balanceFormatted = ethers.formatEther(balance);

  console.debug("balanceFormatted", balanceFormatted);

  // Retrieve the Sender contract's instance using its address for the current network.
  const senderAddress = (
    deployedContracts[currentNetwork] as { sender: string }
  ).sender; // This is the TransferUSDC on Avalanche Fuji for example

  console.debug("senderAddress", senderAddress);
  const sender = await ethers.getContractAt(
    "TransferUSDC",
    senderAddress,
    signer
  );

  console.debug("sender (TransferUSDC) contract", sender);
  // -------------------------------------------------------

  const ethereumSepoliaNetwork = hre.config.networks
    .ethereumSepolia as CustomNetworkConfig;

  const destinationChainSelector = ethereumSepoliaNetwork.chainSelector; // Ethereum Sepolia

  const gasLimit = 500_000;

  console.debug(
    "destinationChainSelector",
    destinationChainSelector,
    "receiver",
    signer,
    "amount",
    1_000_000,
    "gasLimit",
    gasLimit
  );

  const tx = await sender.transferUsdc(
    destinationChainSelector,
    signer,
    1,
    gasLimit
  );

  console.debug("tx", tx);

  const receipt = await tx.wait();

  if (receipt) {
    // Now, access the logs and decode the event
    for (const log of receipt.logs) {
      try {
        // Attempt to decode the log using the interface
        const parsedLog = sender.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "UsdcTransferred") {
          console.debug("UsdcTransferred", parsedLog);

          const messageId = parsedLog.args.messageId;
          console.log("Message ID:", messageId);
          break; // Once we find the event, no need to keep searching
        }
      } catch (err) {
        // If the log isn't from your contract, it won't be parsed successfully
        continue;
      }
    }
  }

  // // Retrieve gas used from the last message executed by querying the router's events.
  // const mockRouterEvents = await router.queryFilter(router.filters.MsgExecuted);
  // const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
  // const gasUsed = mockRouterEvent.args.gasUsed;

  // // Push the report of iterations and gas used to the array.
  // gasUsageReport.push({
  //   iterations,
  //   gasUsed: gasUsed.toString(),
  // });
}

// Execute the sendCCIPMessages function with the current network.
sendCCIPMessages(network.name as SupportedNetworks).catch((error) => {
  console.error("Error occurred:", error);
  process.exit(1);
});
