import React, { useState } from "react";
import { useProposalForm } from "../../hooks/useDAOForm";

export function CreateProposalForm({ daoAddress }) {
  const { createProposal, isLoading, isSuccess, error } =
    useProposalForm(daoAddress);

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [proposalType, setProposalType] = useState("0"); // Default to Funding

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAmount = proposalType === "0" ? amount : "0";
    const finalRecipient =
      proposalType === "0"
        ? recipient
        : "0x0000000000000000000000000000000000000000";

    try {
      await createProposal(
        title,
        description,
        finalAmount,
        finalRecipient,
        proposalType
      );
    } catch (err) {
      console.error("Proposal creation failed:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-teal-300">Create Proposal</h2>

      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
          required
        />

        {/* Description Input */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
          required
        />

        {/* Proposal Type Dropdown */}
        <select
          value={proposalType}
          onChange={(e) => setProposalType(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        >
          <option value="0">Funding Proposal</option>
          <option value="1">General Proposal</option>
        </select>

        {/* Conditional Fields for Funding Proposal */}
        {proposalType === "0" && (
          <>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              required
            />
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              required
            />
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-300 hover:bg-teal-400 transition-colors text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="mt-4 text-red-500">
          Error: {error.message || "An error occurred"}
        </p>
      )}

      {/* Success Message */}
      {isSuccess && (
        <p className="mt-4 text-teal-300">Proposal submitted successfully!</p>
      )}
    </div>
  );
}
