import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaExternalLinkAlt } from "react-icons/fa";
import useProposals from "../../hooks/useProposal";
import ProposalActions from "./ProposalActions";
import { formatUnits } from "viem";
import Progressbar from "./Progress";
import Loader from "../../utils/Loader";

// Format a raw token amount (18 decimals) to a human-readable string
function formatAmount(rawAmount) {
  const scaled = Number(rawAmount) / 1e18;
  if (scaled >= 10000) {
    if (scaled >= 1e6) {
      return (scaled / 1e6).toFixed(2) + "M";
    }
    return (scaled / 1e3).toFixed(2) + "k";
  }
  return scaled.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const formatVoteCount = (voteCount) => {
  const formatted = Number(formatUnits(voteCount, 18)); // Convert from 18 decimals
  if (formatted >= 1_000_000) return (formatted / 1_000_000).toFixed(3) + "M";
  if (formatted >= 1_000) return (formatted / 1_000).toFixed(3) + "K";
  return formatted.toFixed(3); // Default with 3 decimal places
};

// Shorten an Ethereum address to show first 4 and last 4 characters
function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 4) + "..." + address.slice(-4);
}

// Convert a Unix timestamp (in seconds) to a human-readable date string
function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp) * 1000);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  });

  return `${formattedDate} ${formattedTime}`;
}

// Render a status label with a colored background
function renderStatus(status) {
  const s = Number(status);
  let text = "";
  let bgColor = "";
  if (s === 0) {
    text = "Active";
    bgColor = "bg-green-500";
  } else if (s === 1) {
    text = "Passed";
    bgColor = "bg-blue-500";
  } else if (s === 2) {
    text = "Failed";
    bgColor = "bg-red-500";
  } else {
    text = "Unknown";
    bgColor = "bg-gray-500";
  }
  return (
    <span className={`px-2 py-1 rounded ${bgColor} text-white`}>{text}</span>
  );
}

function calculateRemainingTime(endTimestamp) {
  const now = new Date().getTime() / 1000;
  const timeLeft = endTimestamp - now;
  if (timeLeft <= 0) return "Ended";
  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function ProposalsList() {
  const { proposals, loading } = useProposals();
  const [activeTab, setActiveTab] = useState("generic");

  if (loading) return <Loader />;

  // Filter proposals so that only active proposals (status === 0)
  // are shown, and then by proposal type.
  const filteredProposals = proposals.filter((proposal) => {
    const isActive = Number(proposal.status) === 0;
    const matchesTab =
      activeTab === "funding"
        ? proposal.proposalType === "0"
        : activeTab === "generic"
        ? proposal.proposalType === "1"
        : false;
    return isActive && matchesTab;
  });

  return (
    <div className="min-h-[30vh] w-full">
      <div className=" mx-auto">
        <div className="flex justify-end mb-4"></div>
        <h2 className="text-3xl font-bold text-teal-400 mb-4">
          Active Proposals
        </h2>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4 ">
          <button
            onClick={() => setActiveTab("funding")}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === "funding"
                ? "button text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Funding
          </button>
          <button
            onClick={() => setActiveTab("generic")}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === "generic"
                ? "button text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            Generic
          </button>
        </div>

        {/* Proposals Container */}
        <div className=" rounded-b-lg  ">
          {filteredProposals.length === 0 ? (
            <p className="text-white">No proposals found.</p>
          ) : (
            <AnimatePresence>
              {filteredProposals.map((proposal) => {
                const votingStart = Number(proposal.timestamp) + 86400;
                const votingEnd = Number(proposal.timestamp) + 691200;

                const timeLeft = calculateRemainingTime(votingEnd);

                return (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 border border-teal-400 rounded-lg p-4  border-white/20 bg-gradient-to-br from-blue-500/30 via-indigo-500/30 to-green-500/30 backdrop-blur-lg bg-opacity-90 text-white shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      Proposal {proposal.id}: {proposal.title}
                    </h3>
                    <hr className="p-2" />
                    <p className="mb-4 mt-5 w-full border border-teal-300 p-4 rounded-lg bg-slate-950">
                      <strong>Description</strong> <br /> {proposal.description}
                    </p>
                    <hr className="p-2" />
                    {/* Funding proposals: show Amount and Recipient side by side */}
                    {activeTab === "funding" && (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                        {/* Amount Field */}
                        <div className="flex items-center">
                          <strong className="mr-1">Amount:</strong>{" "}
                          {formatAmount(proposal.amount)}
                        </div>

                        {/* Recipient Field */}
                        <div className="flex items-center mt-2 sm:mt-0">
                          <strong className="mr-1">Recipient:</strong>
                          <span>{shortenAddress(proposal.recipient)}</span>
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

                    {/* Status with colored background */}
                    <div className="mb-2">
                      <strong>Status:</strong> {renderStatus(proposal.status)}
                    </div>
                    {/* Human-readable timestamp */}
                    <div className="flex flex-col sm:flex-row flex-wrap sm:justify-between sm:items-center mb-2">
                      <p className="border border-teal-400 p-2 rounded-2xl">
                        <strong>Created at:</strong>{" "}
                        {formatTimestamp(proposal.timestamp)}
                      </p>
                      <p className="border border-teal-400 p-2 rounded-2xl">
                        <strong>Voting Starts:</strong>{" "}
                        {formatTimestamp(votingStart)}
                      </p>
                      <p className="border border-teal-400 p-2 rounded-2xl">
                        <strong>Voting Ends:</strong>{" "}
                        {formatTimestamp(votingEnd)}
                      </p>
                      <p className="border border-teal-400 p-2 rounded-2xl">
                        <strong>Time Left:</strong> {timeLeft}
                      </p>
                    </div>
                    <Progressbar proposal={proposal} />
                    {/* Upvote/Downvote Buttons */}
                    <div className="flex justify-between mt-4">
                      <button className="flex items-center text-teal-400 hover:text-teal-300">
                        <FaThumbsUp className="mr-1" />{" "}
                        {formatVoteCount(proposal.upVotes)}
                      </button>
                      <button className="flex items-center text-teal-400 hover:text-teal-300">
                        <FaThumbsDown className="ml-1" />{" "}
                        {formatVoteCount(proposal.downVotes)}
                      </button>
                    </div>
                    <ProposalActions proposalId={proposal.id} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProposalsList;
