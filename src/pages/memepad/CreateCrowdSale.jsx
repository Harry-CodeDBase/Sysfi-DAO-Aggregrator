import React, { useState } from "react";
import { motion } from "framer-motion";
import useCreateCrowdsale from "../../hooks/useCrowdSaleFactory";
import { parseEther } from "viem";

export default function CrowdsaleCreator() {
  const [token, setToken] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tokensForSale, setTokensForSale] = useState("");
  const [rate, setRate] = useState("");
  const [softCap, setSoftCap] = useState("");
  const [hardCap, setHardCap] = useState("");

  // Get the createCrowdsale function and states from our hook
  const { createCrowdsale, data, isLoading, error } = useCreateCrowdsale();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert date strings to Unix timestamps (in seconds)
      const startTime = Math.floor(new Date(startDate).getTime() / 1000);
      const endTime = Math.floor(new Date(endDate).getTime() / 1000);

      // Convert the rate, softCap, and hardCap appropriately:
      // - tokensForSale will be converted in the hook.
      // - Convert rate to BigInt.
      // - Convert softCap and hardCap (in ETH) to wei using parseEther.
      const rateConverted = BigInt(rate);
      const softCapConverted = parseEther(softCap);
      const hardCapConverted = parseEther(hardCap);

      // Pass the gathered data directly as an object to the hook.
      await createCrowdsale({
        token,
        startTime,
        endTime,
        tokensForSale, // Pass raw value (conversion happens inside the hook)
        rate: rateConverted,
        softCap: softCapConverted,
        hardCap: hardCapConverted,
      });

      console.log("Crowdsale creation initiated");
    } catch (err) {
      console.error("Failed to create crowdsale:", err);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-teal-300 mb-6 text-center">
          Create a New Crowdsale
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Token Address" value={token} onChange={setToken} />
          <InputField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={setStartDate}
          />
          <InputField
            label="End Date"
            type="date"
            value={endDate}
            onChange={setEndDate}
          />
          <InputField
            label="Tokens For Sale"
            type="number"
            value={tokensForSale}
            onChange={setTokensForSale}
          />
          <InputField
            label="Rate (tokens per ETH)"
            type="number"
            value={rate}
            onChange={setRate}
          />
          <InputField
            label="Soft Cap (in ETH)"
            type="number"
            value={softCap}
            onChange={setSoftCap}
          />
          <InputField
            label="Hard Cap (in ETH)"
            type="number"
            value={hardCap}
            onChange={setHardCap}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-teal-300 text-black font-bold rounded hover:bg-black hover:text-teal-300 transition-colors duration-300"
          >
            {isLoading ? "Creating Crowdsale..." : "Create Crowdsale"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
        {data && (
          <p className="mt-4 text-green-500">
            Crowdsale created! Transaction hash: {data.hash}
          </p>
        )}
      </motion.div>
    </div>
  );
}

// Reusable InputField component
const InputField = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-teal-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-teal-300"
      required
    />
  </div>
);
