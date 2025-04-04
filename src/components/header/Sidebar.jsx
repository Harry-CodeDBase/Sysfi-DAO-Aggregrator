import React, { useState, useEffect } from "react";
import {
  Home,
  Coins,
  Rocket,
  HandCoins,
  Vote,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubmenu = (menu) => {
    setSubmenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { name: "DAC/DAOs", icon: <HandCoins size={20} />, path: "/" },
    { name: "Staking", icon: <Coins size={20} />, path: "/stake" },
    { name: "Memepad", icon: <Rocket size={20} />, path: "/launchpad" },
    { name: "Factory", icon: <Settings size={20} />, path: "/factory" },
  ];

  return (
    <div className="hidden lg:flex fixed left-0 h-full z-50">
      <div
        className={`relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl transition-all duration-300 transform p-4 w-64 rounded-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block`}
      >
        <ul className="space-y-3 pt-6">
          {menuItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              location={location}
              toggleSidebar={toggleSidebar}
              submenuOpen={submenuOpen}
              toggleSubmenu={toggleSubmenu}
            />
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

function SidebarMenuItem({
  item,
  location,
  toggleSidebar,
  submenuOpen,
  toggleSubmenu,
}) {
  const isActive = location.pathname === item.path;

  return item.submenu ? (
    <div>
      <button
        onClick={() => toggleSubmenu(item.name)}
        className={`flex items-center justify-between w-full py-2 px-4 rounded-lg transition-all bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white ${
          submenuOpen[item.name] ? "bg-white/30" : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          {item.icon}
          <span>{item.name}</span>
        </div>
        {submenuOpen[item.name] ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>
      <ul
        className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-300 ${
          submenuOpen[item.name] ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {item.submenu.map((subitem, index) => (
          <li key={index}>
            <Link
              to={subitem.path}
              onClick={toggleSidebar}
              className="block py-2 px-4 rounded-lg hover:bg-white/20 backdrop-blur-md"
            >
              {subitem.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <Link
      to={item.path}
      onClick={toggleSidebar}
      className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-all bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white ${
        isActive ? "bg-teal-500" : ""
      }`}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
}
