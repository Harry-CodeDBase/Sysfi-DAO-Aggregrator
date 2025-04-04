import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi"; // Using viem
import { parseEther } from "viem";
import DAO_ABI from "../abi/DAO.json"; // Ensure this path is correct

const DAO_CONTRACT_ADDRESS = "0x3d5fEF5ba907f8F4734F2e54f877A783933021A4";

export function useVote(daoAddress) {
  const { address } = useAccount(); // Get user wallet address
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(daoAddress);

  console.log("useVote Hook Initialized");
  console.log("DAO Contract Address:", DAO_CONTRACT_ADDRESS);
  console.log("DAO ABI:", DAO_ABI);

  const { writeContractAsync } = useWriteContract();

  const upVote = async (proposalId) => {
    try {
      setIsLoading(true);
      console.log("Attempting to upvote proposal ID:", proposalId);

      const result = await writeContractAsync({
        address: daoAddress,
        abi: DAO_ABI,
        functionName: "upVote",
        args: [BigInt(proposalId)], // Convert to BigInt for viem
        account: address,
      });

      console.log("Upvote transaction result:", result);
    } catch (err) {
      console.error("Upvote error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downVote = async (proposalId) => {
    try {
      setIsLoading(true);
      console.log("Attempting to downvote proposal ID:", proposalId);

      const result = await writeContractAsync({
        address: daoAddress,
        abi: DAO_ABI,
        functionName: "downVote",
        args: [BigInt(proposalId)], // Convert to BigInt for viem
        account: address,
      });

      console.log("Downvote transaction result:", result);
    } catch (err) {
      console.error("Downvote error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { upVote, downVote, isLoading, error };
}
