import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useCrowdsaleContract from "../../hooks/useCrowdSale"; // Comprehensive hook
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { useAccount, usePublicClient } from "wagmi";
import polygon from "../../img/polygon.png";
import { FaDonate } from "react-icons/fa";
import telegram from "../../img/telegram.png";
import discord from "../../img/dicord.png";
import twitter from "../../img/twitter.png";
import web from "../../img/web.png";
import { useParams } from "react-router-dom";
import erc20Abi from "../../abi/SysfiABI.json";
import useTokenSymbol from "../../hooks/useTokenSymbol";

// Helper function to format a duration (ms) as "Xd Xh Xm Xs"
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Helper function to format a cap value into "1,000.000" format.
const formatCap = (cap) => {
  if (!cap) return "";
  const num = parseFloat(cap);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

export default function CrowdsaleCard() {
  // Use our comprehensive hook for on-chain details and interactions.
  const { contractAddress } = useParams();

  const {
    details,
    detailsLoading,
    detailsError,
    initialize,
    contribute,
    finalize,
    claimTokens,
    claimRefund,
    sellStake,
    init,
    loading,
  } = useCrowdsaleContract(contractAddress);
  const tokenAddress = details?.token; // Ensure details exist
  const tokenSymbol = useTokenSymbol(tokenAddress);


  // Local state for contribution input
  const [contributionAmount, setContributionAmount] = useState("");

  // Firebase additional details state (banner image, title, description, links)
  const [firebaseDetails, setFirebaseDetails] = useState(null);
  const localStorageKey = `crowdsaleDetails-${contractAddress}`;

  // Get connected user address to check for creator
  const { address: connectedAddress } = useAccount();
  const isCreator =
    details &&
    connectedAddress &&
    details.creator.toLowerCase() === connectedAddress.toLowerCase();

  // Listen for off-chain metadata from Firestore (with caching)
  useEffect(() => {
    if (!contractAddress) return;
    const cached = localStorage.getItem(localStorageKey);
    if (cached) {
      try {
        setFirebaseDetails(JSON.parse(cached));
      } catch (err) {
        console.error("Error parsing cached details:", err);
      }
    }
    // Reference Firestore document by contractAddress as ID
    const docRef = doc(db, "crowdsales", contractAddress);

    // Real-time listener for Firestore updates
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setFirebaseDetails(docData);
          console.log(docData);
          localStorage.setItem(localStorageKey, JSON.stringify(docData));
        }
      },
      (err) => {
        console.error("Error listening to Firestore:", err);
      }
    );

    return () => unsubscribe();
  }, [contractAddress, localStorageKey]);

  const linkImages = {
    website: web,
    twitter: twitter,
    telegram: telegram,
    discord: discord,
  };

  // Compute status and countdown based on raw timestamps.
  const [status, setStatus] = useState("");
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!details || !details.startTime || !details.endTime) return;

    // Convert timestamps to seconds
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(details.rawStartTime);
    const endTime = Number(details.rawEndTime);

    let newStatus = "";
    let targetTime = null;

    if (now < startTime) {
      newStatus = "Upcoming";
      targetTime = startTime;
    } else if (now >= startTime && now < endTime) {
      newStatus = "Ongoing";
      targetTime = endTime;
    } else {
      newStatus = "Finished";
    }

    setStatus(newStatus);

    if (targetTime) {
      const interval = setInterval(() => {
        const diff = targetTime - Math.floor(Date.now() / 1000);
        if (diff <= 0) {
          setCountdown("0d 0h 0m 0s");
          clearInterval(interval);
        } else {
          setCountdown(formatDuration(diff * 1000)); // Convert seconds to ms for formatting
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown("");
    }
  }, [details]);

  // **Hiding the card if status is Ongoing or Finished**
  // if (details && details.initialized && status && status !== "Ongoing") {
  //   return null;
  // }



  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount < 0.05 || amount > 10) {
      alert("Please enter a valid amount between 0.05 and 10 ETH");
      return;
    }
    contribute(contributionAmount);
  };

  return (
    <motion.div
      className="bg-gray-900 bg-opacity-80 backdrop-blur-lg p-6 rounded-lg shadow-lg my-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header: Status Badge & Countdown */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold">{status}</span>
          <span
            className={`w-3 h-3 rounded-full ${
              status === "Upcoming"
                ? "bg-green-400 animate-ping"
                : status === "Ongoing"
                ? "bg-green-400"
                : "bg-purple-500 animate-pulse"
            }`}
          ></span>
        </div>
        {countdown && (
          <span className="text-teal-300">
            {status === "Upcoming"
              ? "Starts in: "
              : status === "Ongoing"
              ? "Ends in: "
              : ""}
            {countdown}
          </span>
        )}
      </div>

      {/* Banner Image from Firebase */}
      {firebaseDetails?.imageUrl && (
        <div className="mb-4">
          <img
            src={firebaseDetails.imageUrl}
            alt={firebaseDetails.title || "Crowdsale Banner"}
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-teal-500 font-bold text-xs text-center mb-2 p-5 bg-black/70 rounded-3xl">
        {firebaseDetails?.title
          ? firebaseDetails.title
          : `Crowdsale at ${contractAddress}`}
      </h3>

      {/* Description and Links */}
      {firebaseDetails && (
        <div className="mb-4">
          <p className="text-gray-300 p-2 bg-black border-l-2 border-teal-400">
            {firebaseDetails.description}
          </p>
          {firebaseDetails.links && firebaseDetails.links.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-3 justify-end">
              {firebaseDetails.links.map((link, idx) => {
                const imageSrc =
                  linkImages[link.type.toLowerCase()] ||
                  "/assets/default-icon.png";

                return (
                  <li key={idx} className="text-sm">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={imageSrc}
                        alt={link.type}
                        className="w-8 h-8 object-contain hover:opacity-80 transition-opacity"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* On-Chain Details */}
      {details && (
        <div className="mb-4 text-gray-400 text-sm">
          <div className="flex justify-between flex-col items-center mb-4">
            <p>
              <strong>Start:</strong> {details.startTime}
            </p>
            <p>
              <strong>End:</strong> {details.endTime}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col gap-2">
            {[
              { label: "Total Raised", value: details.totalETHRaised },
              { label: "Soft Cap", value: details.softCap },
              { label: "Hard Cap", value: details.hardCap },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="flex items-center gap-2">
                  <img src={polygon} alt="Polygon" className="w-5 h-5" />
                  <strong>{item.label} (POL)</strong>
                </p>
                <span>{formatCap(item.value)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mb-4 mt-4">
            <p>
              <strong>Claimable:</strong> {details.stake}{" "}
              {tokenSymbol ? `${tokenSymbol}` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Contribution Input */}
      {status === "Ongoing" && (
        <>
          <div className="mb-4">
            <input
              type="number"
              min="0.05"
              max="10"
              step="0.01"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="w-full p-2 bg-black/70 rounded-lg text-white border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter amount to buy (POL)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full mb-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContribute}
              className="flex justify-center p-3 bg-black items-center rounded-2xl shadow-2xl shadow-black hover:bg-teal-600 border-2 border-teal-400 w-full text-white text-center font-bold py-2 px-4"
            >
              <FaDonate />
              Buy
            </motion.button>
            <motion.button
              whileHover={{ scale: Number(details?.stake ?? 0) > 0 ? 1.05 : 1 }}
              whileTap={{ scale: Number(details?.stake ?? 0) > 0 ? 0.95 : 1 }}
              onClick={sellStake}
              disabled={Number(details?.stake ?? 0) === 0} // Ensure it's a number
              className={`flex justify-center p-3 items-center rounded-2xl shadow-2xl 
    shadow-black border-2 w-full text-center font-bold py-2 px-4 
    ${
      Number(details?.stake ?? 0) === 0
        ? "bg-gray-500 text-gray-300 border-gray-400 cursor-not-allowed"
        : "bg-black hover:bg-teal-600 border-teal-400 text-white"
    }`}
            >
              <FaDonate />
              Sell stake
            </motion.button>
          </div>
        </>
      )}

      {status === "Finished" && Number(details?.stake ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 w-full bg-black p-4 justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={claimTokens}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
          >
            Claim Tokens
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={claimRefund}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
          >
            Claim Refund
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
