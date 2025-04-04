import React, { useState } from "react";
import DacHistory from "./History";
import ProposalsList from "./ProposalList";

function Proposal({ daoDetails, daoAddress }) {
  return (
    <div className="">
      <ProposalsList daoAddress={daoAddress} daoDetails={daoDetails} />
    </div>
  );
}

function History({ daoAddress }) {
  return (
    <div className="">
      <DacHistory daoAddress={daoAddress} />
    </div>
  );
}

// Define the tabs AFTER the components are declared
const tabs = [
  { name: "Proposal", component: Proposal },
  { name: "History", component: History },
  // { name: "Delegate", component: Delegate },
];

export default function DAO({ daoDetails, daoAddress }) {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="w-full p-1 rounded-lg shadow-md">
      <div className="flex border-b border-teal-500">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 text-white border-b-2 bg-black transition-all duration-300 ${
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
        {React.createElement(
          tabs.find((tab) => tab.name === activeTab)?.component,
          { daoAddress, daoDetails }
        )}
      </div>
    </div>
  );
}
