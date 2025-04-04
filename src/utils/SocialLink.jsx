import React from "react";
import telegram from '../img/telegram.png'
import twitter from "../img/twitter.png";
import discord from "../img/dicord.png";

const SocialLinks = () => {
  return (
    <div className="flex flex-col justify-end"> 
      <p className="text-right px-8">Follow us</p>
      <div className="w-full flex flex-row justify-end ">
        {/* Telegram */}
        <a
          href="https://t.me/sysfiDAO"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={telegram} alt="Telegram" className="w-[50px]" />
        </a>

        {/* Twitter */}
        <a
          href="https://x.com/sysfiDAO"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={twitter} alt="Twitter" className="w-[50px]" />
        </a>

        {/* Discord */}
        <a
          href="https://discord.gg/AP24hbApgc"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={discord} alt="Discord" className="w-[50px]" />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
