import React, { useState, useEffect } from "react";
import { useContractRead, useAccount, useContractReads } from "wagmi";
import { CreateCrowdsaleConfig } from "../../hooks/Contract";
import Loader from "../../utils/Loader";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi"; // Import edit icon
import { db, storage } from "../../utils/Firebase"; // Firestore and storage
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CrowdsaleEditCard from "../../components/ui/CrowdSaleEditCard";

export default function UserCrowdsales() {
  const [filteredCrowdsales, setFilteredCrowdsales] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrowdsale, setEditingCrowdsale] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();
  const { address: connectedAddress } = useAccount();

  // Fetch all crowdsale addresses
  const {
    data: crowdsales,
    isLoading,
    error,
  } = useContractRead({
    address: CreateCrowdsaleConfig.address,
    abi: CreateCrowdsaleConfig.abi,
    functionName: "getCrowdsales",
  });

  // Fetch crowdsale creators
  const { data: crowdsaleCreators } = useContractReads({
    contracts:
      crowdsales?.map((crowdsale) => ({
        address: CreateCrowdsaleConfig.address,
        abi: CreateCrowdsaleConfig.abi,
        functionName: "crowdsaleCreators",
        args: [crowdsale],
      })) || [],
  });

  useEffect(() => {
    if (!crowdsales || !crowdsaleCreators || !connectedAddress) return;
    const filtered = crowdsales.filter((crowdsale, index) => {
      return crowdsaleCreators[index]?.result === connectedAddress;
    });
    setFilteredCrowdsales(filtered);
  }, [crowdsales, crowdsaleCreators, connectedAddress]);

  const openModal = async (crowdsaleAddress) => {
    setEditingCrowdsale(crowdsaleAddress);
    setModalOpen(true);

    // Fetch saved data from Firestore
    const docRef = doc(db, "crowdsales", crowdsaleAddress);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setTitle(data.title || "");
      setDescription(data.description || "");
      setLinks(data.links || []);
      setImageUrl(data.imageUrl || "");
    } else {
      setTitle("");
      setDescription("");
      setLinks([]);
      setImageUrl("");
    }
  };

  const handleSave = async () => {
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      const storageRef = ref(storage, `crowdsale_banners/${editingCrowdsale}`);
      await uploadBytes(storageRef, imageFile);
      uploadedImageUrl = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, "crowdsales", editingCrowdsale), {
      title,
      description,
      links,
      imageUrl: uploadedImageUrl,
    });

    setModalOpen(false);
  };

  const addLink = () => {
    if (linkType && linkUrl) {
      setLinks([...links, { type: linkType, url: linkUrl }]);
      setLinkType("");
      setLinkUrl("");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      {/* Display Crowdsale Addresses */}
      <div className="w-full flex flex-wrap justify-start items-start gap-4 mt-8">
        {filteredCrowdsales.length === 0 ? (
          <p className="text-gray-400">No crowdsales available.</p>
        ) : (
          filteredCrowdsales.map((addr, idx) => (
            <div
              key={idx}
              className="bg-black/70 w-[100%] text-white p-1 rounded-lg flex items-start justify-between transition-all"
            >
              <CrowdsaleEditCard contractAddress={addr} />
              <FiEdit
                className="text-red-300 ml-4 z-50 cursor-pointer hover:text-teal-500 button absolute"
                onClick={() => openModal(addr)}
              />
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-black p-6 rounded-lg border border-teal-500 max-w-lg w-full overflow-y-auto">
            <h3 className="text-xl font-semibold text-teal-300 mb-4">
              Edit Crowdsale Details
            </h3>
            <div>
              <label className="block text-teal-300 mb-1">
                Upload Banner Image <i>(640x360 recommended)</i>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-2 bg-black/50 border border-teal-500 rounded text-white"
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full max-h-[200px] object-contain mt-2 rounded"
                />
              )}
              {imageUrl && !imageFile && (
                <img
                  src={imageUrl}
                  alt="Stored Image"
                  className="w-full max-h-[200px] object-cover mt-2 rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-black/50 border border-teal-500 rounded text-white"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">
                Description (max 200 characters)
              </label>
              <textarea
                value={description}
                maxLength={200}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-black/50 border border-teal-500 rounded text-white"
                rows={3}
                placeholder="Enter description..."
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Links</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Twitter"
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value)}
                  className="w-1/2 p-2 bg-black/50 border border-teal-500 rounded text-white"
                />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-1/2 p-2 bg-black/50 border border-teal-500 rounded text-white"
                />
              </div>
              <button
                onClick={addLink}
                className="mt-2 bg-teal-300 px-3 py-1 rounded"
              >
                Add Link
              </button>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 bg-teal-500 px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
