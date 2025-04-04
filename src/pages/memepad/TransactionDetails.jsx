import { useState } from "react";
import { usePublicClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { polygon } from "wagmi/chains";

const TransactionDetails = ({ txHash }) => {
  const publicClient = usePublicClient({ chainId: polygon.id });
  const [txData, setTxData] = useState < any > null;
  const [loading, setLoading] = useState(false);

  const fetchTransaction = async () => {
    if (!txHash) return;
    setLoading(true);
    try {
      const transaction = await publicClient.getTransaction({ hash: txHash });
      const receipt = await publicClient.getTransactionReceipt({
        hash: txHash,
      });

      setTxData({ transaction, receipt });
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-800 text-white">
      <h2 className="text-xl font-bold">Transaction Details</h2>
      <button
        onClick={fetchTransaction}
        className="mt-2 bg-blue-600 px-4 py-2 rounded-lg"
      >
        {loading ? "Loading..." : "Fetch Transaction"}
      </button>

      {txData && (
        <div className="mt-4 text-sm">
          <p>
            <strong>Status:</strong>{" "}
            {txData.receipt?.status === "success" ? "✅ Success" : "❌ Failed"}
          </p>
          <p>
            <strong>Block:</strong>{" "}
            {parseInt(txData.receipt?.blockNumber || "0", 16)}
          </p>
          <p>
            <strong>From:</strong> {txData.transaction?.from}
          </p>
          <p>
            <strong>To:</strong> {txData.transaction?.to}
          </p>
          <p>
            <strong>Gas Price:</strong>{" "}
            {formatUnits(BigInt(txData.transaction?.gasPrice || "0"), 9)} Gwei
          </p>
          <p>
            <strong>Gas Used:</strong>{" "}
            {parseInt(txData.receipt?.gasUsed || "0", 16)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
