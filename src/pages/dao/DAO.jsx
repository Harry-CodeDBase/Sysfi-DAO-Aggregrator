import { useState } from "react";
import { VotingInfo } from "./VotingInfo";
import { CreateProposalForm } from "./CreateProposal";
import DAOApp from "./DAOApp";
import ProposalsList from "./ProposalList";
import HistoryList from "./History";

const tabs = [
  { name: "Proposal", component: Proposal },
  { name: "Create Proposal", component: CreateProposal },
  { name: "History", component: History },
  { name: "Delegate", component: Delegate },
];

function Proposal() {
  return (
    <div className="p-4">
      <ProposalsList />
    </div>
  );
}

function CreateProposal() {
  return (
    <div className="p-4">
      <CreateProposalForm />
    </div>
  );
}

function History() {
  return <div className="p-4"><HistoryList/></div>;
}

function Delegate() {
  return <div className="p-4">Delegate function coming soon</div>;
}

export default function DAO() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="w-full  mx-auto  p-2 rounded-lg shadow-md">
      <VotingInfo />

      <br />
      <div className="flex border-b border-teal-500 ">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 p-2 text-white border-b-2 bg-black transition-all duration-300 ${
              activeTab === tab.name
                ? "border-teal-500 font-semibold"
                : "border-transparent"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="mt-4 text-white">
        {tabs.find((tab) => tab.name === activeTab)?.component()}
      </div>
    </div>
  );
}
