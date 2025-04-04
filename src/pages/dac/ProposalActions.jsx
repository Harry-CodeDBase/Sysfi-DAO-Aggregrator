import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useVote } from "../../hooks/useVote";

function ProposalActions({ proposalId }) {
  const { upVote, downVote, isLoading, error } = useVote();
  console.log("Voting for proposal ID:", proposalId);

  // Validate proposalId before using it
  if (proposalId === undefined || proposalId === null) {
    console.error("ERROR: proposalId is undefined or null");
    return <p className="text-red-500">Error: Invalid proposal ID</p>;
  }

  return (
    <div className="flex flex-col mt-4">
      <div className="flex justify-between">
        <button
          onClick={() => upVote(proposalId)}
          disabled={isLoading}
          className="flex items-center text-teal-400 hover:text-teal-300 bg-black p-4 rounded-lg border border-teal-500"
        >
          <FaThumbsUp className="mr-1" /> For
        </button>
        <button
          onClick={() => downVote(proposalId)}
          disabled={isLoading}
          className="flex items-center text-teal-400 hover:text-teal-300 bg-black p-4 rounded-lg border border-teal-500"
        >
          <FaThumbsDown className="ml-1" /> Against
        </button>
      </div>
      {error && (
        <p className="text-red-500 mt-2">
          {error.message || "An error occurred."}
        </p>
      )}
    </div>
  );
}

export default ProposalActions;
