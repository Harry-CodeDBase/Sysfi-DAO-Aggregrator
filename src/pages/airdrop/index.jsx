import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAirdrop } from "../../hooks/useAirdrop";
import { formatUnits } from "viem";
import { motion } from "framer-motion";
import { FaGift, FaSyncAlt, FaLink, FaCopy } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/Firebase"; // Ensure Firebase is properly imported
import ReferralInputComponent from "./ReferalComponent";
import goodluck from '../../img/goodluck.png'
import SocialLinks from "../../utils/SocialLink";

function AirdropComponent() {
  const { address, isConnected } = useAccount();
  const {
    nextMintTime,
    nextReward,
    consecutiveDays,
    mintAirdrop,
    minting,
    success,
    waitingTx,
  } = useAirdrop();

  const [countdown, setCountdown] = useState("");
  const [canMint, setCanMint] = useState(false);
  const [referralData, setReferralData] = useState({
    referralCount: 0,
    referralCode: "",
  });

  // Countdown Timer Logic
useEffect(() => {
  if (!nextMintTime || Number(nextMintTime) <= 0) {
    setCountdown("Next claim time unavailable"); // Handle invalid timestamp
    setCanMint(false);
    return;
  }

  const nextTime = Number(nextMintTime) * 1000; // Convert BigInt to Number (Milliseconds)

  const updateCountdown = () => {
    const now = Date.now();
    const timeLeft = nextTime - now;

    if (timeLeft <= 0) {
      setCountdown("You can claim now!");
      setCanMint(true);
    } else {
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      setCanMint(false);
    }
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
  return () => clearInterval(interval);
}, [nextMintTime]);


  // Fetch referral data from Firestore
  useEffect(() => {
    if (address) {
      const userRef = doc(db, "users", address);

      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          setReferralData({
            totalReferrals: docSnap.data().referralCount || 0,
            referralCode: docSnap.data().referralCode || "N/A",
          });
        }
      });
    }
  }, [address]);

  const referralLink = `https://beta.sysfi.network?ref=${referralData.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join Systematic Finance!",
          text: "Join Systematic Finance and earn rewards for testing our ecosystem! Mint WSYN, stake, vote, and convert WSYN tokens.",
          url: referralLink,
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(
        "Sharing is not supported in your browser. Please copy the link instead."
      );
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/60 backdrop-blur-lg border border-teal-500/50 shadow-lg rounded-2xl p-6 md:p-10 w-full  text-white"
      >
        <SocialLinks />
        <h2 className="text-2xl font-bold text-teal-500 flex items-center gap-2">
          <FaGift /> Airdrop Minting
        </h2>

        {isConnected ? (
          <div>
            <div className="mt-4 space-y-4 mb-3">
              {/* <img
                className="float-right w-[56%] lg:w-[300px]"
                src={goodluck}
                alt=""
              /> */}
              <p className="text-gray-300 flex justify-between p-3 border-teal-400 border rounded-2xl bg-black ">
                <strong>Next Claim </strong>{" "}
                <span>{countdown || "Loading..."}</span>
              </p>
              <p className="text-gray-300  flex justify-between p-3 border-teal-400 border rounded-2xl bg-black">
                <strong>Next Reward</strong>{" "}
                <span>
                  {" "}
                  {nextReward
                    ? `${formatUnits(nextReward, 18)} wSYN`
                    : "Loading..."}
                </span>
              </p>
              <p className="text-gray-300  flex justify-between p-3 border-teal-400 border rounded-2xl bg-black">
                <strong>Streak</strong> <span>{consecutiveDays || 0} </span>
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center justify-center gap-2 bg-teal-500 text-black font-bold py-3 px-6 rounded-lg transition ${
                  !canMint || minting || waitingTx
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-teal-400"
                }`}
                onClick={mintAirdrop}
                disabled={!canMint || minting || waitingTx}
              >
                {minting ? (
                  <>
                    <FaSyncAlt className="animate-spin" /> Minting...
                  </>
                ) : (
                  <>
                    <FaGift /> Mint WSYN
                  </>
                )}
              </motion.button>

              {success && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-teal-400 font-semibold"
                >
                  WSYN Minted successfully!
                </motion.p>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-2 ">
              {/* Referral Section */}
              <div className="mt-6 p-4 border border-gray-950 rounded-lg bg-black">
                <h3 className="text-xl mb-5 font-bold text-center text-teal-400">
                  Referral Stats
                </h3>
                <div className="flex gap-2 justify-between">
                  <p className="text-gray-300 w-[45%] text-center p-2 border border-gray-400 shadow-2xl shadow-gray-600">
                    <strong>
                      Friends <br />
                    </strong>{" "}
                    {referralData.referralCount}
                  </p>
                  <p className="text-gray-300 w-[45%] text-center p-2 shadow-2xl shadow-gray-600 border border-gray-4">
                    <strong>RefCode</strong> <br /> {referralData.referralCode}
                  </p>
                </div>
                {referralData.referralCode && (
                  <div className="mt-4">
                    <p className="text-gray-300">
                      <strong>
                        Share your referral link <i>{referralLink}</i>
                      </strong>
                    </p>

                    <div className="flex items-center my-5 gap-4 mt-2 justify-between">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center gap-1 border rounded-full text-center p-2 w-[45%] border-teal-500 text-teal-400 hover:text-black hover:bg-teal-700"
                      >
                        <FaCopy /> Copy Link
                      </button>
                      <button
                        onClick={shareReferral}
                        className="flex items-center justify-center gap-1 border rounded-full  p-2 w-[45%] border-teal-500 text-teal-400 hover:text-black hover:bg-teal-700"
                      >
                        <FaLink /> Invite
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 border-gray-400 border p-2 ">
                      Join Systematic Finance and earn rewards for testing our
                      ecosystem! Mint WSYN, stake, vote, and convert WSYN
                      tokens.
                    </p>
                  </div>
                )}
              </div>
              <ReferralInputComponent />
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center mt-4">
            Please connect your wallet.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default AirdropComponent;
