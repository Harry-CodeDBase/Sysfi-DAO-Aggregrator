import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useDAO from "../../hooks/useSYNDAO";

function DAOApp() {
  const {
    daoStats,
    createNewProposal,
    voteOnProposal,
    finalizeProposal,
    delegateTokens,
    undelegateTokens,
  } = useDAO();

  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalRecipient, setProposalRecipient] = useState("");
  const [proposalType, setProposalType] = useState(0); // Assuming 0 for default proposal type

  const handleProposalCreation = () => {
    createNewProposal(
      proposalTitle,
      proposalDescription,
      proposalAmount,
      proposalRecipient,
      proposalType
    );
  };

  return (
    <div>
      <ConnectButton />

      <h2>DAO Stats</h2>
      <p>Cooling Period: {daoStats.coolingPeriod}</p>
      <p>Voting Period (days): {daoStats.votingPeriod}</p>
      <p>Voting Delay: {daoStats.votingDelay}</p>

      <h3>Create Proposal</h3>
      <input
        type="text"
        placeholder="Title"
        value={proposalTitle}
        onChange={(e) => setProposalTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={proposalDescription}
        onChange={(e) => setProposalDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={proposalAmount}
        onChange={(e) => setProposalAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={proposalRecipient}
        onChange={(e) => setProposalRecipient(e.target.value)}
      />
      <button onClick={handleProposalCreation}>Create Proposal</button>

      <h3>Actions</h3>
      <button onClick={() => voteOnProposal(1, true)}>Upvote Proposal 1</button>
      <button onClick={() => voteOnProposal(1, false)}>
        Downvote Proposal 1
      </button>
      <button onClick={() => finalizeProposal(1)}>Finalize Proposal 1</button>
      <button onClick={() => delegateTokens("0xDelegateeAddress")}>
        Delegate Tokens
      </button>
      <button onClick={undelegateTokens}>Undelegate Tokens</button>
    </div>
  );
}

export default DAOApp;
