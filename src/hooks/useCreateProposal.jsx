// useCreateProposal.js
import { useContractWrite } from "wagmi";
import { synDAOConfig } from "./Contract";

// Log the contract configuration on import
console.log("synDAOConfig loaded:", synDAOConfig);

export function useCreateProposal() {
  const { writeContract, data, isLoading, isSuccess, error } = useContractWrite(
    {
      address: synDAOConfig.address,
      abi: synDAOConfig.abi,
      functionName: "createProposal",
    }
  );

  console.log("useContractWrite initialized with:", {
    address: synDAOConfig.address,
    abi: synDAOConfig.abi,
    functionName: "createProposal",
  });

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
      const tx = await writeContract({
        args: [title, description, amount, recipient, proposalType],
      });
      console.log("Transaction returned:", tx);
      return tx;
    } catch (err) {
      console.error("Error in createProposal:", err);
      throw err;
    }
  };

  // --- Temporary test function using hard-coded values ---
  const testCreateProposal = async () => {
    try {
      // Hard-coded test values:
      const testTitle = "Test Title";
      const testDescription = "Test Description";
      const testAmount = 100; // Ensure this is a valid number for your contract
      const testRecipient = "0x66d7953956267037409322c8Ee2E9f5122f4Dbbd";
      const testProposalType = 0; // 0 typically represents Funding in your case

      console.log("Calling testCreateProposal with hard-coded values...");
      const tx = await writeContract({
        args: [
          testTitle,
          testDescription,
          testAmount,
          testRecipient,
          testProposalType,
        ],
      });
      console.log("Test Transaction returned:", tx);
    } catch (err) {
      console.error("Error in testCreateProposal:", err);
    }
  };

  return {
    createProposal,
    testCreateProposal,
    data,
    isLoading,
    isSuccess,
    error,
  };
}
