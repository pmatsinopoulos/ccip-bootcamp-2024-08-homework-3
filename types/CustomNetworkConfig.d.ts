import { NetworkUserConfig } from "hardhat/types";

type CustomNetworkConfig = NetworkUserConfig & {
  ccipRouter: string;
  chainSelector: string;
  cometAddress: string;
  compoundUsdcToken: string;
  fauceteer: string;
  linkToken: string;
  usdcToken: string;
};

export default CustomNetworkConfig;
