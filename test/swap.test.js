const { ethers } = require("hardhat");

const WETH9 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe("SimpleSwap", function () {
  it("swapExactInputSingle", async function () {
    // loading acccounts to do transactions
    const accounts = await ethers.getSigners();

    // loading contracts
    const daiContract = await ethers.getContractAt("IERC20", DAI);
    const wethContract = await ethers.getContractAt("IWETH9", WETH9);

    // deploying swapper
    const Swap = await ethers.getContractFactory("SimpleSwap");
    const swapDeployed = await Swap.deploy();
    await swapDeployed.deployed();

    // depositing eth
    const amountIn = 5;

    await wethContract.connect(accounts[0]).deposit({ value: amountIn });

    // approving swapper to take and use our tokens
    await wethContract
      .connect(accounts[0])
      .approve(swapDeployed.address, amountIn);

    // swapping
    await swapDeployed.swapWETHForDAI(amountIn);

    // checking dai balance of account0 which had 0 initially before swap
    const daiBal = await daiContract.balanceOf(accounts[0].address);
    console.log("DAI balance: ", daiBal);
  });

  // it("swapExactInputMultihop", async function () {
  //   // loading acccounts to do transactions
  //   const accounts = await ethers.getSigners();

  //   // loading contracts
  //   const wethContract = await ethers.getContractAt("IWETH9", WETH9);
  //   const usdcContract = await ethers.getContractAt("IERC20", USDC);
  //   const daiContract = await ethers.getContractAt("IERC20", DAI);

  //   // deploying swapper
  //   const Swap = await ethers.getContractFactory("SimpleSwap");
  //   const swapDeployed = await Swap.deploy();
  //   await swapDeployed.deployed();

  //   // depositing eth
  //   const amountIn = 10n ** 18n;

  //   await wethContract.connect(accounts[0]).deposit({ value: amountIn });

  //   // approving swapper to take and use our tokens
  //   await wethContract
  //     .connect(accounts[0])
  //     .approve(swapDeployed.address, amountIn);

  //   // swapping
  //   await swapDeployed.swapExactInputMultihop(amountIn);

  //   // checking dai balance of account0 which had 0 initially before swap
  //   console.log(
  //     "DAI balance: ",
  //     await daiContract.balanceOf(accounts[0].address)
  //   );
  // });
});
