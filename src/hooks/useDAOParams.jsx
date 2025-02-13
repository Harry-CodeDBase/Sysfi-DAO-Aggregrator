// useDaoParams.js
import { useContractReads } from "wagmi";
import { synDAOConfig } from "./Contract";

// Optional: Log the contract configuration to ensure it's correct.
console.log("synDAOConfig loaded:", synDAOConfig);

export function useDaoParams() {
  // useContractReads lets us query multiple contract functions at once.
  const { data, isLoading, error } = useContractReads({
    contracts: [
      {
        address: synDAOConfig.address,
        abi: synDAOConfig.abi,
        functionName: "proposalCount",
      },
      {
        address: synDAOConfig.address,
        abi: synDAOConfig.abi,
        functionName: "votingPeriodDays",
      },
      {
        address: synDAOConfig.address,
        abi: synDAOConfig.abi,
        functionName: "votingDelay",
      },
      {
        address: synDAOConfig.address,
        abi: synDAOConfig.abi,
        functionName: "coolingPeriod",
      },
    ],
    // Optionally, you can set `watch: true` to keep the data updated with each new block.
    // watch: true,
  });

  // data is an array in the same order as the contracts above.
  return {
    proposalCount: data ? data[0] : undefined,
    votingPeriodDays: data ? data[1] : undefined,
    votingDelay: data ? data[2] : undefined,
    coolingPeriod: data ? data[3] : undefined,
    isLoading,
    error,
  };
}
