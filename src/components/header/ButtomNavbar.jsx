import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Network, Coins, Rocket, Settings, Factory } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide navbar when scrolling down
      } else {
        setIsVisible(true); // Show navbar when scrolling up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "DACs", icon: <Network size={20} />, path: "/" },
    { name: "Stake", icon: <Coins size={20} />, path: "/stake" },
    { name: "Memepad", icon: <Rocket size={20} />, path: "/launchpad" },
    { name: "Factory", icon: <Factory size={20} />, path: "/factory" },
  ];

  return (
    <div
      className={`fixed lg:hidden left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl shadow-lg p-1 flex items-center justify-around w-[95%] rounded-3xl bottom-1 max-w-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-20 opacity-0"
      }`}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl transition-all ${
              isActive
                ? "bg-teal-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
