import {
  useAccount,
  useContractRead,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { useState, useEffect } from "react";
import { wrappedContractConfig } from "./Contract";

export function useAirdrop() {
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);
  const { address: userAddress } = useAccount();

 

  // Fetch user's next mint time
  const { data: nextMintTime } = useContractRead({
    address: wrappedContractConfig.address,
    abi: wrappedContractConfig.abi,
    functionName: "getNextMintTime",
    args: [userAddress],
    enabled: !!userAddress, // Only fetch if userAddress exists
  });

  // Fetch user's next reward amount
  const { data: nextReward } = useContractRead({
    address: wrappedContractConfig.address,
    abi: wrappedContractConfig.abi,
    functionName: "getNextReward",
    args: [userAddress],
    enabled: !!userAddress,
  });

  // Fetch user's consecutive minting days
  const { data: consecutiveDays } = useContractRead({
    address: wrappedContractConfig.address,
    abi: wrappedContractConfig.abi,
    functionName: "getConsecutiveDays",
    args: [userAddress],
    enabled: !!userAddress,
  });

  const { writeContractAsync } = useWriteContract();

  // Function to mint airdrop
  const mintAirdrop = async () => {
    try {
      setMinting(true);
      setMintError(null);
      setSuccess(false);

      const tx = await writeContractAsync({
        address: wrappedContractConfig.address,
        abi: wrappedContractConfig.abi,
        functionName: "mintAirdrop",
        value: parseEther("0.2"), // Send 0.1 ETH for mint fee
      });

      setMintTxHash(tx.hash);
    } catch (error) {
      console.error("Mint failed:", error);
      setMintError(error.message);
      setMinting(false);
    }
  };

  // Handle transaction confirmation
  const { isLoading: waitingTx, isSuccess } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  useEffect(() => {
    if (isSuccess) {
      setMinting(false);
      setSuccess(true);
    }
  }, [isSuccess]);

  return {
    nextMintTime,
    nextReward,
    consecutiveDays,
    mintAirdrop,
    minting,
    mintError,
    success,
    waitingTx,
  };
}
