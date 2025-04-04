import React, { useState } from "react";
import image from "../img/user.png";

import { ConnectButton, WalletButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import Type from "./Type";
import FloatingImage from "../components/ui/Floatingimage";
import FloatingImage2 from "../components/ui/Floatingimage2";

function Register() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative p-5 background">
      <FloatingImage />
      <FloatingImage2 />
      <div className="w-full max-w-md p-6 bg-black bg-opacity-50 backdrop-blur-md border border-teal-400 rounded-2xl shadow-2xl relative z-10">
        <img className="block mx-auto" src={image} />
        <div className="text-center w-full">
          <Type />
        </div>
        <form className="flex flex-wrap items-center justify-center gap-4 z-50">
          {["metamask", "rainbow", "coinbase", "walletConnect"].map(
            (wallet, index) => (
              <motion.div
                key={wallet}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <WalletButton wallet={wallet} />
              </motion.div>
            )
          )}
        </form>
        <hr />
        or
        <br />
        <div className="w-full flex justify-center">
          <ConnectButton label="sign in with wallet" />
        </div>
      </div>
    </div>
  );
}

export default Register;
