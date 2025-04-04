import React, { useState } from "react";
import { useDAOFactory } from "../../hooks/useDAOFactory";
import daoImage from "../../img/loader.png";
import makeBlockie from "ethereum-blockies-base64";
import { useNavigate } from "react-router-dom";
import Loader from "../../utils/Loader";

function DAC() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(""); // Default: all genres

  const { isDataReady, deployedDAOs } = useDAOFactory();

  if (!isDataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src={daoImage} alt="Loading..." className="w-20 h-20" />
        <p className="text-white ml-4">Initializing DAO Factory...</p>
      </div>
    );
  }

  // Genre options
  const genres = [
    "NFT",
    "GAMING",
    "COMMUNITY",
    "DEFI",
    "AI",
    "DEGEN",
    "MEMECOIN",
  ];

  // Filter DAOs based on search & genre selection
  const filteredDAOs = deployedDAOs
    ? deployedDAOs.filter(
        (dao) =>
          dao.daoName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedGenre === "" || genres[dao.genre] === selectedGenre)
      )
    : [];

  // Reset search & filter
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-2">
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row ">
        {/* Left Column: Search, Filter, and Reset */}
        <div className="w-full min-h-[60vh]">
          <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl p-2 border-b-2 border-teal-500">
            <h3 className="text-lg font-bold text-white mb-1">DACs & DAOs</h3>

            {/* Search, Filter, and Reset Button (inline) */}
            <div className="flex w-full flex-row-reverse items-center gap-1 mb-1">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search DAO by name."
                className=" w-2/5 p-2 rounded-md bg-gray-900 text-white border border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Genre Filter */}
              <select
                className=" w-1/5 p-2 rounded-md bg-gray-900 text-white border border-gray-600"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>

              {/* Reset Button */}
              <span
                onClick={resetFilters}
                className=" p-2 text-white font-semibold cursor-pointer"
              >
                All
              </span>
            </div>
          </div>
          <div className=" bg-black h-[85vh] p-1 rounded-xl mt-2 scroll-auto border border-teal-300 ">
            <div className="grid grid-cols-2 lg:grid-cols-4 ">
              {/* DAO List */}
              {filteredDAOs.length > 0 ? (
                filteredDAOs.map((dao, index) => (
                  <div
                    key={index}
                    className="card"
                    onClick={() =>
                      navigate(
                        `/dao/${dao.daoAddress}?name=${encodeURIComponent(
                          dao.daoName
                        )}&genre=${dao.genre}`
                      )
                    }
                  >
                    <img
                      src={makeBlockie(dao.daoAddress)}
                      alt="DAO Blockie"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="text-white text-lg font-semibold">
                        {dao.daoName}
                      </p>
                      <p className="text-gray-400 text-lg">
                        {" "}
                        {dao.daoAddress.slice(0, 3)}...
                        {dao.daoAddress.slice(-3)}
                      </p>
                      <p className="text-gray-400 text-lg">
                        Genre: {genres[dao.genre] || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No DAOs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DAC;
