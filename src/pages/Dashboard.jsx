import React from "react";
import { useAuth } from "../hooks/Context"; // Assuming AuthProvider is set up
import { motion } from "framer-motion";
import referralImage from "../img/token.png";
import rewardImage from "../img/ethnode.png";
import communityImage from "../img/ethnode.png";
import emailImage from "../img/nft.png";
import userImage from "../img/user.png";
import badgeImage from "../img/badge.png";
import communityLevelImage from "../img/ethnode.png";
import twitterImage from "../img/twitter.png";
import telegramImage from "../img/telegram.png";
import discordImage from "../img/dicord.png";
import NetworkGraph from "../components/ui/NetworkGraph";

function Dashboard() {
  const { currentUser, userDetails } = useAuth();
  const referralLink = `${window.location.origin}/register?ref=${
    userDetails?.invitePass || "invite-code"
  }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-teal-500 to-indigo-800 text-white p-6 md:p-10">
      <h2 className="text-xl md:text-3xl font-bold mb-6 text-center md:text-left">
        SYN AMBASSADOR PROGRAM
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {[
          {
            img: userImage,
            label: "Username",
            value: userDetails?.username || "N/A",
          },
          { img: emailImage, label: "Email", value: currentUser?.email },
          {
            img: badgeImage,
            label: "Badge",
            value: userDetails?.badge || "New",
          },
          {
            img: communityLevelImage,
            label: "Community Level",
            value: userDetails?.community || 0,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800/60 backdrop-blur-lg rounded-md shadow-md flex items-center"
          >
            <img
              src={item.img}
              alt={item.label}
              className="w-10 h-10 md:w-12 md:h-12 mr-3"
            />
            <p className="text-base md:text-lg font-semibold">
               {item.value}
            </p>
          </div>
        ))}
      </motion.div>
   

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          className="lg:col-span-2 p-6 md:p-8 bg-gray-800/60 backdrop-blur-lg rounded-md shadow-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-teal-400 mb-3 md:mb-4">
            Your Airdrop Statistics
          </h2>
          <p className="text-gray-300 mb-4 md:mb-6">
            Track your progress, referrals, and SYN tokens earned. Share your
            referral link to earn more rewards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                img: rewardImage,
                title: "Total Referrals",
                value: userDetails?.totalReferrals || 0,
                description: "Friends you've successfully referred.",
              },
              {
                img: referralImage,
                title: "Tokens Earned",
                value: `${userDetails?.tokensEarned || 0} SYN`,
                description: "Earned through referrals.",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900/40 rounded-md shadow-md flex flex-col items-center"
              >
                <img
                  src={stat.img}
                  alt={stat.title}
                  className="w-16 h-16 mb-3"
                />
                <h3 className="text-lg md:text-xl font-bold text-teal-300 mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl md:text-4xl font-bold text-teal-400">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm text-center">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="p-6 md:p-8 bg-gray-800/60 backdrop-blur-lg rounded-md shadow-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-teal-400 mb-3 md:mb-4">
            Share Your Referral Link
          </h2>
          <p className="text-gray-300 mb-4 md:mb-6">
            Invite friends and earn additional SYN tokens when they sign up
            using your invite pass.
          </p>

          <div className="p-3 bg-gray-900/40 rounded-md shadow-inner flex items-center justify-between">
            <p className="truncate text-sm">{referralLink}</p>
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="ml-2 md:ml-3 px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-sm"
            >
              Copy Link
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="flex justify-center md:justify-end mt-8 space-x-4 md:space-x-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {[twitterImage, telegramImage, discordImage].map((icon, index) => (
          <a
            key={index}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 md:p-3 bg-gray-800/70 rounded-lg backdrop-blur-md hover:scale-110 transition-transform shadow-md"
          >
            <img
              src={icon}
              alt={`Social ${index}`}
              className="w-10 h-10 md:w-16 md:h-16"
            />
          </a>
        ))}
      </motion.div>
    </div>
  );
}

export default Dashboard;
