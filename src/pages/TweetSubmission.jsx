import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../utils/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { useAuth } from "../hooks/Context";

function TweetSubmissionComponent() {
  const { currentUser } = useAuth();
  const [tweetLink, setTweetLink] = useState("");
  const [pendingTweets, setPendingTweets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState("new");
  const [showModal, setShowModal] = useState(false);

  const adminEmail = "harryfrancis037@gmail.com";

  useEffect(() => {
    setIsAdmin(currentUser?.email === adminEmail);
    if (isAdmin) fetchPendingTweets();
  }, [currentUser, isAdmin]);

  // Submit tweet
  const handleTweetSubmission = async () => {
    if (!tweetLink || !tweetLink.includes("twitter.com")) {
      alert("Invalid tweet link. Please enter a valid Twitter link.");
      return;
    }

    try {
      await addDoc(collection(db, "tweets"), {
        tweetLink,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: "pending",
        createdAt: new Date(),
      });

      setTweetLink("");
    } catch (error) {
      console.error("Error submitting tweet: ", error);
    }
  };

  // Fetch pending tweets for admin
  const fetchPendingTweets = async () => {
    try {
      const q = query(
        collection(db, "tweets"),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const tweets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingTweets(tweets);
    } catch (error) {
      console.error("Error fetching pending tweets: ", error);
    }
  };

  // Handle opening modal for verification
  const openVerificationModal = (tweet) => {
    setSelectedTweet(tweet);
    setShowModal(true);
  };

  // Handle verifying the tweet
  const handleVerifyTweet = async () => {
    if (!selectedTweet) return;

    try {
      // Move tweet to user's sub-collection
      await setDoc(
        doc(db, `users/${selectedTweet.userId}/tweets`, selectedTweet.id),
        {
          tweetLink: selectedTweet.tweetLink,
          status: "verified",
          createdAt: new Date(),
        }
      );

      // Delete tweet from the "tweets" collection
      await deleteDoc(doc(db, "tweets", selectedTweet.id));

      // Update user's points and badge
      const userRef = doc(db, "users", selectedTweet.userId);
      await updateDoc(userRef, {
        pointBalance: increment(100),
        badge: selectedBadge,
      });

      alert("Tweet verified successfully!");
      setShowModal(false);
      fetchPendingTweets(); // Refresh pending tweets
    } catch (error) {
      console.error("Error verifying tweet: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Tweet Submission and Verification
      </h1>

      {/* Tweet Submission Form */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 bg-gray-800/70 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Submit a Tweet</h2>
        <input
          type="text"
          value={tweetLink}
          onChange={(e) => setTweetLink(e.target.value)}
          placeholder="Enter tweet link..."
          className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
        />
        <button
          onClick={handleTweetSubmission}
          className="px-4 py-2 bg-teal-500 rounded hover:bg-teal-600"
        >
          Submit Tweet
        </button>
      </motion.div>

      {/* Admin Panel */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-10 p-6 bg-gray-800/70 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">
            Pending Tweets for Verification
          </h2>
          <div className="space-y-4">
            {pendingTweets.map((tweet) => (
              <div key={tweet.id} className="p-4 bg-gray-700 rounded-lg">
                <p>
                  <strong>Tweet Link: </strong>
                  <a
                    href={tweet.tweetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 underline"
                  >
                    View Tweet
                  </a>
                </p>
                <p>
                  <strong>User ID: </strong>
                  {tweet.userId}
                </p>
                <p>
                  <strong>Status: </strong>
                  {tweet.status}
                </p>
                <button
                  onClick={() => openVerificationModal(tweet)}
                  className="mt-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                >
                  Verify Tweet
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal for verification */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Verify Tweet</h2>
            <p>
              <strong>Tweet Link: </strong>
              <a
                href={selectedTweet.tweetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 underline"
              >
                View Tweet
              </a>
            </p>
            <p>
              <strong>User ID: </strong>
              {selectedTweet.userId}
            </p>
            <p className="mt-3">
              <strong>Select Badge:</strong>
            </p>
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              className="w-full mt-2 p-2 bg-gray-700 rounded"
            >
              <option value="new">New</option>
              <option value="amateur">Amateur</option>
              <option value="elite">Elite</option>
              <option value="master">Master</option>
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleVerifyTweet}
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 mr-2"
              >
                Verify
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TweetSubmissionComponent;
