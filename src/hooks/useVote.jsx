import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi"; // Using viem
import { parseEther } from "viem";
import DAO_ABI from "../abi/SYNDAO.json"; // Ensure this path is correct

const DAO_CONTRACT_ADDRESS = "0x3d5fEF5ba907f8F4734F2e54f877A783933021A4";

export function useVote() {
  const { address } = useAccount(); // Get user wallet address
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const { writeContractAsync } = useWriteContract();

  const upVote = async (proposalId) => {
    try {
      setIsLoading(true);
   

      const result = await writeContractAsync({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: "upVote",
        args: [BigInt(proposalId)], // Convert to BigInt for viem
        account: address,
      });


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
  

      const result = await writeContractAsync({
        address: DAO_CONTRACT_ADDRESS,
        abi: DAO_ABI,
        functionName: "downVote",
        args: [BigInt(proposalId)], // Convert to BigInt for viem
        account: address,
      });

     
    } catch (err) {
      console.error("Downvote error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { upVote, downVote, isLoading, error };
}
