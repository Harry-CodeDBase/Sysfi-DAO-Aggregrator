import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import abi from "../abi/DAO.json";

const DAO_ABI = abi;

function useProposals(daoAddress) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(daoAddress);

  const publicClient = usePublicClient();

  useEffect(() => {
    if (!daoAddress) return; // Prevent execution if daoAddress is undefined

    async function fetchProposals() {
      try {
        // Get the proposal count and ensure it's a number
        const proposalCount = Number(
          await publicClient.readContract({
            address: daoAddress,
            abi: DAO_ABI,
            functionName: "proposalCount",
          })
        );

        const fetchedProposals = [];

        // Fetch each proposal
        for (let i = 0; i < proposalCount; i++) {
          const proposalArray = await publicClient.readContract({
            address: daoAddress,
            abi: DAO_ABI,
            functionName: "proposals",
            args: [i + 1],
          });

          console.log(`Fetched Proposal ${i}:`, proposalArray); // ✅ Debugging

          fetchedProposals.push({
            id: proposalArray[0].toString(),
            title: proposalArray[1],
            description: proposalArray[2],
            amount: proposalArray[3].toString(),
            recipient: proposalArray[4],
            isFunding: proposalArray[5],
            upVotes: proposalArray[6].toString(),
            downVotes: proposalArray[7].toString(),
            status: proposalArray[8].toString(),
            timestamp: proposalArray[9].toString(),
          });
        }

        setProposals(fetchedProposals);
        console.log("Proposals:", fetchedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [publicClient, daoAddress]); // ✅ Added daoAddress to dependencies

  return { proposals, loading };
}

export default useProposals;
