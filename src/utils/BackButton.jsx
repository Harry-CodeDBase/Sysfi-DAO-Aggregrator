import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute bottom-[70px] left-4 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-gray-700 transition button"
    >
      <ArrowLeft size={20} />
      Back
    </button>
  );
};

export default BackButton;
