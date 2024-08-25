import hre, { ethers } from "hardhat";
import { TransferUSDC } from "../typechain-types";
import CustomNetworkConfig from "../types/CustomNetworkConfig";
import generatedData from "./generatedData.json";
import deployedAddresses from "../ignition/deployments/chain-43113/deployed_addresses.json";

const CONTRACT_NAME = "TransferUSDC";

const main = async () => {
  console.log("Starting ...");

  const contractAddress = deployedAddresses["TransferUSDCModule#TransferUSDC"];

  const contract = await ethers.getContractAt("TransferUSDC", contractAddress);

  console.debug("contractAddress", contractAddress);

  const ethereumSepoliaConfig = hre.config.networks
    .ethereumSepolia as CustomNetworkConfig;
  const ethereumSepoliaChainSelector = ethereumSepoliaConfig.chainSelector;

  console.debug("ethereumSepoliaChainSelector", ethereumSepoliaChainSelector);

  const crossChainReceiverAddress =
    generatedData.ethereumSepolia.crossChainReceiverAddress;

  console.debug("crossChainReceiverAddress", crossChainReceiverAddress);

  const trx = await contract.transferUsdc(
    ethereumSepoliaChainSelector,
    crossChainReceiverAddress,
    1000000n,
    500000n
  );

  const receipt = await trx.wait();

  console.debug("Receipt", receipt);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
