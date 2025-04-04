import React from "react";
import { useReadContract } from "wagmi";
import { synDAOConfig, tokenContractConfig } from "../../hooks/Contract";
import { formatUnits } from "viem";
import { Hourglass, Coins, Clock, Calendar } from "lucide-react";

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-teal-500/10 backdrop-blur-md rounded-xl shadow-lg card">
      <div className="flex items-center gap-2 p-3 bg-black/40 text-white rounded-md">
        <Coins className="w-5 h-5 text-teal-500" />
        <p className="text-center">
          Treasury <br /> {formattedBalance} $SYN
        </p>
      </div>
      <div className="flex items-center gap-2 p-3 bg-black/40 text-white rounded-md">
        <Hourglass className="w-5 h-5 text-teal-500" />
        <p className="text-center">
          Voting Period <br /> 7 days
        </p>
      </div>
      <div className="flex items-center gap-2 p-3 bg-black/40 text-white rounded-md">
        <Clock className="w-5 h-5 text-teal-500" />
        <p className="text-center">
          Voting Delay <br /> 1 day
        </p>
      </div>
      <div className="flex items-center gap-2 p-3 bg-black/40 text-white rounded-md">
        <Calendar className="w-5 h-5 text-teal-500" />
        <p className="text-center">
          Cooling Period <br /> 1 day
        </p>
      </div>
    </div>
  );
};
