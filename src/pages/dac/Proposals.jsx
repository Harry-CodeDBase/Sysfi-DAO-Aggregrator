import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaExternalLinkAlt } from "react-icons/fa";

import ProposalActions from "./ProposalActions";
import { formatUnits } from "viem";
import Progressbar from "./Progress";
import Loader from "../../utils/Loader";
import useDaoProposals from "../../hook/useDaoProposal";

function DacProposals({ daoAddress }) {
  console.log("🔍 Received DAO Address:", daoAddress);

  const { proposals, loading } = useDaoProposals(daoAddress);
  const [activeTab, setActiveTab] = useState("generic");

  useEffect(() => {
    console.log("📊 Proposals Fetched:", proposals);
  }, [proposals]);

  if (loading) return <Loader />;

  // Filter proposals for Active & by Funding Type
  // Corrected Filtering Logic
  const filteredProposals = proposals.filter((proposal) => {
    const isActive = Number(proposal.status) === 0;

    if (activeTab === "funding") {
      return isActive && proposal.isFunding === true; // Ensure it's a boolean
    } else if (activeTab === "generic") {
      return isActive && proposal.isFunding === false; // Ensure it's a boolean
    }

    return isActive;
  });

  console.log("✅ Filtered Proposals:", filteredProposals);

  return (
    <div className="min-h-[30vh] w-full">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-teal-400 mb-4">
          Active Proposals
        </h2>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("funding")}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === "funding"
                ? "bg-teal-400 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Funding
          </button>
          <button
            onClick={() => setActiveTab("generic")}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === "generic"
                ? "bg-teal-400 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Generic
          </button>
        </div>

        {/* Proposals Container */}
        <div className="rounded-b-lg">
          {filteredProposals.length === 0 ? (
            <p className="text-white">No proposals found.</p>
          ) : (
            <AnimatePresence>
              {filteredProposals.map((proposal) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 border border-teal-400 rounded-lg p-4 bg-black bg-opacity-90 text-white shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Proposal {proposal.id}: {proposal.title}
                  </h3>
                  <p className="mb-2">
                    <strong>Description:</strong> {proposal.description}
                  </p>

                  {/* Funding proposals: show Amount and Recipient */}
                  {proposal.isFunding && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                      <div className="flex items-center">
                        <strong className="mr-1">Amount:</strong>{" "}
                        {formatUnits(proposal.amount, 18)}
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <strong className="mr-1">Recipient:</strong>
                        <span>{proposal.recipient}</span>
                        <a
                          href={`https://polygonscan.com/address/${proposal.recipient}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-teal-400 hover:text-teal-300"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                    <div className="mb-2">
                      <strong>Status:</strong> {proposal.status}
                    </div>
                    <p className="mb-2">
                      <strong>Timestamp:</strong>{" "}
                      {new Date(
                        Number(proposal.timestamp) * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                  <Progressbar proposal={proposal} />

                  {/* Upvote/Downvote Buttons */}
                  <div className="flex justify-between mt-4">
                    <button className="flex items-center text-teal-400 hover:text-teal-300">
                      <FaThumbsUp className="mr-1" /> {proposal.upVotes}
                    </button>
                    <button className="flex items-center text-teal-400 hover:text-teal-300">
                      <FaThumbsDown className="ml-1" /> {proposal.downVotes}
                    </button>
                  </div>
                  <ProposalActions proposalId={proposal.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default DacProposals;
