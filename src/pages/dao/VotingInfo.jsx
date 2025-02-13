// components/VotingInfo.tsx
import React from "react";
import { useReadContract } from "wagmi";
import { synDAOConfig, tokenContractConfig } from "../../hooks/Contract";
import { formatUnits } from "viem";

export const VotingInfo = () => {
    const { data: balance } = useReadContract({
        ...tokenContractConfig,
        functionName: "balanceOf",
        args: [synDAOConfig.address],
      });
    
      // Convert balance to Ether and format it
      const formattedBalance = balance
        ? Number(formatUnits(balance, 18)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
  return (
    <div className="flex justify-around items-center">
        <p  className="bg-black text-white text-center p-2 rounded-md">Treasury <br /> {formattedBalance} $SYN </p>
      <p className="bg-black text-white text-center p-2 rounded-md">Voting Period <br /> 7 days</p>
      <p className="bg-black text-white text-center p-2 rounded-md">Voting Delay <br /> 1 day</p>
      <p className="bg-black text-white text-center p-2 rounded-md">Cooling Period <br /> 1 day</p>
    </div>
  );
};


