import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import daoABI from "../abi/DAO.json";

function useDaoProposals(daoAddress) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function fetchProposals() {
      try {
        if (!daoAddress) {
          console.warn("⚠️ DAO Address is undefined, skipping fetch.");
          return;
        }

        console.log(`🔍 Fetching proposals for DAO Address: ${daoAddress}`);

        // Fetch the total number of proposals
        const proposalCount = await publicClient.readContract({
          address: daoAddress,
          abi: daoABI,
          functionName: "proposalCount",
        });

        console.log(`✅ Total Proposals Found: ${proposalCount}`);

        const fetchedProposals = [];

        for (let i = 0; i < proposalCount; i++) {
          console.log(`📡 Fetching proposal #${i}`);

          const proposalData = await publicClient.readContract({
            address: daoAddress,
            abi: daoABI,
            functionName: "proposals",
            args: [i + 1], // Solidity arrays start at 0
          });

          console.log(`📥 Raw Proposal Data [${i}]:`, proposalData);

          fetchedProposals.push({
            id: proposalData[0].toString(),
            title: proposalData[1],
            description: proposalData[2],
            amount: proposalData[3].toString(),
            recipient: proposalData[4],
            isFunding: proposalData[5], // Boolean value
            timestamp: proposalData[6].toString(),
            status: proposalData[7].toString(), 
            upVotes: proposalData[8].toString(),
            downVotes: proposalData[9].toString(),
          });

          console.log(`✅ Proposal #${i} processed and added.`);
        }

        console.log("📌 Final Processed Proposals Array:", fetchedProposals);
        setProposals(fetchedProposals);
      } catch (error) {
        console.error("❌ Error fetching proposals:", error);
      } finally {
        setLoading(false);
        console.log("✅ Proposal fetching complete. State updated.");
      }
    }

    fetchProposals();
  }, [daoAddress, publicClient]);

  return { proposals, loading };
}

export default useDaoProposals;
