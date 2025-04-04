import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import makeBlockie from "ethereum-blockies-base64";
import { formatUnits } from "viem";
import { FaVoteYea, FaImages, FaStar, FaConnectdevelop } from "react-icons/fa";
import syn from "../../img/tokenwhite.png";
import pol from "../../img/pologo.png";
import user from "../../img/user.png";
import { useContractData } from "../../utils/helpers";

const UserDetail = () => {
  const { address, isConnected } = useAccount();
  const { data: ethBalance, isLoading: isEthBalanceLoading } = useBalance({
    address,
  });
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    tokenBalance,
    proposalVotes,
    isLoading: isContractDataLoading,
  } = useContractData(address);

  useEffect(() => {
    if (address) {
      const fetchNFTs = async () => {
        try {
          const contractData = await useContractData(address);
          setNFTs(Array.isArray(contractData.nfts) ? contractData.nfts : []);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
          setNFTs([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNFTs();
    } else {
      setIsLoading(false);
    }
  }, [address]);

  const formatBalance = (balance) => {
    if (!balance) return "0.000";
    return Number(formatUnits(balance, 18)).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  };

  const formatVotes = (balance, decimals = 18) => {
    if (!balance) return "0";
    return parseFloat(formatUnits(balance.toString(), decimals)).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    );
  };

  const getUserStatus = (votes) => {
    if (votes < 10) return { status: "Newbie", stars: 1 };
    if (votes < 20) return { status: "Elite", stars: 2 };
    if (votes < 50) return { status: "Pro", stars: 3 };
    if (votes < 100) return { status: "Master", stars: 4 };
    return { status: "Legend", stars: 5 };
  };

  if (isLoading || isEthBalanceLoading || isContractDataLoading) {
    return (
      <div className="text-center text-white p-6">
        <p>Loading user details...</p>
      </div>
    );
  }

  const { status, stars } = getUserStatus(proposalVotes || 0);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-lg mx-auto text-white shadow-xl border border-white/20">
      <div className="flex justify-start mb-6 w-full border border-black rounded-full shadow-black shadow-2xl">
        {Array.isArray(nfts) && nfts.length > 0 ? (
          <div>
            <img
              src={nfts[0]?.image}
              alt="NFT Profile"
              className="w-24 h-24 rounded-full border-4 border-teal-500 shadow-lg"
            />
            <img src={user} className="w-24" />
          </div>
        ) : (
          <div className="flex justify-between">
            <img
              src={makeBlockie(address || "default")}
              alt="Blockie Profile"
              className="w-24 h-24 rounded-full border-4 border-teal-500 shadow-lg"
            />
            <img src={user} className="w-24" />
          </div>
        )}
      </div>
      <div className="mb-2 w-full">
        <ConnectButton chainStatus="icon" />
      </div>
      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="p-2 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex justify-between items-center">
          <img src={pol} className="w-10" />
          <p className="text-lg font-semibold text-black">
            {ethBalance ? formatBalance(ethBalance.value) : "0.000"} POL
          </p>
        </div>
        <div className="p-2 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex justify-between items-center">
          <img src={syn} className="w-10" />
          <p className="text-lg font-semibold text-black">
            {formatBalance(tokenBalance)} SYN
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="p-1 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex justify-around items-center">
            <FaVoteYea className="text-2xl text-purple-400 mb-2" />
            <p className="text-sm">VP</p>
            <p className="text-lg font-semibold">{formatVotes(tokenBalance)}</p>
          </div>
          <div className="p-1 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex flex-wrap justify-around items-center">
            <FaConnectdevelop className="text-2xl text-purple-400 mb-2" />
            <p className="text-sm">TVP</p>
            <p className="text-lg font-semibold">{proposalVotes || 0}</p>
          </div>
          <div className="p-1 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex flex-wrap justify-around items-center">
            <p className="text-sm">User Status</p>
            <p className="text-lg font-semibold">{status}</p>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`text-xl ${
                    index < stars ? "text-yellow-400" : "text-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="p-1 bg-white/20 backdrop-blur-lg rounded-lg shadow-md flex flex-col items-center">
            <FaImages className="text-2xl text-blue-400 mb-2" />
            <p className="text-sm">Alpha Owned</p>
            <p className="text-lg font-semibold">{nfts.length}</p>
          </div>
        </div>
      </div>
      {/* NFT Collection */}
      {nfts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-center text-lg mb-3">Alpha Own</h3>
          <div className="flex space-x-4 overflow-x-auto p-2">
            {nfts.map((nft, index) => (
              <div
                key={index}
                className="min-w-[100px] p-2 bg-white/20 backdrop-blur-lg rounded-lg shadow-md"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-20 h-20 rounded-md"
                />
                <p className="text-sm mt-1 text-center">{nft.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
