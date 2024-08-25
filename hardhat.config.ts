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
    version: "0.8.20",
    settings: {
      evmVersion: "paris",
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
      accounts: [WALLET_ACCOUNT_PRIVATE_KEY],
      ccipRouter: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
      chainSelector: "16015286601757825753",
      compoundUsdcToken: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      cometAddress: "0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e",
      fauceteer: "0x68793eA49297eB75DFB4610B68e076D2A5c7646C",
      linkToken: "",
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      usdcToken: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    } as CustomNetworkConfig,
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "UNSET",
      avalancheFuji: "avalancheFuji",
    },
    customChains: [
      {
        network: "avalancheFuji",
        chainId: 43113,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://testnet.snowtrace.io",
        },
      },
    ],
  },
};

export default config;
