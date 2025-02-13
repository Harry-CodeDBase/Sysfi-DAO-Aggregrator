import { useState } from "react";
import MemeTokenDashboard from "./CreateToken";
import CrowdsaleCreator from "./CreateCrowdSale";

const tabs = [
  { name: "Launcpad", component: CreateCrowdSale },
  { name: "memecoin Factory", component: CreatedToken },
];

function CreatedToken() {
  return (
    <div className="p-4">
      <MemeTokenDashboard />
    </div>
  );
}

function CreateCrowdSale() {
  return (
    <div className="p-4">
      <CrowdsaleCreator />
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-950 p-4 rounded-lg shadow-md">
      <div className="flex border-b border-teal-500">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 p-2 text-white border-b-2 transition-all duration-300 ${
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
