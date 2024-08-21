import { ethers, run, network } from "hardhat";
import { SupportedNetworks, getCCIPConfig } from "../ccip.config";
import { createOrUpdateConfigFile } from "../helper";
import generatedData from "./generatedData.json";

/**
 * Deploys and verifies the CrossChainReceiver contract on a specified network.
 * @param network The network where the CrossChainReceiver contract will be deployed.
 */
async function deployAndVerifyCrossChainReceiver(network: SupportedNetworks) {
  // we need to deploy to given +network+
  const [owner] = await ethers.getSigners();

  const CrossChainReceiverFactory = await ethers.getContractFactory(
    "CrossChainReceiver"
  );

  const { router, cometAddress } = getCCIPConfig(network);

  const swapTestnetUsdcAddress =
    generatedData.ethereumSepolia.swapTestnetUSDCAddress;

  const crossChainReceiver = await CrossChainReceiverFactory.deploy(
    router,
    cometAddress,
    swapTestnetUsdcAddress
  );

  await crossChainReceiver.waitForDeployment();

  // Retrieve the transaction used for deploying the contract.
  const tx = crossChainReceiver.deploymentTransaction();
  if (tx) {
    console.log("wait for 5 blocks");

    // Wait for 5 confirmations to ensure the transaction is well-confirmed on the network.
    await tx.wait(5);

    // Get the deployed contract address.
    const crossChainReceiverAddress = await crossChainReceiver.getAddress();
    console.log(
      "CrossChainReceiver contract deployed at:",
      crossChainReceiverAddress
    );

    console.log(`Verifying CrossChainReceiver contract on ${network}...`);
    try {
      // Attempt to verify the contract on Etherscan (or similar explorer for the specified network).
      await run("verify:verify", {
        address: crossChainReceiverAddress,
        constructorArguments: [router, cometAddress, swapTestnetUsdcAddress],
      });
      console.log(`CrossChainReceiver contract verified on ${network}!`);
    } catch (error) {
      console.error("Error verifying CrossChainReceiver contract:", error);
    }

    // Update the configuration file with the new contract address.
    await createOrUpdateConfigFile(network, {
      crossChainReceiverAddress: crossChainReceiverAddress,
    });
  }
}

// Start the deployment and verification process using the current network's name.
deployAndVerifyCrossChainReceiver(network.name as SupportedNetworks).catch(
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
