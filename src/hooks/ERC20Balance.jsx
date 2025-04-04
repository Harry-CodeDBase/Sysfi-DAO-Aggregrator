import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { tokenContractConfig } from "./Contract";
import { formatUnits } from "viem"; // Use viem's formatUnits

function Balance() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useReadContract({
    ...tokenContractConfig,
    functionName: "balanceOf",
    args: [address],
  });

  // Convert balance to Ether and format it
  const formattedBalance = balance
    ? Number(formatUnits(balance, 18)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  return (
    <div>
      {isConnected ? <p>{formattedBalance} SYN</p> : <p>Not Connected</p>}
    </div>
  );
}

export default Balance;
