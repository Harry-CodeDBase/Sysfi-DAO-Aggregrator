import React, { useEffect, useState } from "react";
import { db } from "../../utils/Firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

function AdminCampaignVerification() {
  const { campaignId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [campaign, setCampaign] = useState({});

  useEffect(() => {
    const fetchCampaignSubmissions = async () => {
      const submissionSnapshot = await getDocs(
        collection(db, `campaigns/${campaignId}/submissions`)
      );
      const submissionList = submissionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(submissionList);
    };

    const fetchCampaignDetails = async () => {
      const campaignRef = doc(db, "campaigns", campaignId);
      const campaignSnapshot = await getDoc(campaignRef);
      if (campaignSnapshot.exists()) {
        setCampaign(campaignSnapshot.data());
      }
    };

    fetchCampaignDetails();
    fetchCampaignSubmissions();
  }, [campaignId]);

  // Handle verification or rejection of a proof
  const handleVerification = async (submission, action) => {
    try {
      // Update the submission status
      await updateDoc(
        doc(db, `campaigns/${campaignId}/submissions`, submission.id),
        {
          status: action === "verify" ? "verified" : "flagged",
        }
      );

      if (action === "verify") {
        const userRef = doc(db, "users", submission.userId);

        if (campaign.rewardType === "points") {
          // Increment point balance
          await updateDoc(userRef, {
            pointBalance: increment(campaign.rewardValue),
          });
        } else if (campaign.rewardType === "badge") {
          // Append new badge to the array of badges
          await updateDoc(userRef, {
            achievementBadges: arrayUnion(campaign.rewardValue),
          });
        }

        alert(
          `Submission verified. Reward: ${campaign.rewardValue} ${campaign.rewardType}`
        );
      } else {
        alert("Submission flagged as false.");
      }

      // Refresh submissions list
      setSubmissions((prevSubmissions) =>
        prevSubmissions.filter((sub) => sub.id !== submission.id)
      );
    } catch (error) {
      console.error("Error updating submission: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Campaign Verification</h1>
      <h2 className="text-xl mb-4">Campaign: {campaign.title}</h2>
      <p className="mb-6">{campaign.description}</p>

      {submissions.length === 0 ? (
        <p>No submissions available for verification.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="p-4 bg-gray-800 rounded-lg">
              <p>
                <strong>User ID:</strong> {submission.userId}
              </p>
              <p>
                <strong>Proof Link:</strong>{" "}
                <a
                  href={submission.proofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 underline"
                >
                  View Proof
                </a>
              </p>
              <p>
                <strong>Status:</strong> {submission.status}
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleVerification(submission, "verify")}
                  className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleVerification(submission, "flag")}
                  className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                >
                  Flag as False
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCampaignVerification;
