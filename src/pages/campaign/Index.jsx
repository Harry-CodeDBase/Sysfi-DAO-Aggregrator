import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/Context"; // Assuming AuthProvider is set up
import CampaignList from "./CampaignList"; // User campaign view
import CampaignCreation from "./CreateCampaign"; // Admin campaign creation
import AdminCampaignVerification from "./AdminCampaignVerification"; // Admin verification interface
import { Link } from "react-router-dom";

function CampaignIndex() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is an admin based on their email
    if (currentUser?.email === "harryfrancis037@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2">

      {isAdmin ? <CampaignCreation /> : <CampaignList />}
    </div>
  );
}






export default CampaignIndex;
