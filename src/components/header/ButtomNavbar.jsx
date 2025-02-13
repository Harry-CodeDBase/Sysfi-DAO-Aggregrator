import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCoins, FaRocket, FaWater, FaCogs } from "react-icons/fa";

const BottomNav = () => {
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { name: "Stake", icon: <FaCoins size={20} />, path: "/" },
    { name: "memepad", icon: <FaRocket size={20} />, path: "/memepad" },
    { name: "Pool", icon: <FaWater size={20} />, path: "/pool" },
    { name: "Factory", icon: <FaCogs size={20} />, path: "/factory/dao" },
    { name: "DAO", icon: <FaCogs size={20} />, path: "/dao" },
  ];

  return (
    <div className="fixed lg:hidden bottom-0 left-1/2 -translate-x-1/2 bg-black/90 border-2 border-black backdrop-blur-lg shadow-lg p-2 flex items-center justify-around w-[100%] max-w-md">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
            active === item.path
              ? "bg-teal-500 text-black "
              : "text-teal-700 hover:text-white"
          }`}
        >
          {item.icon}
          <span className="text-sm">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
