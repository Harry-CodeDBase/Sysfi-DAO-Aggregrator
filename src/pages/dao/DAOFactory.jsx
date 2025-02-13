import React, { useState } from "react";
import { useDAOFactory } from "../../hooks/useDAOFactory";
import { formatUnits } from "viem"; // Ensure this is the correct function for your setup
import daoImage from "../../img/loader.png"; // Replace with your actual image path

function DAOFactoryComponent() {
  // Local form state.
  const [daoName, setDaoName] = useState("");
  const [quorum, setQuorum] = useState("");
  const [votingPeriodDays, setVotingPeriodDays] = useState(""); // User enters days
  // DAO type: "eth" for ETH DAO, "token" for token-based DAO.
  const [daoType, setDaoType] = useState("eth");
  const [tokenAddress, setTokenAddress] = useState("");
  // Genre stored as a string corresponding to the enum index.
  const [genre, setGenre] = useState("3"); // Default "DEFI" (index 3)

  const {
    isConnected,
    nativeFee,
    tokenFee,
    deployedDAOs,
    createDAO,
    creating,
    txData,
    error,
    isLoading,
    isSuccess,
    approveFee,
    approveTxData,
    approveError,
    approveIsLoading,
    approveIsSuccess,
    isDataReady,
  } = useDAOFactory();

  const handleCreateDAO = async (e) => {
    e.preventDefault();
    // Convert voting period from days to hours.
    const votingPeriodHours = Number(votingPeriodDays) * 24;
    // If ETH DAO is selected, use the zero address.
    const selectedTokenAddress =
      daoType === "eth"
        ? "0x0000000000000000000000000000000000000000"
        : tokenAddress;
    try {
      // Pass the DAO parameters as an object.
      await createDAO({
        quorum,
        votingPeriodHours,
        tokenAddress: selectedTokenAddress,
        genre: parseInt(genre),
        daoName,
      });
    } catch (err) {
      console.error("Error in handleCreateDAO:", err);
    }
  };

  if (!isDataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src={daoImage} alt="Loading..." className="w-20 h-20" />
        <p className="text-white ml-4">Initializing DAO Factory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left Column: Deployed DAOs List */}
        <div className="w-full md:w-1/2">
          <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              Deployed DAOs
            </h3>
            {deployedDAOs ? (
              deployedDAOs.map((dao, index) => (
                <div
                  key={index}
                  className="p-4 mb-4 bg-gray-800 bg-opacity-75 rounded-lg"
                >
                  <p className="text-white text-sm">
                    <span className="font-semibold">DAO Address:</span>{" "}
                    {dao.daoAddress}
                  </p>
                  <p className="text-white text-sm">
                    <span className="font-semibold">Genre:</span>{" "}
                    {(() => {
                      switch (dao.genre) {
                        case "0":
                        case 0:
                          return "NFT";
                        case "1":
                        case 1:
                          return "GAMING";
                        case "2":
                        case 2:
                          return "COMMUNITY";
                        case "3":
                        case 3:
                          return "DEFI";
                        case "4":
                        case 4:
                          return "AI";
                        case "5":
                        case 5:
                          return "DEGEN";
                        case "6":
                        case 6:
                          return "MEMECOIN";
                        default:
                          return "Unknown";
                      }
                    })()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white">Loading deployed DAOs...</p>
            )}
          </div>
        </div>

        {/* Right Column: DAO Creation Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl p-6">
            {/* Header with image */}
            <div className="flex flex-col items-center">
              <img
                src={daoImage}
                alt="DAO"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                Create a New DAO
              </h2>
            </div>

            {/* Conditional Fee Display */}
            <div className="mb-4">
              <p className="text-white text-sm">Fee:</p>
              <div className="flex justify-center mt-2">
                {daoType === "eth" ? (
                  <div className="text-white text-center">
                    <p className="text-xs">ETH DAO Fee</p>
                    <p className="font-semibold">
                      {nativeFee
                        ? formatUnits(nativeFee.toString(), 18)
                        : "Loading..."}
                    </p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <p className="text-xs">Token DAO Fee</p>
                    <p className="font-semibold">
                      {tokenFee
                        ? formatUnits(tokenFee.toString(), 18)
                        : "Loading..."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isConnected ? (
              <form onSubmit={handleCreateDAO} className="space-y-4">
                <div>
                  <label className="block text-white text-sm mb-1">
                    DAO Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter DAO Name"
                    value={daoName}
                    onChange={(e) => setDaoName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm mb-1">
                      Quorum (%)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter quorum percentage"
                      value={quorum}
                      onChange={(e) => setQuorum(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">
                      Voting Period (days)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter voting period in days"
                      value={votingPeriodDays}
                      onChange={(e) => setVotingPeriodDays(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm mb-1">
                      DAO Type
                    </label>
                    <select
                      value={daoType}
                      onChange={(e) => setDaoType(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    >
                      <option value="eth">ETH DAO</option>
                      <option value="token">Token DAO</option>
                    </select>
                  </div>
                  {daoType === "token" && (
                    <div>
                      <label className="block text-white text-sm mb-1">
                        Token Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter token address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                        required={daoType === "token"}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                  >
                    <option value="0">NFT</option>
                    <option value="1">GAMING</option>
                    <option value="2">COMMUNITY</option>
                    <option value="3">DEFI</option>
                    <option value="4">AI</option>
                    <option value="5">DEGEN</option>
                    <option value="6">MEMECOIN</option>
                  </select>
                </div>

                {/* Fee Approval Section for Token DAO */}
                {daoType === "token" && (
                  <div>
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
                )}

                <button
                  type="submit"
                  disabled={creating || isLoading}
                  className="w-full py-2 mt-4 bg-black border border-white text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {creating || isLoading ? "Creating..." : "Create DAO"}
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-2">
                    Error: {error.message}
                  </p>
                )}
                {isSuccess && (
                  <p className="text-green-500 text-sm mt-2">
                    DAO Created! Tx Hash: {txData?.hash}
                  </p>
                )}
              </form>
            ) : (
              <p className="text-white text-center">
                Please connect your wallet to create a DAO.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DAOFactoryComponent;
