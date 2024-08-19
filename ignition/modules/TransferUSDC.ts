import hre, { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CustomNetworkConfig from "../../types/CustomNetworkConfig";

const TransferUSDCModule = buildModule("TransferUSDCModule", (module) => {
  const networkConfig = hre.network.config as CustomNetworkConfig;
  const { ccipRouter, linkToken, usdcToken } = networkConfig;

  console.debug(
    "Deploying TransferUSDC, ccipRouter",
    ccipRouter,
    "linkToken",
    linkToken,
    "usdcToken",
    usdcToken
  );

  const transferUSDC = module.contract("TransferUSDC", [
    ccipRouter,
    linkToken,
    usdcToken,
  ]);

  return { transferUSDC };
});

export default TransferUSDCModule;
