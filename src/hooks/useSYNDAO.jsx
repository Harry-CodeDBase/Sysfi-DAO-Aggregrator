import {
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { synDAOConfig } from "./Contract";


function useDAO() {
  // State to hold DAO stats
  const [daoStats, setDaoStats] = useState({
    coolingPeriod: null,
    votingPeriod: null,
    votingDelay: null,
  });

  // Function to fetch DAO stats using wagmi contract reads
  useEffect(() => {
    async function fetchStats() {
      try {
        const coolingPeriod = await useContractRead({
          address: synDAOConfig.address,
          abi: synDAOConfig.abi,
          functionName: "coolingPeriod",
        });

        const votingPeriod = await useContractRead({
          address: synDAOConfig.address,
          abi: synDAOConfig.abi,
          functionName: "votingPeriodDays",
        });

        const votingDelay = await useContractRead({
          address: synDAOConfig.address,
          abi: synDAOConfig.abi,
          functionName: "votingDelay",
        });

        setDaoStats({
          coolingPeriod: coolingPeriod.data,
          votingPeriod: votingPeriod.data,
          votingDelay: votingDelay.data,
        });
      } catch (error) {
        console.error("Error fetching DAO stats:", error);
      }
    }
    fetchStats();
  }, []);

  // Create a new proposal
  const { config: createProposalConfig } = useContractWrite({
    address: synDAOConfig.address,
    abi: synDAOConfig.abi,
    functionName: "createProposal",
  });

  const { writeContract: createProposal } = useContractWrite(createProposalConfig);

  const createNewProposal = (
    title,
    description,
    amount,
    recipient,
    proposalType
  ) => {
    createProposal?.({
      args: [
        title,
        description,
        parseEther(amount.toString()),
        recipient,
        proposalType,
      ],
    });
  };

  // Vote on a proposal
  const voteOnProposal = (proposalId, upvote) => {
    const voteFunctionName = upvote ? "upVote" : "downVote";

    const { config: voteConfig } = usePrepareContractWrite({
      address: synDAOConfig.address,
      abi: synDAOConfig.abi,
      functionName: voteFunctionName,
      args: [proposalId],
    });

    const { writeContract: vote } = useContractWrite(voteConfig);
    vote?.();
  };

  // Finalize a proposal
  const finalizeProposal = (proposalId) => {
    const { config: finalizeConfig } = usePrepareContractWrite({
      address: synDAOConfig.address,
      abi: synDAOConfig.abi,
      functionName: "finalizeProposal",
      args: [proposalId],
    });

    const { writeContract: finalize } = useContractWrite(finalizeConfig);
    finalize?.();
  };

  // Delegate tokens
  const delegateTokens = (delegatee) => {
    const { config: delegateConfig } = usePrepareContractWrite({
      address: synDAOConfig.address,
      abi: synDAOConfig.abi,
      functionName: "delegate",
      args: [delegatee],
    });

    const { writeContract: delegate } = useContractWrite(delegateConfig);
    delegate?.();
  };

  // Undelegate tokens
  const undelegateTokens = () => {
    const { config: undelegateConfig } = usePrepareContractWrite({
      address: synDAOConfig.address,
      abi: synDAOConfig.abi,
      functionName: "undelegate",
    });

    const { writeContract: undelegate } = useContractWrite(undelegateConfig);
    undelegate?.();
  };

  return {
    daoStats,
    createNewProposal,
    voteOnProposal,
    finalizeProposal,
    delegateTokens,
    undelegateTokens,
  };
}

export default useDAO;
