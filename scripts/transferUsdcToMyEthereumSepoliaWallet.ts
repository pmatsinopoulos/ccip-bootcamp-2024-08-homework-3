import hre, { ethers } from "hardhat";
import { TransferUSDC } from "../typechain-types";
import CustomNetworkConfig from "../types/CustomNetworkConfig";

const CONTRACT_NAME = "TransferUSDC";

const main = async () => {
  console.log("Starting ...");

  const [owner] = await ethers.getSigners();
  const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const contractAddress = "0x0881F2eB42931C565c3dEf5c0b1DB302A2505E9d";
  const contract = ContractFactory.attach(contractAddress) as TransferUSDC;

  const ethereumSepoliaConfig = hre.config.networks
    .ethereumSepolia as CustomNetworkConfig;
  const ethereumSepoliaChainSelector = ethereumSepoliaConfig.chainSelector;

  const trx = await contract.transferUsdc(
    ethereumSepoliaChainSelector,
    owner,
    1_000_000n,
    0n
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
