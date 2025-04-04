import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { FaGifts } from "react-icons/fa6";

function ReferralInputComponent() {
  const { address, isConnected } = useAccount();
  const [referralCode, setReferralCode] = useState("");
  const [usedReferralCodes, setUsedReferralCodes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [rewardClaimMessage, setRewardClaimMessage] = useState("");

  useEffect(() => {
    if (address) {
      const userRef = doc(db, "users", address);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          if (data.usedReferralCodes) {
            setUsedReferralCodes(data.usedReferralCodes);
          }
        }
      });
    }
  }, [address]);

  const handleReferralSubmit = async () => {
    if (!referralCode) return;

    try {
      // Query the "users" collection to find the user with this referral code.
      const usersRef = collection(db, "users");
      const referrerQuery = query(
        usersRef,
        where("referralCode", "==", referralCode)
      );
      const querySnapshot = await getDocs(referrerQuery);

      if (querySnapshot.empty) {
        setErrorMessage("Invalid referral code.");
        return;
      }

      // Assuming referral codes are unique, we take the first matched document.
      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data();
      const referrerRef = referrerDoc.ref;

      // Check to prevent self-referral.
      if (referralCode === userData?.referralCode) {
        setErrorMessage("You cannot refer yourself.");
        return;
      }

      // Ensure the code hasn't already been used by the user.
      if (usedReferralCodes.includes(referralCode)) {
        setErrorMessage("You have already used this referral code.");
        return;
      }

      // Update the current user's document: add the referral code and mark refStatus as true.
      const userRef = doc(db, "users", address);
      await updateDoc(userRef, {
        usedReferralCodes: arrayUnion(referralCode),
        refStatus: true,
      });

      // Increment the referral count for the referrer.
      await updateDoc(referrerRef, {
        referralCount: (referrerData.referralCount || 0) + 1,
      });

      // Update local state.
      setUsedReferralCodes((prev) => [...prev, referralCode]);
      setErrorMessage("");
      setReferralCode("");
    } catch (error) {
      console.error("Error handling referral:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // New function to handle reward claim action.
  const handleClaimReward = () => {
    setRewardClaimMessage(
      "Referral rewards are claimable at the end of the testing season"
    );
  };

  // Calculate referral bonus: referralCount multiplied by 500 pts.
  const referralBonus = (userData?.referralCount || 0) * 500;

  return (
    <div className="p-6 bg-black text-white rounded-lg">
      <h3 className="text-lg font-bold">Who connected you to SYSFI?</h3>
      {/* Render input only if the user hasn't verified a referral yet */}
      {!userData?.refStatus && (
        <>
          <input
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full p-2 mt-2 rounded bg-gray-950 border border-gray-600"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          <button
            className="mt-4 bg-teal-500 w-full text-black font-bold py-2 px-4 rounded hover:bg-teal-400"
            onClick={handleReferralSubmit}
          >
            Submit Referral Code
          </button>
        </>
      )}
      {usedReferralCodes.length > 0 && (
        <p className="text-green-500 font-semibold mt-4">
          You have used referral codes: {usedReferralCodes.join(", ")}
        </p>
      )}

      <div className="mt-6 border-t border-gray-600 pt-4">
        <h4 className="text-md font-bold text-center">
          {" "}
          <i> Referral Bonus </i>
        </h4>
        <p className="mt-2 text-2xl text-center ">
          {" "}
          {referralBonus} SYN pts
        </p>
        <button
          className="mt-4 bg-teal-500 w-full text-black font-bold py-2 px-4 rounded hover:bg-teal-600"
          onClick={handleClaimReward}
        >
          Claim Reward
        </button>
        {rewardClaimMessage && (
          <p className="mt-2 text-teal-300">{rewardClaimMessage}</p>
        )}
      </div>
    </div>
  );
}

export default ReferralInputComponent;
