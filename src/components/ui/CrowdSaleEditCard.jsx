import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useCrowdsaleContract from "../../hooks/useCrowdSale"; // Comprehensive hook
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { useAccount } from "wagmi";
import polygon from "../../img/polygon.png";
import telegram from "../../img/telegram.png";
import discord from "../../img/dicord.png";
import twitter from "../../img/twitter.png";
import web from "../../img/web.png";

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

export default function CrowdsaleEditCard({ contractAddress }) {
  // Use our comprehensive hook for on-chain details and interactions.
  const {
    details,
    detailsLoading,
    detailsError,
    initialize,
    finalize,
    approve,
    init,
    loading,
  } = useCrowdsaleContract(contractAddress);

  // Firebase additional details state (banner image, title, description, links)
  const [firebaseDetails, setFirebaseDetails] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  // Get connected user address to check for creator
  const { address: connectedAddress } = useAccount();
  const isCreator =
    details &&
    connectedAddress &&
    details.creator.toLowerCase() === connectedAddress.toLowerCase();

  // Listen for off-chain metadata from Firestore (with caching)
  useEffect(() => {
    if (!contractAddress) return;

    console.log("Fetching Firestore data for contract:", contractAddress);

    const docRef = doc(db, "crowdsales", contractAddress);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log("Firestore data:", docSnapshot.data());
          setFirebaseDetails(docSnapshot.data());
        } else {
          console.log("Document does not exist in Firestore");
        }
      },
      (err) => {
        console.error("Error fetching Firestore data:", err);
      }
    );
    return () => unsubscribe();
  }, [contractAddress]);

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

  const handleApprove = async () => {
    try {
      await approve();
      setIsApproved(true);
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleInitialize = async () => {
    if (!isApproved) return;
    try {
      await initialize();
      await updateDoc(doc(db, "crowdsales", contractAddress), {
        initialized: true,
      });
    } catch (error) {
      console.error("Initialization failed", error);
    }
  };

  // // **Hiding the card if status is Ongoing or Finished**
  // if (details && details.initialized && status && status !== "Ongoing") {
  //   return null;
  // }

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
          <div className="flex justify-between items-center mb-4">
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
        </div>
      )}

      {/* Only show Initialize/Finalize if applicable */}
      <div className="flex flex-wrap gap-4 w-full bg-black p-4 justify-between">
        {isCreator && details && !details.initialized && (
          <div className="flex flex-col gap-3">
            <p className="text-yellow-400 text-sm">
              Approve token before you initialize token.
            </p>
            <motion.button
              onClick={handleApprove}
              disabled={isApproved || loading}
              className={`py-2 px-4 rounded ${
                isApproved ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
              } text-white font-bold`}
            >
              {isApproved ? "Approved" : "Approve"}
            </motion.button>
            <motion.button
              onClick={handleInitialize}
              disabled={!isApproved || loading}
              className={`py-2 px-4 rounded ${
                !isApproved
                  ? "bg-gray-500"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white font-bold`}
            >
              Initialize
            </motion.button>
          </div>
        )}

        {isCreator && details && details.initialized && !details.finalized && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={finalize}
            className=" w-full text-white font-bold py-2 px-4 rounded button"
          >
            Finalize
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
