import { useAccount, useContractWrite } from "wagmi";
import { parseUnits, parseEther } from "viem";
import { CreateCrowdsaleConfig } from "./Contract";

export default function useCreateCrowdsale() {
  const { address } = useAccount();
  const { writeContractAsync, isLoading, error, data } = useContractWrite();

  /**
   * Creates a crowdsale by calling the createCrowdsale function on the contract.
   *
   * @param {Object} params
   * @param {string} params.token - The token address.
   * @param {number} params.startTime - The start time (in seconds).
   * @param {number} params.endTime - The end time (in seconds).
   * @param {string|number} params.tokensForSale - The number of tokens for sale.
   * @param {BigInt} params.rate - The rate (tokens per ETH) as a BigInt.
   * @param {BigInt} params.softCap - The soft cap (in wei) as a BigInt.
   * @param {BigInt} params.hardCap - The hard cap (in wei) as a BigInt.
   */
  const createCrowdsale = async ({
    token,
    startTime,
    endTime,
    tokensForSale,
    rate,
    softCap,
    hardCap,
  }) => {
    try {
      // Convert tokensForSale assuming the token uses 18 decimals.
      const parsedTokensForSale = parseUnits(tokensForSale.toString(), 18);

      // Make the contract call including the overrides to pass 10 ETH.
      const txResponse = await writeContractAsync({
        address: CreateCrowdsaleConfig.address,
        abi: CreateCrowdsaleConfig.abi,
        functionName: "createCrowdsale",
        args: [
          token,
          startTime,
          endTime,
          parsedTokensForSale,
          rate,
          softCap,
          hardCap,
        ],
        account: address,
        // This override sends 10 ETH along with the transaction.
        overrides: { value: parseEther("0.01") },
      });

      console.log("Token launch transaction sent!", txResponse);
    } catch (error) {
      console.error("Error launching token:", error);
    }
  };

  return { createCrowdsale, isLoading, error, data };
}
