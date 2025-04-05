import React, { useEffect } from "react";
import "./App.css";
import SignIn from "./auth/Login";
import Register from "./auth/Register";

import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

import Loader from "./utils/Loader";
import Sidebar from "./components/header/Sidebar";
import Header from "./components/header/Header";
import BottomNav from "./components/header/ButtomNavbar";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import { useAccount, useConnect, WagmiProvider, http } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  polygonAmoy,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import StakingComponent from "./pages/staking/StakingComponent";
import DAOFactoryComponent from "./pages/dao/DAOFactory";
import DAO from "./pages/dao/DAO";
import LaunchTokenForm from "./pages/memepad/CreateToken";
import Index from "./pages/memepad/Index";
import Factory from "./pages/FactoryGrid";
import MemeTokenDashboard from "./pages/memepad/CreateToken";
import CrowdsaleCreator from "./pages/memepad/CreateCrowdSale";
import ScrollToTop from "./utils/ScrollToTop";
import AirdropComponent from "./pages/airdrop";
import DAODetails from "./pages/dac/DAODetails";
import DAC from "./pages/dac/Index";
import CrowdsaleCard from "./components/ui/CrowdSaleCrad1";

const ALCHEMY_API_KEY = "";

const config = getDefaultConfig({
  appName: "sysfi DAO",
  projectId: "",
  chains: [polygon, polygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
  autoConnect: true, // autoconnect
  transports: {
  
  },
});

const queryClient = new QueryClient();

// Component for handling unauthenticated routes
function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="*" element={<Register />} />
    </Routes>
  );
}

// Component for handling authenticated routes
function AuthenticatedRoutes() {
  return (
    // <div className="bg-gray-900 pb-10">
    <div>
      <ScrollToTop />
      <Sidebar />
      <div className="w-full min-h-[80vh] scroll-auto lg:w-[81%] m-auto lg:ml-[19%] mb-5">
        <Header />
        <Routes>
          {/* User Routes */}
          <Route path="/stake" element={<StakingComponent />} />
          <Route path="/factory" element={<Factory />} />
          <Route path="/factory/subdao" element={<DAOFactoryComponent />} />
          <Route path="/factory/memecoins" element={<MemeTokenDashboard />} />
          <Route path="/factory/crowdsale" element={<CrowdsaleCreator />} />
          <Route path="/launchpad" element={<Index />} />
          <Route
            path="/launchpad/:contractAddress"
            element={<CrowdsaleCard />}
          />
          <Route path="/dao/:daoAddress" element={<DAODetails />} />{" "}
          <Route exact path="/" element={<DAC />} /> {/* Admin-Only Routes */}
          <Route path="*" element={<DAC />} />
        </Routes>
        <BottomNav />
      </div>
    </div>
  );
}

function AppRouter() {
  const { isConnected } = useAccount();

  return !isConnected ? <UnauthenticatedRoutes /> : <AuthenticatedRoutes />;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={midnightTheme({
            accentColor: "#9FE2BF",
            accentColorForeground: "black",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <HashRouter>
            <AppRouter />
          </HashRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
