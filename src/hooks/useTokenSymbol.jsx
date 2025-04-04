import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { erc20Abi } from "viem";

const useTokenSymbol = (tokenAddress) => {
  const [symbol, setSymbol] = useState(null);
  const publicClient = usePublicClient(); // Get provider from Wagmi

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchSymbol = async () => {
      try {
        const tokenSymbol = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "symbol",
        });
        setSymbol(tokenSymbol);
      } catch (error) {
        console.error("Error fetching token symbol:", error);
      }
    };

    fetchSymbol();
  }, [tokenAddress]);

  return symbol;
};

export default useTokenSymbol;
