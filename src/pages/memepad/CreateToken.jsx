import React, { useState } from "react";
import { useMemeTokenFactory } from "../../hooks/useLaunchToken";
import Blockies from "react-blockies";
import Loader from "../../utils/Loader";
import Rocket from "../../img/launch.png";

export default function MemeTokenDashboard() {
  const {
    tokenCount,
    tokens,
    launchMemeToken,
    approveFee,
    tokenFee,
    approveTxData,
    approveIsLoading,
    approveIsSuccess,
    approveError,
    loading,
  } = useMemeTokenFactory();

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
    return adjustedSupply.toFixed(2);
  };

  const handleLaunch = async () => {
    if (!name || !symbol || !supply) {
      return alert("All fields are required!");
    }
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
    <div className="container bg-transparent mx-auto text-white relative p-2">
      {message && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-center text-xl font-bold text-green-400 p-3 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      <div className=" w-full p-4 bg-black">
        <p className="mb-4 ">Total Launched memecoin {tokenCount}</p>
      </div>
      <div className="space-y-4">
        {loading ? (
          <Loader />
        ) : (
          tokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-800/40 p-4 rounded-lg shadow-lg"
            >
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
              <div className="ml-4 w-32 font-semibold text-lg">
                {token.name}
              </div>
              <div className="ml-6 w-32 text-blue-400">
                <a
                  href={`https://amoy.polygonscan.com/address/${token.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {truncateAddress(token.tokenAddress)}
                </a>
                <div className="text-xs text-gray-400">Contract Address</div>
              </div>
              <div className="ml-6 w-40">
                {formatTotalSupply(token.totalSupply)}
                <div className="text-xs text-gray-400">Total Supply</div>
              </div>
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
          ))
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-[100px] right-5 bg-black text-teal-500 p-4 rounded-full shadow-lg hover:bg-teal-700 button"
      >
        +
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-black/70 border border-teal-500 p-6 rounded-lg shadow-xl w-96">
            <img src={Rocket} className="block m-auto w-[150px]" alt="" />
            <h2 className="text-xl font-semibold mb-4 text-white">
              Launch New MemeCoin
            </h2>

            <div className=" w-full flex justify-between gap-2">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 mb-2"
              />
              <input
                placeholder="Symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 mb-2"
              />
            </div>
            <input
              placeholder="Initial Supply"
              value={supply}
              type="number"
              onChange={(e) => setSupply(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 mb-2"
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
            <div>
              <br />
              <p>
                <i>Requires a fee of 10 wSYN to create memecoin </i>
              </p>
              <button
                type="button"
                disabled={approveIsLoading || approveIsSuccess}
                onClick={() => approveFee({ amount: tokenFee })}
                className="w-full py-2 mt-2 bg-blue-500 border border-white text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {approveIsLoading
                  ? "Approving..."
                  : approveIsSuccess
                  ? "Fee Approved"
                  : "Approve Fee"}
              </button>
              {approveError && (
                <p className="text-red-500 text-sm mt-1">
                  Error: {approveError.message}
                </p>
              )}
            </div>
            <br />
            <hr />
            <br />

            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-black hover:bg-teal-600 text-white px-4 py-2 w-[45%] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className="bg-teal-600 w-[45%] hover:bg-teal-700 text-white px-4 py-2 rounded"
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
