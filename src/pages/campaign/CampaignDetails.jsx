import React, { useEffect, useState } from "react";
import { db } from "../../utils/Firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/Context";
import { formatDistanceToNowStrict } from "date-fns";
import badgeImage from "../../img/badge.png"; // Replace with your badge image
import pointsImage from "../../img/token.png"; // Replace with your points image
import timerImage from "../../img/timer.png"; // Replace with your timer image

function CampaignDetail() {
  const { campaignId } = useParams();
  const { currentUser } = useAuth();
  const [campaign, setCampaign] = useState({});
  const [proofLink, setProofLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmittedProof, setHasSubmittedProof] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      const docRef = doc(db, "campaigns", campaignId);
      const campaignDoc = await getDoc(docRef);
      if (campaignDoc.exists()) {
        const campaignData = campaignDoc.data();
        setCampaign(campaignData);

        // Handle duration based on its type
      let endTime;
      if (campaignData.duration?.toDate) {
        // Firestore Timestamp
        endTime = campaignData.duration.toDate();
      } else if (typeof campaignData.duration === "string" || campaignData.duration instanceof Date) {
        // Already a date string or Date object
        endTime = new Date(campaignData.duration);
      }

      // Set time remaining
      if (endTime) {
        setTimeRemaining(formatDistanceToNowStrict(endTime, { addSuffix: true }));
      }

      }
    };

    const listenForUserSubmission = () => {
      const submissionsQuery = query(
        collection(db, `campaigns/${campaignId}/submissions`),
        where("userId", "==", currentUser.uid),
        limit(1)
      );

      const unsubscribe = onSnapshot(submissionsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const submission = snapshot.docs[0].data();
          setHasSubmittedProof(true);
          setSubmissionStatus(submission.status);
        } else {
          setHasSubmittedProof(false);
          setSubmissionStatus("");
        }
      });

      return unsubscribe;
    };

    fetchCampaign();
    const unsubscribe = listenForUserSubmission();

    return () => unsubscribe(); // Clean up listener
  }, [campaignId, currentUser]);

  // Validate if the proof link is a valid Twitter URL
  const isValidTwitterLink = (link) => {
    const twitterRegex =
      /^(https:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/status\/\d+/;
    return twitterRegex.test(link);
  };

  const submitProof = async () => {
    if (!isValidTwitterLink(proofLink)) {
      setErrorMessage(
        "Please enter a valid Twitter link (e.g., https://twitter.com/username/status/1234567890)"
      );
      return;
    }

    await addDoc(collection(db, `campaigns/${campaignId}/submissions`), {
      userId: currentUser.uid,
      proofLink,
      status: "pending",
      submittedAt: new Date(),
    });

    alert("Proof submitted successfully!");
    setProofLink("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold">{campaign.title}</h1>
      <p className="mt-4 text-gray-300">{campaign.description}</p>
      {campaign.imageUrl && (
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="mt-4 rounded w-full max-w-xl"
        />
      )}

      {/* Reward and Duration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Reward Tile */}
        <div className="p-6 bg-gray-800 rounded-lg flex items-center space-x-4 shadow-lg">
          <img
            src={campaign.rewardType === "points" ? pointsImage : badgeImage}
            alt="Reward Icon"
            className="w-16 h-16"
          />
          <div>
            <p className="text-teal-400 font-bold text-xl">Reward</p>
            <p className="text-gray-300">
              {campaign.rewardType === "points"
                ? `${campaign.rewardValue} Points`
                : `Badge: ${campaign.rewardValue}`}
            </p>
          </div>
        </div>

        {/* Duration Tile */}
        <div className="p-6 bg-gray-800 rounded-lg flex items-center space-x-4 shadow-lg">
          <img src={timerImage} alt="Timer Icon" className="w-16 h-16" />
          <div>
            <p className="text-teal-400 font-bold text-xl">Time Remaining</p>
            <p className="text-gray-300">{timeRemaining}</p>
          </div>
        </div>
      </div>

      {/* Proof Submission Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Submit Proof</h2>

        {hasSubmittedProof ? (
          <p className="mt-4 text-teal-400">
            You have already submitted proof. Status:{" "}
            <strong>{submissionStatus}</strong>
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter tweet link..."
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              className="w-full p-3 mt-2 rounded bg-gray-700"
            />
            {errorMessage && (
              <p className="mt-2 text-red-500">{errorMessage}</p>
            )}
            <button
              onClick={submitProof}
              className="mt-4 px-4 py-2 bg-teal-500 rounded hover:bg-teal-600"
            >
              Submit Proof
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CampaignDetail;
