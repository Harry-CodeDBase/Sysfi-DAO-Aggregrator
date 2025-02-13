import React, { useState } from "react";
import { useMemeTokenFactory } from "../../hooks/useLaunchToken";
import Blockies from "react-blockies";

export default function MemeTokenDashboard() {
  const { tokenCount, tokens, launchMemeToken } = useMemeTokenFactory();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [genre, setGenre] = useState(0);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const truncateAddress = (address, length = 6) => {
    return address ? `${address.slice(0, length)}...` : "N/A";
  };

  const formatTotalSupply = (supply) => {
    const adjustedSupply = Number(supply) / 1e18; // Convert from 18 decimals
    if (adjustedSupply >= 1e15) return (adjustedSupply / 1e15).toFixed(2) + "Q";
    if (adjustedSupply >= 1e12) return (adjustedSupply / 1e12).toFixed(2) + "T";
    if (adjustedSupply >= 1e9) return (adjustedSupply / 1e9).toFixed(2) + "B";
    if (adjustedSupply >= 1e6) return (adjustedSupply / 1e6).toFixed(2) + "M";
    if (adjustedSupply >= 1e3) return (adjustedSupply / 1e3).toFixed(2) + "K";
    return adjustedSupply.toFixed(2); // Show 2 decimal places for smaller values
  };

  const handleLaunch = async () => {
    if (!name || !symbol || !supply) return alert("All fields are required!");
    try {
      await launchMemeToken(name, symbol, supply, genre);
      setMessage(`✅ Your ${name} memecoin has been launched! 🚀`);
      setTimeout(() => setMessage(""), 5000);
      setIsModalOpen(false);
      setName("");
      setSymbol("");
      setSupply("");
      setGenre(0);
    } catch (error) {
      setMessage("❌ Token launch failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 text-white relative">
      {message && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-center text-xl font-bold text-green-400 p-3 rounded-lg shadow-lg">
          {message}
        </div>
      )}

      <p className="mb-4">Total Launched memecoin: {tokenCount}</p>

      <div className="space-y-4">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            {/* Token Logo */}
            <div className="flex w-14 h-14 flex-shrink-0 items-center">
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.name}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Blockies
                  seed={token.tokenAddress}
                  size={8}
                  scale={5}
                  className="rounded-full"
                />
              )}
            </div>

            {/* Token Name */}
            <div className="ml-4 w-32 font-semibold text-lg">{token.name}</div>

            {/* Contract Address */}
            <div className="ml-6 w-32 text-blue-400">
              <a
                href={`https://polygonscan.com/address/${token.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {truncateAddress(token.tokenAddress)}
              </a>
              <div className="text-xs text-gray-400">Contract Address</div>
            </div>

            {/* Total Supply */}
            <div className="ml-6 w-40">
              {formatTotalSupply(token.totalSupply)}
              <div className="text-xs text-gray-400">Total Supply</div>
            </div>

            {/* Owner Address */}
            <div className="ml-auto w-20 text-gray-400 text-center">
              <a
                href={`https://polygonscan.com/address/${token.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {truncateAddress(token.owner, 3)}
              </a>
              <div className="text-xs text-gray-500">Owner</div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-[100px] right-5 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700"
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Launch New MemeCoin
            </h2>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
            />
            <input
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
            />
            <input
              placeholder="Initial Supply"
              value={supply}
              type="number"
              onChange={(e) => setSupply(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
            />
            <select
              value={genre}
              onChange={(e) => setGenre(Number(e.target.value))}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
            >
              <option value={0}>Community</option>
              <option value={1}>Fan</option>
              <option value={2}>NFT</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
              >
                Launch Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
