import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDAOInteraction } from "../../hooks/useDAOInteraction";
import makeBlockie from "ethereum-blockies-base64";
import { motion } from "framer-motion";
import { useAccount, usePublicClient } from "wagmi";
import erc20Abi from "../../abi/Wsyn.json";
import { PenTool } from "lucide-react";
import { CreateProposalForm } from "./ProposalForm";
import Loader from "../../utils/Loader";
import {
  Users,
  Landmark,
  Shield,
  Clock,
  PercentCircle,
  Vote,
} from "lucide-react";

import defi from "../../img/defi.jpg";
import nft from "../../img/nft.jpg";
import meme from "../../img/meme.jpg";
import degen from "../../img/degen.jpg";
import comm from "../../img/comm.jpg";
import ai from "../../img/ai.jpg";
import game from "../../img/game.jpg";
import unknown from "../../img/unknown.jpg";
import Proposals from "./Proposals";
import DAO from "./DAO";
import { FaClipboard, FaShareAlt } from "react-icons/fa";

const genreBanners = {
  NFT: nft,
  GAMING: game,
  COMMUNITY: comm,
  DEFI: defi,
  AI: ai,
  DEGEN: degen,
  MEMECOIN: meme,
};

const genreMap = [
  "NFT",
  "GAMING",
  "COMMUNITY",
  "DEFI",
  "AI",
  "DEGEN",
  "MEMECOIN",
];



const truncateAddress = (address) => {
  if (!address) return "";
  return address.length > 12
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
};

function DAODetails() {
  const { daoAddress } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const genre = queryParams.get("genre");
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [hasGovernanceToken, setHasGovernanceToken] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { daoDetails, loading } = useDAOInteraction(daoAddress);
  const [copied, setCopied] = useState(false);


  const shareableLink = `${
    window.location.origin
  }/dao/${daoAddress}?name=${encodeURIComponent(
    name
  )}&genre=${encodeURIComponent(genre)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(daoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    async function checkTokenBalance() {
      if (!daoDetails?.governanceToken || !address) return;
      try {
        const balance = await publicClient.readContract({
          address: daoDetails.governanceToken,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        });
        setHasGovernanceToken(balance > 0);
      } catch (error) {
        console.error("Error fetching governance token balance:", error);
      }
    }
    checkTokenBalance();
  }, [daoDetails?.governanceToken, address, publicClient]);

  if (loading) return <Loader />;
  if (!daoDetails)
    return <p className="text-red-500 text-center">DAO not found.</p>;

  const bannerImage = genreBanners[genreMap[genre]] || unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-start p-2 w-full"
    >
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-black ">
        <img
          src={bannerImage}
          alt={`${genreMap[genre]} Banner`}
          className="w-full h-[200px] lg:h-[300px] object-cover"
        />
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className=" bottom-0 backdrop-blur-md left-0  sm:transform sm:-translate-x-1/2 rounded-2xl shadow-2xl p-6 w-full max-w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-4"
          >
            <img
              src={makeBlockie(daoAddress)}
              alt="DAO Blockie"
              className="w-14 h-14 rounded-full border border-gray-400"
            />
            <h2 className="text-3xl font-bold text-white">
              {name || "Unknown DAO"}
            </h2>
            <div className="flex items-center  text-gray-300 text-sm relative">
              <div className="group relative">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Check this out!",
                          url: shareableLink,
                        })
                        .catch((error) =>
                          console.error("Sharing failed:", error)
                        );
                    } else {
                      navigator.clipboard.writeText(shareableLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <FaShareAlt className="w-5 h-5" />
                </button>

                {/* Tooltip on hover */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Share DAO
                </span>
              </div>

              {copied && (
                <span className="text-teal-400 text-xs absolute mt-8">
                  Copied!
                </span>
              )}
            </div>
          </motion.div>
          <br />
          <div className="flex flex-row flex-wrap  gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg shadow-teal-500/50 w-full mx-auto">
            {/* DAO Address */}
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Landmark className="text-teal-400 w-5 h-5" />
              <span className="font-semibold text-white">DAO Address:</span>
              <span className="text-gray-200">
                {truncateAddress(daoAddress)}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white transition"
            >
              <FaClipboard className="w-5 h-5" />
            </button>
            {copied && (
              <span className="text-teal-400 text-xs absolute mt-8">
                Copied!
              </span>
            )}

            {/* Genre */}
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Shield className="text-teal-400 w-5 h-5" />
              <span className="font-semibold text-white">Genre:</span>
              <span className="ml-1 px-2 py-1 bg-gray-800 text-gray-200 rounded-md text-xs">
                {genreMap[genre] || "Unknown"}
              </span>
            </div>

            {/* Governance Token */}
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Vote className="text-teal-400 w-5 h-5" />
              <span className="font-semibold text-white">
                Governance Token:
              </span>{" "}
              {daoDetails.governanceTokenSymbol}
            </div>

            {/* Active Members */}
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Users className="text-teal-400 w-5 h-5" />
              <span className="font-semibold text-white">
                Active Members:
              </span>{" "}
              {daoDetails.totalVoters || 0}
            </div>

            {/* Quorum */}
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <PercentCircle className="text-teal-400 w-5 h-5" />
              <span className="font-semibold text-white">Quorum:</span>{" "}
              {daoDetails.quorum}%
            </div>

            {/* Voting Period */}
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <Clock className="text-teal-400 w-5 h-5" />
              <span className="font-semibold text-white">
                Voting Period:
              </span>{" "}
              {(daoDetails.votingPeriodHours / 24).toFixed(0)} days
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full">
        <DAO daoAddress={daoAddress} daoDetails={daoDetails} />
      </div>

      {hasGovernanceToken && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-[70px] right-3 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none button"
        >
          <PenTool className="w-6 h-6" />
        </motion.button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-black rounded-lg p-6 shadow-lg w-96"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-10 text-2xl right-6 text-gray-100 hover:text-gray-900 button"
            >
              ✖
            </button>
            <CreateProposalForm daoAddress={daoAddress} />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default DAODetails;
