import { useContractRead } from "wagmi";
import { readContract } from "@wagmi/core";
import { Alphas, synDAOConfig, tokenContractConfig } from "../hooks/Contract";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const CUSTOM_TOKEN_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const NFT_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

const GOVERNANCE_ABI = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "proposalsVotedCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const useContractData = () => {
  const { address, isConnected } = useAccount();
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wait for user connection before fetching data
  useEffect(() => {
    if (!isConnected || !address) return;
    setLoading(true);
    getNFTs().finally(() => setLoading(false));
  }, [address, isConnected]);

  // Contract reads with async dependencies
  const { data: tokenBalance } = useContractRead({
    address: tokenContractConfig.address,
    abi: CUSTOM_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const { data: nftBalance } = useContractRead({
    address: Alphas.address,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const { data: proposalVotes } = useContractRead({
    address: synDAOConfig.address,
    abi: GOVERNANCE_ABI,
    functionName: "proposalsVotedCount",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const getNFTs = async () => {
    if (!nftBalance || !address) return [];
    try {
      const nftCount = parseInt(nftBalance.toString());
      if (nftCount === 0) return [];

      const tokenIds = await Promise.all(
        Array.from({ length: nftCount }).map((_, i) =>
          readContract({
            address: Alphas.address,
            abi: NFT_ABI,
            functionName: "tokenOfOwnerByIndex",
            args: [address, i],
          })
        )
      );

      const uris = await Promise.all(
        tokenIds.map((tokenId) =>
          readContract({
            address: Alphas.address,
            abi: NFT_ABI,
            functionName: "tokenURI",
            args: [tokenId],
          })
        )
      );

      const nftData = uris.map((uri, index) => ({
        tokenId: tokenIds[index].toString(),
        image: uri,
      }));

      setNFTs(nftData);
      return nftData;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  };

  return {
    isLoading: loading,
    tokenBalance,
    nftBalance: nftBalance ? parseInt(nftBalance.toString()) : 0,
    proposalVotes: proposalVotes ? parseInt(proposalVotes.toString()) : 0,
    nfts,
  };
};
