import { useAccount, useWriteContract } from "wagmi";
import abi from "../abi/DAO.json";

export function useProposalForm(daoAddress) {
  const { address } = useAccount();
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
    // Convert proposalType (1 or 2) to a boolean (true/false)
    const isFunding = proposalType === 1; // 1 = true (funding), 2 = false (non-funding)

    console.log("createProposal called with:", {
      title,
      description,
      amount,
      recipient,
      isFunding,
    });

    try {
      console.log("Calling writeContract with args:", [
        title,
        description,
        BigInt(amount), // Ensure amount is correctly formatted
        recipient,
        isFunding, // Now using a boolean value
      ]);

      const tx = await writeContractAsync({
        address: daoAddress,
        abi: abi,
        functionName: "createProposal",
        args: [title, description, BigInt(amount), recipient, isFunding],
        account: address,
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
