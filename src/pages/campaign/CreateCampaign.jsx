import React, { useState } from "react";
import { db, storage } from "../../utils/Firebase"; // Assuming Firebase setup is done
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../hooks/Context";

function CampaignCreation() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.email === "harryfrancis037@gmail.com";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardType, setRewardType] = useState("points");
  const [rewardValue, setRewardValue] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCampaignCreation = async () => {
    if (!title || !description || !rewardValue || !duration) {
      alert("Please fill in all fields.");
      return;
    }

    const durationDate = new Date(duration);
    if (durationDate <= new Date()) {
      alert("Campaign duration must be a future date.");
      return;
    }

    setIsUploading(true);
    let imageUrl = "";

    // Upload image if provided
    if (image) {
      const storageRef = ref(storage, `campaigns/${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Determine status based on duration and store campaign in Firestore
    await addDoc(collection(db, "campaigns"), {
      title,
      description,
      rewardType,
      rewardValue:
        rewardType === "points" ? parseInt(rewardValue) : rewardValue, // Handle points or badge
      duration: Timestamp.fromDate(durationDate), // Store as Firestore timestamp
      imageUrl,
      status: "active", // Set initially to active, can be changed to "ended" later when checked
    });

    alert("Campaign created successfully!");
    setIsUploading(false);

    // Reset form
    setTitle("");
    setDescription("");
    setRewardType("points");
    setRewardValue("");
    setDuration("");
    setImage(null);
  };

  if (!isAdmin) {
    return <p>You do not have permission to create campaigns.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Campaign Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
        />
        <textarea
          placeholder="Campaign Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
          rows={4}
        />
        <div className="space-y-2">
          <label className="block">Reward Type</label>
          <select
            value={rewardType}
            onChange={(e) => {
              setRewardType(e.target.value);
              setRewardValue(""); // Reset reward value when changing type
            }}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="points">Points</option>
            <option value="badge">Badge</option>
          </select>
        </div>
        {rewardType === "points" ? (
          <input
            type="number"
            placeholder="Reward Value (e.g., 100 points)"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
          />
        ) : (
          <input
            type="text"
            placeholder="Badge Name (e.g., campaign_star)"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
          />
        )}
        <input
          type="date"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-3"
        />
        <button
          onClick={handleCampaignCreation}
          disabled={isUploading}
          className="px-6 py-2 bg-teal-500 rounded hover:bg-teal-600"
        >
          {isUploading ? "Creating Campaign..." : "Create Campaign"}
        </button>
      </div>
    </div>
  );
}

export default CampaignCreation;
