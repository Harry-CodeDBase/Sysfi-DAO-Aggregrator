import React from "react";
import NetworkGraph from "../ui/NetworkGraph";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Balance from "../../hooks/ERC20Balance";
import logo from "../../img/logo.png";


const Header = () => {
  return (
    <div className="header relative w-full min-h-[200px] z-40 text-white p-4 flex flex-col items-start overflow-hidden">
      {/* Background Network Graph */}
      <div className="absolute top-0 left-0 w-full min-h-[200px] lg:min-h-full h-full z-0">
        <NetworkGraph />
      </div>

      {/* Logo Section */}
      <div className="relative z-10 bg-black/30 p-3 rounded-full border-2 border-green-400 shadow-lg">
        <img
          className="w-20"
          src={logo}
          alt="sysfi Logo"
        />
      </div>

      {/* Connect Button */}
      <div className="relative z-10 mt-4">
        <ConnectButton chainStatus="icon" label="Sign in" />
      </div>

      {/* Profile & Balance Section */}
      <div className="absolute right-2 z-10 h-40 w-28 lg:w-36 bg-black/30 border-2 border-green-400 flex flex-col items-center justify-between rounded-lg shadow-lg p-2">
        {/* Profile Image */}
        <div className="w-20 h-20 bg-gray-700 flex items-center justify-center text-base font-bold rounded-md">
          Your NFT
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-green-400 my-2"></div>

        {/* Balance */}
        <p className="text-sm">
          <Balance />{" "}
        </p>
      </div>
    </div>
  );
};

export default Header;
