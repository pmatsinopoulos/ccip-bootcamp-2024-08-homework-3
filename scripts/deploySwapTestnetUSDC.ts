import { ethers, run, network } from "hardhat";
import { SupportedNetworks, getCCIPConfig } from "../ccip.config";
import { createOrUpdateConfigFile } from "../helper";

/**
 * Deploys and verifies the SwapTestnetUSDC contract on a specified network.
 * @param network The network where the SwapTestnetUSDC contract will be deployed.
 */
async function deployAndVerifySwapTestnetUSDC(network: SupportedNetworks) {
  // we need to deploy to given +network+
  const [owner] = await ethers.getSigners();

  const SwapTestnetUSDCFactory = await ethers.getContractFactory(
    "SwapTestnetUSDC"
  );

  const { usdcToken, compoundUsdcToken, fauceteer } = getCCIPConfig(network);

  const swapTestnetUSDC = await SwapTestnetUSDCFactory.deploy(
    usdcToken,
    compoundUsdcToken,
    fauceteer
  );

  await swapTestnetUSDC.waitForDeployment();

  // Retrieve the transaction used for deploying the contract.
  const tx = swapTestnetUSDC.deploymentTransaction();
  if (tx) {
    console.log("wait for 5 blocks");

    // Wait for 5 confirmations to ensure the transaction is well-confirmed on the network.
    await tx.wait(5);

    // Get the deployed contract address.
    const swapTestnetUSDCAddress = await swapTestnetUSDC.getAddress();
    console.log(
      "SwapTestnetUSDC contract deployed at:",
      swapTestnetUSDCAddress
    );

    console.log(`Verifying SwapTestnetUSDC contract on ${network}...`);
    try {
      // Attempt to verify the contract on Etherscan (or similar explorer for the specified network).
      await run("verify:verify", {
        address: swapTestnetUSDCAddress,
        constructorArguments: [usdcToken, compoundUsdcToken, fauceteer],
      });
      console.log(`SwapTestnetUSDC contract verified on ${network}!`);
    } catch (error) {
      console.error("Error verifying SwapTestnetUSDC contract:", error);
    }

    // Update the configuration file with the new contract address.
    await createOrUpdateConfigFile(network, {
      swapTestnetUSDCAddress: swapTestnetUSDCAddress,
    });
  }
}

// Start the deployment and verification process using the current network's name.
deployAndVerifySwapTestnetUSDC(network.name as SupportedNetworks).catch(
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
