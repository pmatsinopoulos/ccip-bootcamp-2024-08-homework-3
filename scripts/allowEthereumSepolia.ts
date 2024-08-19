import hre, { ethers, network } from "hardhat";
import CustomNetworkConfig from "../types/CustomNetworkConfig";
import { TransferUSDC } from "../typechain-types";

const CONTRACT_NAME = "TransferUSDC";

async function main() {
  const networkConfig = network.config as CustomNetworkConfig;

  console.log(`Allowing Ethereum Sepolia on ${networkConfig.url}`);

  const [signingWallet] = await ethers.getSigners();

  const ContractFactory = await ethers.getContractFactory(
    CONTRACT_NAME,
    signingWallet
  );

  const contractAddress = "0x0881F2eB42931C565c3dEf5c0b1DB302A2505E9d";
  const contract = ContractFactory.attach(contractAddress) as TransferUSDC;

  const ethereumSepolia = hre.config.networks
    .ethereumSepolia as CustomNetworkConfig;
  const destinationChainSelector = ethereumSepolia.chainSelector;

  const trx = await contract.allowlistDestinationChain(
    destinationChainSelector,
    true
  );

  const receipt = await trx.wait();

  console.debug("Receipt", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
