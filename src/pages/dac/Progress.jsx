import { formatUnits } from "viem";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const formatVoteCount = (voteCount) => {
  const formatted = Number(formatUnits(voteCount, 18)); // Convert from 18 decimals
  if (formatted >= 1_000_000) return (formatted / 1_000_000).toFixed(3) + "M";
  if (formatted >= 1_000) return (formatted / 1_000).toFixed(3) + "K";
  return formatted.toFixed(3);
};

const Progressbar = ({ proposal }) => {
  const formattedUpVote = Number(formatUnits(proposal.upVotes, 18));
  const formattedDownVote = Number(formatUnits(proposal.downVotes, 18));
  const totalVotes = formattedUpVote + formattedDownVote;
  const progress = totalVotes > 0 ? (formattedUpVote / totalVotes) * 100 : 0;

  return (
    <div className="mt-4">
      {/* Vote Buttons */}
    

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-xl h-5">
        <div
          className="h-5 rounded-xl"
          style={{
            width: `${progress}%`,
            backgroundColor: "#D0F0C0", // Tea Green
            borderRadius:'20px',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Progressbar;
