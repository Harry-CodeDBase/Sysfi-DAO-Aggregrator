import React from "react";
import { motion } from "framer-motion";
import { useStaking } from "../../hooks/useStaking"; // Ensure the correct file name here
import tokenImage from "../../img/loader.png"; // Replace with your actual image path
import { ConnectButton } from "@rainbow-me/rainbowkit";


function StakingComponent() {
  const {
    isConnected,
    amount,
    setAmount,
    approve,
    stake,
    withdraw,
    claimDividends,
    totalTokenStaked,
    pendingDivs,
    stakedToken,
    totalStakers,
    processing: isProcessing,
    isApproved,
  } = useStaking();

  // A simple card to show staking info (works regardless of wallet connection)
  const infoCard = (
    <motion.div
      className="w-full lg:w-[500px] bg-gray-800 bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-teal-700 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold">SYN STAKING POOL</h2>
      <div className="flex items-center mb-4">
        <img
          src={tokenImage}
          alt="Token"
          className="w-[50%] rounded-full mr-4"
        />
        <div>
          <p className="bg-black p-2 rounded-lg w-full mt-1">
            TVL: {totalTokenStaked}
          </p>
          <p className="bg-black p-2 rounded-lg w-full mt-1">
            Total Stakers: {totalStakers}
          </p>
          <p className="bg-black p-2 rounded-lg w-full mt-1">
            Lock Period: <span className="text-white">45 Days</span>
          </p>
          <p className="bg-black p-2 rounded-lg w-full mt-1">
            APR: <span className="text-white">50%</span>
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <ConnectButton label="sign in" />
      </div>
    </motion.div>
  );

  return (
    <div className="flex justify-center items-center max-h-screen p-4 bg-gray-900">
      {isConnected ? (
        // Full interactive view when connected
        <motion.div
          className="w-full lg:w-[500px] bg-black bg-opacity-50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-teal-700 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">SYN STAKING POOL</h2>
          <hr className="mb-2" />
          <div className="flex items-center mb-4">
            <img
              src={tokenImage}
              alt="Token"
              className="w-[50%] rounded-full mr-4"
            />
            <div>
              <p className="bg-black p-2 rounded-lg w-full mt-1">
                TVL: {totalTokenStaked}
              </p>
              <p className="bg-black p-2 rounded-lg w-full mt-1">
                Total Stakers: {totalStakers}
              </p>
              <p className="bg-black p-2 rounded-lg w-full mt-1">
                Lock Period: <span className="text-white">45 Days</span>
              </p>
              <p className="bg-black p-2 rounded-lg w-full mt-1">
                APR: <span className="text-white">50%</span>
              </p>
            </div>
          </div>
          <hr className="mb-2" />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <div className="flex justify-center items-center space-x-4">
            {/* Combined Approve/Deposit Button */}
            <motion.button
              onClick={isApproved ? stake : approve}
              disabled={!amount || isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {isProcessing
                ? "Processing..."
                : isApproved
                ? "Deposit"
                : "Approve"}
            </motion.button>

            {/* Withdraw Button */}
            <motion.button
              onClick={withdraw}
              disabled={!amount || isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Withdraw"}
            </motion.button>
          </div>

          <div className="flex justify-around w-full text-wrap my-5">
            <p className="bg-gray-900 p-2 text-lg text-center font-bold text-teal-400">
              MY Staked <br /> {stakedToken}
            </p>
            <p className="bg-gray-900 p-2 text-lg text-center font-bold text-teal-400">
              Pending Rewards <br /> {pendingDivs} SYN
            </p>
          </div>

          <motion.button
            onClick={claimDividends}
            disabled={isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Claim"}
          </motion.button>
        </motion.div>
      ) : (
        // If not connected, show only the info card
        infoCard
      )}
    </div>
  );
}

export default StakingComponent;
