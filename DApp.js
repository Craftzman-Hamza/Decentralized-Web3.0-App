import React, { useEffect, useState } from "react";
import { Contract } from "ethers";
import "./App.css";
import contractABI from "./contractABI.json";

const contractAddress =
  "0x3873e32fa2d5a2d6e7e46304906bdf3ebd3278e06635f70329982e9f2fd296ae";

const ethers = require("ethers");

function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    async function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    if (account) {
      initNFTContract();
    }
  }, [account]);

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      setError("Something went wrong: " + error.message);
    }
  }

  const data = [
    {
      url: "./images/Ape-1.png",
      tokenURI:
        "https://sapphire-latin-spider-265.mypinata.cloud/ipfs/QmdcrFNGKi6Qyuvx3q6Rirbx2HvLdGgzBXR53FrJ2cdYLU/Ape-1.json",
    },
    {
      url: "./images/Ape-2.png",
      tokenURI:
        "https://sapphire-latin-spider-265.mypinata.cloud/ipfs/QmdcrFNGKi6Qyuvx3q6Rirbx2HvLdGgzBXR53FrJ2cdYLU/Ape-2.json",
    },
    {
      url: "./images/Ape-3.png",
      tokenURI:
        "https://sapphire-latin-spider-265.mypinata.cloud/ipfs/QmdcrFNGKi6Qyuvx3q6Rirbx2HvLdGgzBXR53FrJ2cdYLU/Ape-3.json",
    },
  ];

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.0001") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Minted successfully: ", response);
    } catch (err) {
      setError("Minting failed: " + err.message);
    } finally {
      setIsMinting(false);
    }
  }

  async function withDrawMoney() {
    try {
      const response = await NFTContract.withDrawMoney();
      console.log("Withdrawn successfully: ", response);
    } catch (err) {
      setError("Withdrawal failed: " + err.message);
    }
  }

  if (account == null) {
    return (
      <>
        <div className="container contentDiv">
          <br />
          <br />
          <h1>NFT Minting Application</h1>
          <p>Mint NFT of your choice from the Marketplace to your Account</p>
          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install MetaMask Wallet</p>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </>
    );
  }

  return (
    <div className="container contentDiv">
      <h1>NFT Minting Application</h1>
      <p>Mint NFT of your choice from Marketplace to your Account</p>
      <h4>Connected as: {account}</h4>
      {account === "0xDdb01F17e15e90a831cE2CB6731a1E7f9839e808" && (
        <button onClick={withDrawMoney}>Withdraw Money from Contract</button>
      )}

      <div className="card">
        {data.map((item, index) => (
          <div className="imageDiv" key={index}>
            <img src={item.url} alt="NFT" height={250} width={250} />
            <p>0.0001 ETH</p>
            <button
              disabled={isMinting}
              onClick={() => handleMint(item.tokenURI)}
            >
              {isMinting ? "Minting..." : "Mint to your Account"}
            </button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
