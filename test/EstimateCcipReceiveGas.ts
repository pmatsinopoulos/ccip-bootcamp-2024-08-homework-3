import * as envEnc from "@chainlink/env-enc";

envEnc.config();

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { Receiver } from "../typechain-types";
import usdcAbi from "../abis/usdcAbi.json";
import linkAbi from "../abis/linkAbi.json";
import fauceteerAbi from "../abis/fauceteerAbi.json";

const INFURA_API_KEY = process.env.HARDHAT_VAR_INFURA_API_KEY;
const AVALANCHE_JSON_RPC_URL = `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`;
const ETHEREUM_JSON_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.HARDHAT_VAR_WALLET_ACCOUNT_PRIVATE_KEY || "";

describe("Sender and Receiver", function () {
  // Define a chain selector for the test scenario
  const chainSelector = "16015286601757825753"; // Ethereum Sepolia

  // A fixture to deploy necessary contracts before each test.
  async function deployFixture() {
    // Get signers, with the first one typically being the deployer.
    const [owner] = await ethers.getSigners();

    const Router = await ethers.getContractFactory("MockCCIPRouter");
    const TransferUSDCFactory = await ethers.getContractFactory("TransferUSDC");
    const CrossChainReceiverFactory = await ethers.getContractFactory(
      "CrossChainReceiver"
    );

    const router = await Router.deploy();

    const usdcToken; // I need to find a way to deploy USDC token contract in my local environment

    const link; // I need to find a way to deploy LINK token contract in my local environment

    const fauceteerAddress; // I need to find a way to deploy FAUCETEER contract in my local environment

    const compoundUsdcToken = usdcToken;

    const SwapTestnetUSDCFactory = await ethers.getContractFactory(
      "SwapTestnetUSDC"
    );

    const swapTestnetUSDC = await SwapTestnetUSDCFactory.deploy(
      usdcToken,
      compoundUsdcToken,
      fauceteer
    );
    const swapTestnetUSDCaddress = await swapTestnetUSDC.getAddress();

    const transferUSDC = await TransferUSDCFactory.deploy(
      router,
      link,
      usdcToken
    );

    const cometAddress; // I need to find a way to deploy COMET contract to my local environment

    const crossChainReceiver = await CrossChainReceiverFactory.deploy(
      router,
      cometAddress,
      swapTestnetUSDCaddress
    );

    // // Setup allowlists for chains and sender addresses for the test scenario.
    await transferUSDC.allowlistDestinationChain(chainSelector, true);
    await crossChainReceiver.allowlistSourceChain(chainSelector, true);
    await crossChainReceiver.allowlistSender(transferUSDC, true);

    // // Return the deployed instances and the owner for use in tests.
    return { owner, transferUSDC, crossChainReceiver, router, link };
  }

  it("gas estimation", async function () {
    console.debug("Gas Estimation TEST");

    // // Deploy contracts and load their instances.
    const { transferUSDC, crossChainReceiver, router, link } =
      await loadFixture(deployFixture);

    // // Define parameters for the tests, including gas limit and iterations for messages.
    // const gasLimit = 20_000; // I have tuned this according to previous runs of the tests.
    // const testParams = [0, 50, 99]; // Different iteration values for testing.
    // const gasUsageReport = []; // To store reports of gas used for each test.

    // // Loop through each test parameter to send messages and record gas usage.
    // for (const iterations of testParams) {
    //   await sender.sendMessagePayLINK(
    //     chainSelector,
    //     receiver,
    //     iterations,
    //     gasLimit
    //   );

    //   // Retrieve gas used from the last message executed by querying the router's events.
    //   const mockRouterEvents = await router.queryFilter(
    //     router.filters.MsgExecuted
    //   );
    //   const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
    //   const gasUsed = mockRouterEvent.args.gasUsed;

    //   // Push the report of iterations and gas used to the array.
    //   gasUsageReport.push({
    //     iterations,
    //     gasUsed: gasUsed.toString(),
    //   });
    // }

    // // Log the final report of gas usage for each iteration.
    // console.log("Final Gas Usage Report:");
    // gasUsageReport.forEach((report) => {
    //   console.log(
    //     "Number of iterations %d - Gas used: %d",
    //     report.iterations,
    //     report.gasUsed
    //   );
    // });
  });
});
