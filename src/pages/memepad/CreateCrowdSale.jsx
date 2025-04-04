import React, { useState } from "react";
import { motion } from "framer-motion";
import useCreateCrowdsale from "../../hooks/useCrowdSaleFactory";
import { parseEther } from "viem";

import { useAccount } from "wagmi";

// Firebase imports
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../utils/Firebase";

// Assume Loader is a simple spinner component
import Loader from "../../utils/Loader";
import UserCrowdsales from "./UserCrowdsale";

export default function CrowdsaleCreator() {
  // Basic crowdsale parameters
  const [token, setToken] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tokensForSale, setTokensForSale] = useState("");
  const [rate, setRate] = useState("");
  const [softCap, setSoftCap] = useState("");

  // Additional metadata fields to be stored in Firestore
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState([]); // Array of objects: { type, url }
  // Temporary states to add a link
  const [linkType, setLinkType] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Loader states for overlay messages
  const [creating, setCreating] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  // Get the owner address from Wagmi (the address deploying the contract)
  const { address: ownerAddress } = useAccount();

  // Get the createCrowdsale function and status from our hook.
  const { createCrowdsale, crowdsaleAddress, data, isLoading, error } =
    useCreateCrowdsale();

  // Compute the estimated hard cap based on tokensForSale and rate.
  // We remove 10% (i.e. use 90% of tokensForSale) and then divide by rate.
  const computedHardCap =
    tokensForSale && rate
      ? ((Number(tokensForSale) * 0.9) / Number(rate)).toFixed(2)
      : "";

  // Function to add a link to the list
  const addLink = () => {
    if (linkType.trim() === "" || linkUrl.trim() === "") {
      alert("Please fill in both link type and URL.");
      return;
    }
    setLinks([...links, { type: linkType, url: linkUrl }]);
    setLinkType("");
    setLinkUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setLoaderMessage("Creating crowdsale contract...");

    try {
      const startTime = Math.floor(new Date(startDate).getTime() / 1000);
      const endTime = Math.floor(new Date(endDate).getTime() / 1000);

      const rateConverted = BigInt(rate);
      const tokenForSaleConverted = parseEther(tokensForSale);
      const softCapConverted = parseEther(softCap);
      const estimatedHardCap =
        tokensForSale && rate
          ? (Number(tokensForSale) * 0.9) / Number(rate)
          : 0;
      const hardCapConverted = parseEther(estimatedHardCap.toString());

      await createCrowdsale({
        token,
        startTime,
        endTime,
        tokensForSale,
        rate: rateConverted,
        softCap: softCapConverted,
        hardCap: hardCapConverted,
      });
      setLoaderMessage(
        "Crowdsale creation initiated. Waiting for contract address..."
      );

      // Wait for the contract address to become available
      let retries = 10;
      while (!crowdsaleAddress && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        retries--;
      }

      if (!crowdsaleAddress) {
        throw new Error("Failed to retrieve contract address");
      }

      setLoaderMessage("Transaction confirmed. Uploading image...");
      let imageUrl = "";
      if (imageFile) {
        const txHash = data.hash;
        const imageRef = ref(
          storage,
          `crowdsale_images/${txHash}_${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      setLoaderMessage("Saving crowdsale details to Firebase...");
      await addDoc(collection(db, "crowdsales"), {
        title,
        description,
        links,
        imageUrl,
        contractAddress: crowdsaleAddress,
        ownerAddress: ownerAddress || "N/A",
        createdAt: new Date(),
      });

      setLoaderMessage("Crowdsale created successfully!");
    } catch (err) {
      console.error("Failed to create crowdsale:", err);
      setLoaderMessage(`Error: ${err.message}`);
    } finally {
      setTimeout(() => {
        setCreating(false);
        setLoaderMessage("");
      }, 3000);
    }
  };

  return (
    <div className="w-full relative min-h-screen flex flex-col lg:flex-row-reverse items-start justify-center p-4">
      {/* Overlay Loader */}
      {(isLoading || creating) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <Loader />
          <p className="mt-4 text-white text-xl font-bold">{loaderMessage}</p>
        </div>
      )}

      <motion.div
        className="w-full lg:w-1/3 bg-gray-800/30 p-2 rounded-lg shadow-lg relative "
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-teal-300 mb-6 text-center">
          Create a New Crowdsale
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Basic Crowdsale Parameters */}
          <section className="border-b border-gray-600 pb-4">
            <h3 className="text-xl font-semibold text-teal-300 mb-4">
              Crowdsale Parameters
            </h3>
            <InputField
              label="Token Address"
              placeholder="e.g., 0x123..."
              value={token}
              onChange={setToken}
            />
            <div className="flex gap-2">
              <InputField
                label="Start Date"
                type="date"
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChange={setStartDate}
              />
              <InputField
                label="End Date"
                type="date"
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChange={setEndDate}
              />
            </div>
            <div className="flex gap-2">
              <InputField
                label="Tokens For Sale (10% to community)"
                type="number"
                placeholder="e.g., 1000"
                value={tokensForSale}
                onChange={setTokensForSale}
              />
              <InputField
                label="Rate (tokens per POL)"
                type="number"
                placeholder="e.g., 1000"
                value={rate}
                onChange={setRate}
              />
            </div>
            <div className="flex gap-4">
              <InputField
                label="Soft Cap (in ETH)"
                type="number"
                placeholder="e.g., 0.5"
                value={softCap}
                onChange={setSoftCap}
              />
              <InputField
                label="Estimated Hard Cap (in ETH)"
                type="text"
                placeholder="Auto-calculated"
                value={computedHardCap}
                onChange={() => {}}
                // Make it read-only
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={isLoading || creating}
            className="w-full py-2 px-4 bg-teal-300 text-black font-bold rounded hover:bg-black hover:text-teal-300 transition-colors duration-300 button"
          >
            Create Crowdsale
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
        {data && (
          <p className="mt-4 text-green-500">
            Crowdsale created! Transaction hash: {data.hash}
            Crowdsale created! Transaction hash: {data.contractAddress || "0"}
            Crowdsale created! Transaction hash: {data.address || "0"}
          </p>
        )}
      </motion.div>

      <div className="w-full lg:w-2/3 justify-start">
        <UserCrowdsales />
      </div>
    </div>
  );
}

// A reusable InputField component with placeholder support.
const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="w-full p-1 my-1 shadow-2xl">
    <label className="block text-teal-300 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-1 bg-black/50 border border-teal-500 rounded-lg text-white focus:outline-none focus:border-teal-300"
      required
      readOnly={type === "text" && placeholder === "Auto-calculated"}
    />
  </div>
);
