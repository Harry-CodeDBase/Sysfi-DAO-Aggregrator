// CreateProposalForm.js
import React from "react";
import { useCreateProposal } from "../../hooks/useCreateProposal";

export function CreateProposalForm() {
  const { testCreateProposal, data, isLoading, isSuccess, error } =
    useCreateProposal();

  const handleTestClick = async () => {
    try {
      await testCreateProposal();
    } catch (err) {
      console.error("Test call failed:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-teal-300">
        Create Proposal (Test)
      </h2>
      <button
        onClick={handleTestClick}
        disabled={isLoading}
        className="w-full bg-teal-300 hover:bg-teal-400 transition-colors text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? "Submitting..." : "Test Create Proposal"}
      </button>

      {error && (
        <p className="mt-4 text-red-500">
          Error: {error.message || "An error occurred"}
        </p>
      )}
      {isSuccess && (
        <p className="mt-4 text-teal-300">Proposal submitted successfully!</p>
      )}
    </div>
  );
}
