import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import gifImage from "../img/preview.gif";

const nftCollectionAddress = "0xecc0e95d7953d5f6e53057c102f86ba8eb7597d8"; // Replace with your NFT collection contract address
const nftABI = [
  // Minimal ERC721 ABI including balance, token enumeration and metadata lookup
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

function NFTDisplay() {
  const { address, isConnected } = useAccount();
  const [nftImage, setNftImage] = useState(null);

  // Read the NFT balance for the connected user
  const { data: balance } = useContractRead({
    address: nftCollectionAddress,
    abi: nftABI,
    functionName: "balanceOf",
    args: [address],
    enabled: isConnected && Boolean(address),
  });

  // If balance > 0, get the first tokenId (using tokenOfOwnerByIndex)
  const { data: tokenId } = useContractRead({
    address: nftCollectionAddress,
    abi: nftABI,
    functionName: "tokenOfOwnerByIndex",
    args: [address, 0],
    enabled: isConnected && Boolean(address) && balance && balance > 0,
  });

  // Fetch the tokenURI for that tokenId
  const { data: tokenURI } = useContractRead({
    address: nftCollectionAddress,
    abi: nftABI,
    functionName: "tokenURI",
    args: [tokenId],
    enabled: isConnected && tokenId !== undefined,
  });

  // When tokenURI is available, fetch the metadata to extract the image URL
  useEffect(() => {
    async function fetchNftImage() {
      if (tokenURI) {
        try {
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          if (metadata.image) {
            setNftImage(metadata.image);
          }
        } catch (err) {
          console.error("Error fetching NFT metadata:", err);
        }
      }
    }
    fetchNftImage();
  }, [tokenURI]);

  // Fallback GIF if the user doesn't own any NFT
  const fallbackGif = gifImage; // Replace with your GIF URL

  // OpenSea collection URL (or a minting page)
  const openseaUrl = "https://opensea.io/collection/syn-wolves"; // Replace with your OpenSea URL

  return (
    <div className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer">
      {nftImage ? (
        <img
          src={nftImage}
          alt="Your NFT"
          className="object-cover w-full h-full"
        />
      ) : (
        <img
          src={fallbackGif}
          alt="No NFT"
          className="object-cover w-full h-full"
        />
      )}
      {/* If there's no NFT image, overlay a "Mint" prompt */}
    </div>
  );
}

export default NFTDisplay;
