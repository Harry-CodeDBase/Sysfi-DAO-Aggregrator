import React from "react";
import { useDAOData } from "../../hooks/useComDAO";

export default function DAOComponent() {
  const { token, quorum, totalTokensDelegated, votingPeriod, name, isLoading } =
    useDAOData(contractAddress);

    const contractAddress = "0xf88e37fe27335d342D8EBD7dA1C27270b46BDF45";

  if (isLoading) return <p>Loading DAO data...</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
      <h2 className="text-teal-300 text-2xl font-bold mb-4">{name}</h2>
      <p>
        <strong>Token Address:</strong> {token}
      </p>
      <p>
        <strong>Quorum:</strong> {quorum?.toString()}%
      </p>
      <p>
        <strong>Total Tokens Delegated:</strong>{" "}
        {totalTokensDelegated?.toString()}
      </p>
      <p>
        <strong>Voting Period:</strong> {votingPeriod?.toString()} hours
      </p>
    </div>
  );
}
