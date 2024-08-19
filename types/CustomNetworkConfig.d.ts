import { NetworkUserConfig } from "hardhat/types";

type CustomNetworkConfig = NetworkUserConfig & {
  ccipRouter: string;
  linkToken: string;
  usdcToken: string;
};

export default CustomNetworkConfig;
