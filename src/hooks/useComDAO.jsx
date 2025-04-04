import { useContractRead } from "wagmi";
import abi from "../abi/DAOCore.json"; // Ensure ABI includes these public variables

export function useDAOData(contractAddress) {
  const { data: token, isLoading: loadingToken } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "token",
  });

  const { data: quorum, isLoading: loadingQuorum } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "quorum",
  });

  const { data: totalTokensDelegated, isLoading: loadingTotalTokens } =
    useContractRead({
      address: contractAddress,
      abi: abi,
      functionName: "totalTokensDelegated",
    });

  const { data: votingPeriod, isLoading: loadingVotingPeriod } =
    useContractRead({
      address: contractAddress,
      abi: abi,
      functionName: "votingPeriodHours",
    });

  const { data: name, isLoading: loadingName } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "name",
  });

  const isLoading =
    loadingToken ||
    loadingQuorum ||
    loadingTotalTokens ||
    loadingVotingPeriod ||
    loadingName;

  return { token, quorum, totalTokensDelegated, votingPeriod, name, isLoading };
}
