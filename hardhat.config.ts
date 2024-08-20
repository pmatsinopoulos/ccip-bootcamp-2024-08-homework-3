import * as envEnc from "@chainlink/env-enc";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import CustomNetworkConfig from "./types/CustomNetworkConfig";

envEnc.config();

const INFURA_API_KEY = process.env.HARDHAT_VAR_INFURA_API_KEY || "";
const WALLET_ACCOUNT_PRIVATE_KEY =
  process.env.HARDHAT_VAR_WALLET_ACCOUNT_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      evmVersion: "shanghai",
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: "u",
          },
        },
      },
    },
  },
  networks: {
    avalancheFuji: {
      url: `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      ccipRouter: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
      linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
      usdcToken: "0x5425890298aed601595a70AB815c96711a31Bc65",
      chainSelector: "",
    } as CustomNetworkConfig,
    ethereumSepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      ccipRouter: "",
      linkToken: "",
      usdcToken: "",
      chainSelector: "16015286601757825753",
    } as CustomNetworkConfig,
  },
};

export default config;
