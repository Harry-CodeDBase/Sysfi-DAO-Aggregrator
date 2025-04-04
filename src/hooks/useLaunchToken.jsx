import { useState, useEffect } from "react";
import { 
  useContractWrite, 
  useReadContract, 
  useAccount, 
  usePublicClient 
} from "wagmi";
import { parseUnits } from "viem";
import { launchTokenConfig, erc20Abi, tokenContractConfig } from "./Contract"; // Import contract ABIs

export function useMemeTokenFactory() {
  const [tokens, setTokens] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount(); // Get connected user address
  const publicClient = usePublicClient();
  const { writeContractAsync } = useContractWrite();

  // Fetch tokens data from the factory contract
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
        setTokenCount(count);

        const fetchedTokens = [];

        for (let i = 0; i < Number(count); i++) {
          const memeArray = await publicClient.readContract({
            address: launchTokenConfig.address,
            abi: launchTokenConfig.abi,
            functionName: "memeTokens",
            args: [i],
          });

          // Log raw data for debugging.
          console.log(`Raw data for token ${i}:`, memeArray);

          // Extract values (assuming the order matches your struct)
          const tokenAddress = memeArray[0]; // Token contract address
          const owner = memeArray[1];        // Owner address
          const genre = Number(memeArray[2]);  // Genre (converted to Number)
          const launchTime = Number(memeArray[3]); // Timestamp (converted to Number)

          // Validate token address
          if (
            !tokenAddress ||
            tokenAddress === "0x0000000000000000000000000000000000000000"
          ) {
            console.warn(`Token ${i} has an invalid address:`, tokenAddress);
            continue;
          }

          // Fetch token details (e.g. name and totalSupply) from the ERC-20 contract.
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

  // Read fee token address from the factory contract
  const { data: feeTokenAddress } = useReadContract({
    address: launchTokenConfig.address,
    abi: launchTokenConfig.abi,
    functionName: "feeToken",
  });

  // Read fee amount from the factory contract
  const { data: tokenFee } = useReadContract({
    address: launchTokenConfig.address,
    abi: launchTokenConfig.abi,
    functionName: "feeAmount",
  });

  // Set up a write contract hook for approving the fee token.
  const {
    writeContractAsync: approveWrite,
    data: approveTxData,
    isLoading: approveIsLoading,
    isSuccess: approveIsSuccess,
    error: approveError,
  } = useContractWrite();

  /**
   * Approve the factory contract to spend a specified fee amount
   * on behalf of the user.
   *
   * @param {object} params - The parameters.
   * @param {string|number} params.amount - The fee amount (in smallest token units).
   * @returns {Promise} The transaction promise.
   */
  const approveFee = async ({ amount }) => {
    if (!feeTokenAddress) {
      throw new Error("Fee token address is not available.");
    }

    return await approveWrite({
      address: feeTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [launchTokenConfig.address, amount],
    });
  };

  /**
   * Launch a new meme token.
   *
   * @param {string} name - The name of the new token.
   * @param {string} symbol - The token symbol.
   * @param {number|string} supply - The initial supply.
   * @param {number} genre - The genre (0, 1, or 2).
   */
  const launchMemeToken = async (name, symbol, supply, genre) => {
    try {
      const parsedSupply = parseUnits(supply.toString(), 18); // Convert supply to smallest units

      await writeContractAsync({
        address: launchTokenConfig.address,
        abi: launchTokenConfig.abi,
        functionName: "launchToken",
        args: [name, symbol, parsedSupply, genre],
        account: address, // Execute from the user's wallet
      });

      console.log("Token launch transaction sent!");
    } catch (error) {
      console.error("Error launching token:", error);
    }
  };

  return {
    tokenCount,
    tokens,
    loading,
    launchMemeToken,
    approveFee,
    feeTokenAddress,
    tokenFee,
    approveTxData,
    approveIsLoading,
    approveIsSuccess,
    approveError,
  };
}
