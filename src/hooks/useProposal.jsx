import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import abi from "../abi/SYNDAO.json";
import { synDAOConfig } from "./Contract";

const DAO_ABI = abi;
const DAO_ADDRESS = "0x3d5fEF5ba907f8F4734F2e54f877A783933021A4";

function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchProposals() {
      try {
        // Step 1: Get the proposal count
        const proposalCount = await publicClient.readContract({
          address: synDAOConfig.address,
          abi: synDAOConfig.abi,
          functionName: "proposalCount",
        });

        const fetchedProposals = [];

        // Step 2: Fetch each proposal and map the array to fields
        for (let i = 0; i < proposalCount; i++) {
          const proposalArray = await publicClient.readContract({
            address: synDAOConfig.address,
            abi: synDAOConfig.abi,
            functionName: "proposals",
            args: [i+1],
          });


          // Map the array to structured proposal fields
          fetchedProposals.push({
            id: proposalArray[0].toString(),
            title: proposalArray[1],
            description: proposalArray[2],
            amount: proposalArray[3].toString(),
            recipient: proposalArray[4],
            status: proposalArray[5].toString(),
            timestamp: proposalArray[6].toString(),
            proposalType: proposalArray[7].toString(),
            upVotes: proposalArray[8].toString(),
            downVotes: proposalArray[9].toString(),
          });
        }

        setProposals(fetchedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [publicClient]);

  return { proposals, loading };
}

export default useProposals;
