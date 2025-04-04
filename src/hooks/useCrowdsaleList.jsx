import React, { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { CreateCrowdsaleConfig } from "./Contract";
import Loader from "../utils/Loader";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../utils/Firebase"; // Import Firebase
import { doc, getDoc } from "firebase/firestore";
import banner from "../img/banner.jpg";

export default function CrowdsalesList() {
  const [selectedTab, setSelectedTab] = useState(1);
  const [crowdsaleData, setCrowdsaleData] = useState({});
  const navigate = useNavigate();

  // Fetch crowdsale addresses from blockchain
  const {
    data: crowdsales,
    isLoading,
    error,
  } = useContractRead({
    address: CreateCrowdsaleConfig.address,
    abi: CreateCrowdsaleConfig.abi,
    functionName: "getCrowdsales",
  });

  const crowdsaleAddresses = crowdsales || [];

  // Fetch details from Firebase for each crowdsale
  useEffect(() => {
    const fetchCrowdsaleDetails = async () => {
      const data = {};
      for (const address of crowdsaleAddresses) {
        const docRef = doc(db, "crowdsales", address);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data[address] = docSnap.data();
        }
      }
      setCrowdsaleData(data);
    };

    if (crowdsaleAddresses.length > 0) {
      fetchCrowdsaleDetails();
    }
  }, [crowdsaleAddresses]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="bg-black p-2 rounded-lg border-b-2 border-teal-400 shadow-md shadow-indigo-500">
        <div className="flex justify-between mb-3">
          <h2 className="text-white text-xl font-bold mb-4">Memepad</h2>
          <Link
            className="bg-black/70 text-white border-teal-500 border-2 p-1 px-3 rounded-3xl"
            to={"/factory/crowdsale"}
          >
            <p>Create Crowdsale</p>
          </Link>
        </div>

        <img className="w-full rounded-lg mt-1" src={banner} />
        {/* Tab Navigation */}
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 mr-2 rounded ${
              selectedTab === 1
                ? "bg-black text-teal-300 border-2 border-teal-500"
                : "bg-black/70 text-teal-300"
            }`}
            onClick={() => setSelectedTab(1)}
          >
            Ongoing
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded ${
              selectedTab === 2
                ? "bg-black text-teal-300 border-2 border-teal-500"
                : "bg-black/70 text-teal-300"
            }`}
            onClick={() => setSelectedTab(2)}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Crowdsale Cards */}
      <div className="w-full grid grid-cols-2 justify-around gap-4 mt-4">
        {crowdsaleAddresses.length === 0 ? (
          <p className="text-gray-400">No crowdsales available.</p>
        ) : (
          crowdsaleAddresses.map((addr, idx) => {
            const details = crowdsaleData[addr] || {};

            return (
              <div
                key={idx}
                className="bg-black/70 text-white p-1 rounded-lg border border-teal-500 cursor-pointer hover:bg-teal-900 hover:text-black transition-all w-full shadow-lg"
                onClick={() => navigate(`/launchpad/${addr}`)}
              >
                {/* Banner Image */}
                <img
                  src={details.imageUrl || "/placeholder.jpg"}
                  alt="Crowdsale Banner"
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />

                {/* Contract Address */}
                <p className="text-xs text-gray-300 truncate">
                  <strong>Contract:</strong> {addr.slice(0, 6)}...
                  {addr.slice(-4)}
                </p>

                {/* Title */}
                <h3 className="text-lg font-bold text-teal-400 mt-1">
                  {details.title || "Untitled Crowdsale"}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mt-1">
                  {details.description
                    ? details.description.slice(0, 80) + "..."
                    : "No description available."}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
