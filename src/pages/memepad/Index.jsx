import { useState } from "react";
import MemeTokenDashboard from "./CreateToken";
import CrowdsaleCreator from "./CreateCrowdSale";
import CrowdsalesList from "../../hooks/useCrowdsaleList";
import image from "../../img/bg2.jpg";

export default function Index() {
  return (
    <div className="flex justify-center items-start min-h-70vh p-2">
      <div className="w-full flex justify-center">
        <CrowdsalesList />
      </div>
    </div>
  );
}
