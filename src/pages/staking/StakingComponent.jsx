import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useStaking } from "../../hooks/useStaking"; // Ensure the correct path here
import tokenImage from "../../img/loader.png"; // Replace with your actual image path
import tokenImage2 from "../../img/tokenwhite.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits } from "viem"; // Make sure you have this import if needed

// Define motion variants outside the component
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StakingInfo = ({ totalTokenStaked, totalStakers }) => (
  <div className="flex items-center mb-4">
    <img src={tokenImage} alt="Token" className="w-[50%] rounded-full mr-4" />
    <div>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        TVL: {totalTokenStaked}
      </p>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        Total Stakers: {totalStakers}
      </p>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        Lock Period: <span className="text-white">30 Days</span>
      </p>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        APR: <span className="text-white">17%</span>
      </p>
    </div>
  </div>
);

const StakingInfo2 = ({ totalTokenStaked, totalStakers }) => (
  <div className="flex items-center mb-4">
    <img src={tokenImage2} alt="Token" className="w-[50%] rounded-full mr-4" />
    <div>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        TVL: {totalTokenStaked}
      </p>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        Total Stakers: {totalStakers}
      </p>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        Lock Period: <span className="text-white">160 Days</span>
      </p>
      <p className="bg-black p-2 rounded-lg w-full mt-1">
        APR: <span className="text-white">50%</span>
      </p>
    </div>
  </div>
);

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
    allowance,
    isApproved, // overall flag: true if allowance > 0
  } = useStaking();

  // Use overall approval flag from the hook.
  const hasApproval = isApproved;

  // For deposit, require a valid amount.
  const depositDisabled = isProcessing || (hasApproval && !amount);

  // The button text and action change based on approval.
  const buttonText = isProcessing
    ? "Processing..."
    : hasApproval
    ? "Deposit"
    : "Approve";
  const buttonAction = hasApproval ? stake : approve;

  // Memoize the info card (used when the wallet is not connected)
  const infoCard = useMemo(
    () => (
      <motion.div
        className="w-full lg:w-[500px] bg-gray-800 bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-teal-700 text-white"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold">SYN STAKING POOL</h2>
        <StakingInfo
          totalTokenStaked={totalTokenStaked}
          totalStakers={totalStakers}
        />
        <div className="flex justify-center items-center w-full">
          <ConnectButton label="Sign In" />
        </div>
      </motion.div>
    ),
    [totalTokenStaked, totalStakers]
  );

  return (
    <div className="flex justify-center flex-col lg:flex-row items-start min-h-70vh p-4 gap-2">
      {isConnected ? (
        <motion.div
          className="w-full lg:w-[500px] bg-black bg-opacity-50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-teal-700 text-white"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">SYN STAKING POOL</h2>
          <hr className="mb-2" />
          <StakingInfo
            totalTokenStaked={totalTokenStaked}
            totalStakers={totalStakers}
          />
          <hr className="mb-2" />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <div className="flex justify-center items-center space-x-4">
            <motion.button
              onClick={buttonAction}
              disabled={depositDisabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50 button"
            >
              {buttonText}
            </motion.button>

            <motion.button
              onClick={withdraw}
              disabled={isProcessing || !amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50 button"
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
            className="w-full bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50 button"
          >
            {isProcessing ? "Processing..." : "Claim"}
          </motion.button>
        </motion.div>
      ) : (
        infoCard
      )}
      {isConnected ? (
        <motion.div
          className="w-full lg:w-[500px] bg-black bg-opacity-50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-teal-700 text-white "
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">SYN STAKING POOL</h2>
          <hr className="mb-2" />
          <StakingInfo2
            totalTokenStaked={totalTokenStaked}
            totalStakers={totalStakers}
          />
          <hr className="mb-2" />

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <div className="flex justify-center items-center space-x-4">
            <motion.button
              onClick={buttonAction}
              disabled={depositDisabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50 button"
            >
              {buttonText}
            </motion.button>

            <motion.button
              onClick={withdraw}
              disabled={isProcessing || !amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50 button"
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
            className="w-full bg-black border border-teal-400 text-white py-2 rounded-lg transition-all disabled:opacity-50 button"
          >
            {isProcessing ? "Processing..." : "Claim"}
          </motion.button>
        </motion.div>
      ) : (
        infoCard
      )}
    </div>
  );
}

export default React.memo(StakingComponent);
