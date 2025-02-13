import { useState, useEffect } from "react";
import { useContractWrite, useAccount, usePublicClient } from "wagmi";
import { parseUnits } from "viem";
import { launchTokenConfig, erc20Abi, tokenContractConfig } from "./Contract"; // Import contract ABIs

export function useMemeTokenFactory() {
  const [tokens, setTokens] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount(); // Get connected user address
  const publicClient = usePublicClient();
  const { writeContractAsync } = useContractWrite();

useEffect(() => {
  async function fetchTokens() {
    setLoading(true);
    try {
      const count = await publicClient.readContract({
        address: launchTokenConfig.address,
        abi: launchTokenConfig.abi,
        functionName: "getLaunchedTokensCount",
      });

      console.log("Total tokens count:", count);
      setTokenCount(count)

      const fetchedTokens = [];

      for (let i = 0; i < Number(count); i++) {
        const memeArray = await publicClient.readContract({
          address: launchTokenConfig.address,
          abi: launchTokenConfig.abi,
          functionName: "memeTokens",
          args: [i],
        });

        // Ensure `memeArray` has valid data
        console.log(`Raw data for token ${i}:`, memeArray);

        // Extract values correctly
        const tokenAddress = memeArray[0]; // Token contract address
        const owner = memeArray[1]; // Owner address
        const genre = Number(memeArray[2]); // Genre (converted from BigInt)
        const launchTime = Number(memeArray[3]); // Timestamp (converted from BigInt)

        // Validate token address before fetching ERC-20 details
        if (
          !tokenAddress ||
          tokenAddress === "0x0000000000000000000000000000000000000000"
        ) {
          console.warn(`Token ${i} has an invalid address:`, tokenAddress);
          continue;
        }

        // Fetch token details from ERC-20 contract
        const [name, totalSupply] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: tokenContractConfig.abi,
            functionName: "name",
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: tokenContractConfig.abi,
            functionName: "totalSupply",
          }),
        ]);

        console.log(`Fetched details for token ${i}:`, { name, totalSupply });

        fetchedTokens.push({
          tokenAddress,
          owner,
          genre,
          launchTime,
          name,
          totalSupply: totalSupply.toString(), // Convert BigInt to string for readability
        });
      }

      setTokens(fetchedTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchTokens();
}, [publicClient]);


  

  // Function to launch a new meme token
  const launchMemeToken = async (name, symbol, supply, genre) => {
    try {
      const parsedSupply = parseUnits(supply.toString(), 18); // Convert to BigInt

      await writeContractAsync({
        address: launchTokenConfig.address,
        abi: launchTokenConfig.abi,
        functionName: "launchToken",
        args: [name, symbol, parsedSupply, genre],
        account: address, // Ensure it's executed from the user's wallet
      });

      console.log("Token launch transaction sent!");
    } catch (error) {
      console.error("Error launching token:", error);
    }
  };

  return {
    tokenCount, // Now correctly defined
    tokens,
    loading,
    launchMemeToken,
  };
}
