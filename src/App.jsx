import React, { useEffect } from "react";
import "./App.css";
import SignIn from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/Context";
import Loader from "./utils/Loader";
import Sidebar from "./components/header/Sidebar";
import TweetSubmissionComponent from "./pages/TweetSubmission";
import CampaignIndex from "./pages/campaign/Index";
import CampaignDetail from "./pages/campaign/CampaignDetails";
import CampaignCreation from "./pages/campaign/CreateCampaign"; // Admin-only route
import AdminCampaignVerification from "./pages/campaign/AdminCampaignVerification"; // Admin-only route
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

const ALCHEMY_API_KEY = "SvIcMuv58RZnjEr4p5bXrN2_fnMa0rWc";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "b95028c13ca98a427d648e057629da40", //"c83e27a5b8fb63c08218f51b97103b95",
  chains: [polygon, polygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
  autoConnect: true, // autoconnect
  // transports: {
  //   [polygon.id]: http(
  //     `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  //   ),
  //   [polygonAmoy.id]: http(
  //     `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  //   ),
  // },
});

const queryClient = new QueryClient();

const ADMIN_EMAIL = "harryfrancis037@gmail.com"; // Define admin email

// AdminRoute Wrapper
function AdminRoute({ element }) {
  const { currentUser } = useAuth();

  if (currentUser?.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return element;
}

// Component for handling unauthenticated routes
function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="*" element={<Register />} />
    </Routes>
  );
}

// Component for handling authenticated routes
function AuthenticatedRoutes() {
  return (
    <div className="bg-gray-900 pb-10">
      {/* <div className="bg-gradient-to-br from-purple-800 via-teal-500 to-indigo-800"></div> */}
      <Header />
      <Sidebar />
      <div className="w-full min-h-[80vh] scroll-auto lg:w-[81%] m-auto lg:ml-[19%]">
        <Routes>
          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaign" element={<CampaignIndex />} />
          <Route path="/campaign/:campaignId" element={<CampaignDetail />} />
          <Route exact path="/" element={<StakingComponent />} />
          <Route path="/factory/DAO" element={<DAOFactoryComponent />} />
          <Route path="/dao" element={<DAO />} />
          <Route path="/memepad" element={<Index/>} />
          

          {/* Admin-Only Routes */}
          <Route
            path="/admin/campaign/create"
            element={<AdminRoute element={<CampaignCreation />} />}
          />
          <Route
            path="/admin/campaign/verify"
            element={<AdminRoute element={<AdminCampaignVerification />} />}
          />

          <Route path="*" element={<TweetSubmissionComponent />} />
        </Routes>
        <BottomNav />
      </div>
    </div>
  );
}

function AppRouter() {
  const { currentUser, loading } = useAuth(); // Access current user and loading state
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    if (!isConnected) {
      connect(); // 🔥 Automatically reconnect the wallet
    }
  }, [isConnected, connect]);

  if (loading) {
    return <Loader />; // Show loader while checking auth state
  }

  return isConnected ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
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
          <AuthProvider>
            <HashRouter>
              <AppRouter />
            </HashRouter>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
