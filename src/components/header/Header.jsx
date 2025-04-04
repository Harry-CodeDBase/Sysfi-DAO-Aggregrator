import React, { useState } from "react";
import NetworkGraph from "../ui/NetworkGraph";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Balance from "../../hooks/ERC20Balance";
import logo from "../../img/logo.png";
import { db } from "../../utils/Firebase";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import NFTDisplay from "../../hooks/NFTDisplay";
import UserDetail from "./userDetails";

const Header = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkWalletExists = async (walletAddress) => {
    const userRef = doc(db, "users", walletAddress);
    const docSnap = await getDoc(userRef);
    return docSnap.exists();
  };

  const createWalletUser = async (walletAddress) => {
    const referralCode = uuidv4().substring(0, 8);
    const userRef = doc(db, "users", walletAddress);
    await setDoc(userRef, {
      referralCode,
      dateCreated: new Date().toISOString(),
      referralCount: 0,
    });
  };

  const handleWalletConnect = async () => {
    if (isConnected && address) {
      const exists = await checkWalletExists(address);
      if (!exists) {
        await createWalletUser(address);
        navigate("/airdrop");
      } else {
        navigate("/airdrop");
      }
    }
  };

  return (
    <div className="header relative w-full min-h-[180px] z-40 text-white p-4 flex flex-col items-start overflow-hidden">
      {/* Background Network Graph */}
      <div className="absolute top-0 left-0 w-full min-h-[180px] lg:min-h-full h-full z-0">
        <NetworkGraph />
      </div>

      {/* Logo Section */}
      <div className="relative z-10 bg-black/30 p-3 rounded-full border-2 border-green-400 shadow-lg">
        <img className="w-20" src={logo} alt="sysfi Logo" />
      </div>

      {/* Connect Button */}

      {/* Profile & Balance Section */}
      <div
        onClick={() => setIsMenuOpen(true)}
        className="absolute right-2 z-10 h-40 w-28 lg:w-36 cursor-pointer bg-black/30 border-2 border-green-400 flex flex-col items-center justify-between rounded-lg shadow-lg p-2"
      >
        {/* Profile Image (NFT Display) */}
        <div className="">
          <NFTDisplay />
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-green-400 my-2"></div>

        {/* Balance */}
        <p className="text-sm">
          <Balance />
        </p>
      </div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full bg-white/10 backdrop-blur-lg text-white z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } w-[100%] md:w-[40%] shadow-lg p-4 flex flex-col`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="self-end text-4xl text-green-400"
        >
          &times;
        </button>
        <UserDetail />
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Header;
