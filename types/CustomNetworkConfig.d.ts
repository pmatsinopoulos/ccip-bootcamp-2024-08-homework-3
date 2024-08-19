import { NetworkUserConfig } from "hardhat/types";

type CustomNetworkConfig = NetworkUserConfig & {
  ccipRouter: string;
  linkToken: string;
  usdcToken: string;
  chainSelector: string;
};

export default CustomNetworkConfig;
