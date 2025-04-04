import {
  useAccount,
  useContractWrite,
  useEstimateMaxPriorityFeePerGas,
  useBlock,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, parseEther } from "viem";
import { CreateCrowdsaleConfig } from "./Contract";
import { useState, useEffect } from "react";

export default function useCreateCrowdsale() {
  const { address } = useAccount();
  const [crowdsaleAddress, setCrowdsaleAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null); // Track transaction hash
  const { writeContractAsync, error } = useContractWrite();
  const { data: priorityFee } = useEstimateMaxPriorityFeePerGas();
  const { data: block } = useBlock(); // Fetch the latest block

  // Fetch transaction receipt when txHash is available
  const { data: receipt, isLoading: receiptLoading } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Extract deployed crowdsale address from receipt
  useEffect(() => {
    if (receipt) {
      const newCrowdsaleAddress = receipt?.logs[0]?.address;
      if (newCrowdsaleAddress) {
        setCrowdsaleAddress(newCrowdsaleAddress);
        console.log(crowdsaleAddress);
      }
    }
  }, [receipt]);

  // Function to create crowdsale
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
      setLoading(true);

      const parsedTokensForSale = parseUnits(tokensForSale.toString(), 18);

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
        value: parseEther("1"),
      });

      console.log("Transaction sent!", txResponse);
      setTxHash(txResponse.hash); // Store the transaction hash
    } catch (error) {
      console.error("Error launching crowdsale:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCrowdsale,
    crowdsaleAddress,
    isLoading: loading || receiptLoading,
    error,
  };
}
