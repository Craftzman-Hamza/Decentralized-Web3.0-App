// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    // Counter for keeping track of token IDs and total minted tokens
    Counters.Counter private _tokenIds;
    Counters.Counter private _totalMinted;

    // Public variables for price, limit per address, and max supply
    uint256 public PRICE_PER_TOKEN = 0.0001 ether;
    uint public LIMIT_PER_ADDRESS = 3;
    uint256 public MAX_SUPPLY = 1000;

    // Mappings to track the number of NFTs minted by an address and if the URI has been minted
    mapping(address => uint8) private mintedAddress;
    mapping(string => bool) private mintedURI;

    // Constructor that sets the ERC721 token name and symbol
    constructor() ERC721("NFT_DAPP", "NFT") {}

    // Function to set the price for minting
    function setPrice(uint256 price) external onlyOwner {
        PRICE_PER_TOKEN = price;
    }

    // Function to set the limit of NFTs that can be minted per address
    function setLimit(uint256 limit) external onlyOwner {
        LIMIT_PER_ADDRESS = limit;
    }

    // Function to set the maximum supply of NFTs
    function setMaxSupply(uint256 supply) external onlyOwner {
        MAX_SUPPLY = supply;
    }

    // Minting function that allows users to mint NFTs
    function mintNFT(
        string memory tokenURI
    ) external payable returns (uint256) {
        // Check if the user has sent enough ETH to cover the minting cost
        require(
            PRICE_PER_TOKEN <= msg.value,
            "Required amount for minting must be paid"
        );
        
        // Check if the user has exceeded the minting limit for their address
        require(
            mintedAddress[msg.sender] < LIMIT_PER_ADDRESS,
            "You have exceeded the minting limit for NFTs"
        );
        
        // Ensure that the total minted tokens do not exceed the max supply
        require(
            _totalMinted.current() + 1 <= MAX_SUPPLY,
            "You have exceeded the supply"
        );
        
        // Ensure the token URI is unique (not already minted)
        require(!mintedURI[tokenURI], "This NFT has already been minted");
        
        // Mark the token URI as minted
        mintedURI[tokenURI] = true;
        
        // Increment the minting count for the sender address
        mintedAddress[msg.sender] += 1;
        
        // Increment the global counters for token IDs and total minted
        _tokenIds.increment();
        _totalMinted.increment();

        // Generate the new token ID
        uint256 newItemId = _tokenIds.current();
        
        // Mint the new NFT and set its URI
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        // Return the newly minted token ID
        return newItemId;
    }

    // Function for the contract owner to withdraw the balance of the contract
    function withDrawMoney() external onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}
