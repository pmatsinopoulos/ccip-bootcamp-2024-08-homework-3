import hre, { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import CustomNetworkConfig from "../../types/CustomNetworkConfig";

const SwapTestnetUSDCModule = buildModule("SwapTestnetUSDCModule", (module) => {
  const networkConfig = hre.network.config as CustomNetworkConfig;
  const { usdcToken, compoundUsdcToken, fauceteer } = networkConfig;

  console.debug(
    "Deploying SwapTestnetUSDC, usdcToken",
    usdcToken,
    "compoundUsdcToken",
    compoundUsdcToken,
    "fauceteer",
    fauceteer
  );

  const swapTestnetUSDC = module.contract("SwapTestnetUSDC", [
    usdcToken,
    compoundUsdcToken,
    fauceteer,
  ]);

  return { swapTestnetUSDC };
});

export default SwapTestnetUSDCModule;
