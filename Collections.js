const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("NFT Minting Contract", function () {
  let owner, ad1, ad2, ad3;
  let Collection;
  let price, limit, max_supply;

  // Deploy contract before each test
  this.beforeEach(async function () {
    [owner, ad1, ad2, ad3, ...address] = await ethers.getSigners();

    // Set test parameters
    price = ethers.utils.parseEther("0.0001");
    limit = 3;
    max_supply = 1000;

    // Deploy Collection contract
    Collection = await ethers.getContractFactory("Collection");
    Collection = await Collection.deploy(); // Deploy contract
  });

  it("It - Deploy Contract", async function () {
    // Verify the contract address is deployed
    assert.ok(Collection.address);
  });

  describe("Describe - Collection Contract Set Parameters", function () {
    it("Should set NFT Price", async function () {
      await Collection.setPrice(price); // Set the price
      expect(await Collection.PRICE_PER_TOKEN()).to.equal(price); // Check if the price is set correctly
    });

    it("It - Should set Minting Limit per Address", async function () {
      await Collection.setLimit(limit); // Set minting limit
      expect(await Collection.LIMIT_PER_ADDRESS()).to.equal(limit); // Verify the limit is set
    });

    it("It - Should set Max NFT Supply", async function () {
      await Collection.setMaxSupply(max_supply); // Set max supply
      expect(await Collection.MAX_SUPPLY()).to.equal(max_supply); // Verify max supply
    });
  });

  describe("Describe - Collection Contract Mint NFT", function () {
    it("It - Should Mint NFT to User Account Address", async function () {
      let user = Collection.connect(ad1); // Connect ad1 as the user
      let priceInWei = ethers.utils.parseEther("0.0001"); // Mint price

      // Mint NFT for ad1 with the correct price
      await user.mintNFT("1", { value: priceInWei });

      // Verify the token ID after minting (should be 1)
      expect(await Collection._tokenIds()).to.equal(1);

      // Verify that total minting count is 1
      expect(await Collection._totalMinted()).to.equal(1);
    });
  });

  describe("Describe - Withdraw Money by Owner", function () {
    it("It - Should Withdraw Money to Owner Account Address", async function () {
      let ownerContract = Collection.connect(owner); // Connect as the owner
      await ownerContract.withDrawMoney(); // Withdraw funds to the owner
      const balance = await ethers.provider.getBalance(Collection.address); // Get contract balance
      expect(balance).to.equal(0); // Check that the contract balance is now 0
    });

    it("It - Should not Withdraw Money to Any other Account Address", async function () {
      let user = Collection.connect(ad1); // Connect as a non-owner user
      await expect(user.withDrawMoney()).to.be.revertedWith(
        // Try to withdraw
        "Ownable: Caller is not the owner" // Expect the error message
      );
    });
  });
});
