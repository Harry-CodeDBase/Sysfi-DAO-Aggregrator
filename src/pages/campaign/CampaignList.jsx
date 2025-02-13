import React, { useEffect, useState } from "react";
import { db } from "../../utils/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const querySnapshot = await getDocs(collection(db, "campaigns"));
      const campaignList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCampaigns(campaignList);
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-1">
      <h1 className="text-3xl font-bold mb-6">Available Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="p-4 bg-gray-800 rounded-lg">
            {campaign.imageUrl && (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="mb-4 rounded"
              />
            )}
            <h2 className="text-2xl font-bold">{campaign.title}</h2>
            <p>
              {campaign.rewardType === "points"
                ? `${campaign.rewardValue} points`
                : `Badge Level: ${campaign.rewardValue}`}
            </p>
            <Link
              to={`/campaign/${campaign.id}`}
              className="text-teal-400 underline mt-2 block"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignList;
