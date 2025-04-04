import { useAccount, useWriteContract } from "wagmi";
import { synDAOConfig } from "./Contract";

export function useCreateProposal() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, data, isLoading, isSuccess, error } =
    useWriteContract();

  /**
   * Calls the createProposal function on the contract.
   */
  const createProposal = async (
    title,
    description,
    amount,
    recipient,
    proposalType
  ) => {
    console.log("createProposal called with:", {
      title,
      description,
      amount,
      recipient,
      proposalType,
    });

    try {
      console.log("Calling writeContract with args:", [
        title,
        description,
        amount,
        recipient,
        proposalType,
      ]);

      const tx = await writeContractAsync({
        address: synDAOConfig.address,
        abi: synDAOConfig.abi,
        functionName: "createProposal",
        args: [title, description, BigInt(amount), recipient, proposalType],
        account: address, // Correct key instead of `address`
      });

      console.log("Transaction returned:", tx);
      return tx;
    } catch (err) {
      console.error("Error in createProposal:", err);
      throw err;
    }
  };

  return {
    createProposal,
    data,
    isLoading,
    isSuccess,
    error,
  };
}
