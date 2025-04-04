import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useContractWrite } from "wagmi";
import daoABI from "../abi/DAO.json"; // DAO ABI
import erc20ABI from "../abi/Wsyn.json"; // Standard ERC-20 ABI for symbol fetching

export function useDAOInteraction(daoAddress) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [daoDetails, setDaoDetails] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalLoading, setProposalLoading] = useState(true);

  /** Fetch DAO details **/
  useEffect(() => {
    async function fetchDAOData() {
      try {
        const [votingPeriodHours, quorum, tokenAddress, totalVoters] = await Promise.all([
          publicClient.readContract({
            address: daoAddress,
            abi: daoABI,
            functionName: "votingPeriodHours",
          }),
          publicClient.readContract({
            address: daoAddress,
            abi: daoABI,
            functionName: "quorum",
          }),
          publicClient.readContract({
            address: daoAddress,
            abi: daoABI,
            functionName: "token",
          }),
          // publicClient.readContract({
          //   address: daoAddress,
          //   abi: daoABI,
          //   functionName: "proposalsVotedCount",
          // }),
          publicClient.readContract({
            address: daoAddress,
            abi: daoABI,
            functionName: "getVotersHeadcount",
          }),
        ]);

        let governanceTokenSymbol = "Unknown";

        if (tokenAddress !== "0x0000000000000000000000000000000000000000") {
          try {
            governanceTokenSymbol = await publicClient.readContract({
              address: tokenAddress,
              abi: erc20ABI,
              functionName: "symbol",
            });
          } catch (err) {
            console.error("Error fetching token symbol:", err);
          }
        }

        

        setDaoDetails({
          quorum: quorum.toString(),
          governanceToken: tokenAddress.toString(),
          votingPeriodHours: votingPeriodHours.toString(),
          governanceTokenSymbol: governanceTokenSymbol,
          totalVoters: totalVoters,

        });
     
      } catch (error) {
        console.error("Error fetching DAO details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (daoAddress) fetchDAOData();
  }, [daoAddress, publicClient]);

  /** Fetch DAO Proposals **/
  useEffect(() => {
    async function fetchProposals() {
      try {
        const proposalCount = await publicClient.readContract({
          address: daoAddress,
          abi: daoABI,
          functionName: "proposalCount",
        });

        const fetchedProposals = [];

        for (let i = 0; i < proposalCount; i++) {
          const proposalData = await publicClient.readContract({
            address: daoAddress,
            abi: daoABI,
            functionName: "proposals",
            args: [i],
          });

          fetchedProposals.push({
            id: proposalData[0].toString(),
            title: proposalData[1],
            description: proposalData[2],
            amount: proposalData[3].toString(),
            recipient: proposalData[4],
            status: proposalData[5].toString(), 
            timestamp: proposalData[6].toString(),
            proposalType: proposalData[7].toString(),
            upVotes: proposalData[8].toString(),
            downVotes: proposalData[9].toString(),
          });
        }

        setProposals(fetchedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setProposalLoading(false);
      }
    }

    if (daoAddress) fetchProposals();
  }, [daoAddress, publicClient]);

  /** Create a New Proposal **/
  const { writeContractAsync: createProposal } = useContractWrite();

  const submitProposal = async (
    title,
    description,
    amount,
    recipient,
    proposalType
  ) => {
    try {
      const tx = await createProposal({
        address: daoAddress,
        abi: daoABI,
        functionName: "createProposal",
        args: [title, description, BigInt(amount), recipient, proposalType],
        account: address,
      });
      return tx;
    } catch (err) {
      console.error("Error creating proposal:", err);
      throw err;
    }
  };

  /** Vote on a Proposal **/
  const voteOnProposal = async (proposalId, upvote) => {
    const functionName = upvote ? "upVote" : "downVote";
    try {
      const tx = await createProposal({
        address: daoAddress,
        abi: daoABI,
        functionName,
        args: [proposalId],
        account: address,
      });
      return tx;
    } catch (error) {
      console.error(`Error voting on proposal ${proposalId}:`, error);
      throw error;
    }
  };

  /** Finalize a Proposal **/
  const finalizeProposal = async (proposalId) => {
    try {
      const tx = await createProposal({
        address: daoAddress,
        abi: daoABI,
        functionName: "finalizeProposal",
        args: [proposalId],
        account: address,
      });
      return tx;
    } catch (error) {
      console.error("Error finalizing proposal:", error);
      throw error;
    }
  };

  /** Delegate and Undelegate Tokens **/
  const delegateTokens = async (delegatee) => {
    try {
      const tx = await createProposal({
        address: daoAddress,
        abi: daoABI,
        functionName: "delegate",
        args: [delegatee],
        account: address,
      });
      return tx;
    } catch (error) {
      console.error("Error delegating tokens:", error);
      throw error;
    }
  };

  const undelegateTokens = async () => {
    try {
      const tx = await createProposal({
        address: daoAddress,
        abi: daoABI,
        functionName: "undelegate",
        account: address,
      });
      return tx;
    } catch (error) {
      console.error("Error undelegating tokens:", error);
      throw error;
    }
  };

  return {
    daoDetails,
    proposals,
    loading,
    proposalLoading,
    submitProposal,
    voteOnProposal,
    finalizeProposal,
    delegateTokens,
    undelegateTokens,
  };
}
