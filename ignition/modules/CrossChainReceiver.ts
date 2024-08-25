import hre, { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CustomNetworkConfig from "../../types/CustomNetworkConfig";
import SwapTestnetUSDCModule from "./SwapTestnetUSDC";

const CrossChainReceiverModule = buildModule(
  "CrossChainReceiverModule",
  (module) => {
    const networkConfig = hre.network.config as CustomNetworkConfig;
    const { ccipRouter, cometAddress } = networkConfig;

    const { swapTestnetUSDC } = module.useModule(SwapTestnetUSDCModule);

    console.debug(
      "Deploying CrossChainReceiverModule, ccipRouter",
      ccipRouter,
      "cometAddress",
      cometAddress,
      "swapTestnetUsdcAddress",
      swapTestnetUSDC
    );

    const crossChainReceiver = module.contract("CrossChainReceiver", [
      ccipRouter,
      cometAddress,
      swapTestnetUSDC,
    ]);

    return { crossChainReceiver };
  }
);

export default CrossChainReceiverModule;
