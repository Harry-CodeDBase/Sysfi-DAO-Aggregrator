import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/Context"; // Assuming AuthProvider is set up
import CampaignList from "./CampaignList"; // User campaign view
import CampaignCreation from "./CampaignCreation"; // Admin campaign creation
import AdminCampaignVerification from "./AdminCampaignVerification"; // Admin verification interface
import { Link } from "react-router-dom";
import CampaignDetail from "./CampaignDetails";

function CampaignContainer() {
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
    <div className="min-h-screen bg-gray-900 text-white p-1">
      <h1 className="text-3xl font-bold mb-6"></h1>

      {isAdmin ? <AdminCampaignVerification /> : <CampaignDetail />}
    </div>
  );
}

export default CampaignContainer;
