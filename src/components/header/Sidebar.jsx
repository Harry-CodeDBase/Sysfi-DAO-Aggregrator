import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCoins,
  FaExchangeAlt,
  FaWallet,
  FaHandHoldingUsd,
  FaVoteYea,
  FaChevronDown,
  FaChevronUp,
  FaUserShield,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/Context";
import { FaRocket } from "react-icons/fa6";

const ADMIN_EMAIL = "harryfrancis037@gmail.com";

export default function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});
  const [scrollTop, setScrollTop] = useState(150);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollTop(0); // Move to top when scrolling further down
      } else if (window.scrollY > 10) {
        setScrollTop(100); // Intermediate state
      } else {
        setScrollTop(180); // Reset when scrolling up
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (menu) => {
    setSubmenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/" },
    {
      name: "memepad",
      icon: <FaRocket />,
      path: "/memepad",
    },
    {
      name: "Pools",
      icon: <FaCoins />,
      path: "/pool",
    },

    {
      name: "Staking",
      icon: <FaHandHoldingUsd />,
      path: "/",
    },
    {
      name: "Governance",
      icon: <FaVoteYea />,
      submenu: [
        { name: "DAO", path: "/dao" },
        { name: "Proposals", path: "/governance/proposals" },
        { name: "Vote", path: "/governance/vote" },
      ],
    },

    {
      name: "Factory",
      icon: <FaVoteYea />,
      submenu: [
        { name: "Create DAO", path: "/factory/dao" },
        { name: "Vote", path: "/governance/vote" },
      ],
    },
    { name: "Wallet", icon: <FaWallet />, path: "/wallet" },
  ];

  const adminMenuItems = [
    {
      name: "Admin Panel",
      icon: <FaUserShield />,
      submenu: [
        { name: "Manage Users", path: "/admin/users" },
        { name: "Review Transactions", path: "/admin/reviews" },
      ],
    },
  ];

  return (
    <div className="hidden lg:flex relative z-20 ">
      <div
        className={`fixed left-0 h-full bg-black/80 border-r-2 border-teal-400 text-white shadow-lg transition-all duration-300 transform z-40 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block`}
        style={{ top: `${scrollTop}px` }}
      >
        <div className="p-5">
          <ul className="space-y-3 pt-10">
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
            {currentUser?.email === ADMIN_EMAIL &&
              adminMenuItems.map((item, index) => (
                <SidebarMenuItem
                  key={`admin-${index}`}
                  item={item}
                  location={location}
                  toggleSidebar={toggleSidebar}
                  submenuOpen={submenuOpen}
                  toggleSubmenu={toggleSubmenu}
                />
              ))}
          </ul>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
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
        className={`flex items-center justify-between w-full py-2 px-4 rounded transition-colors group ${
          submenuOpen[item.name] ? "bg-gray-700" : "hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{item.icon}</span>
          <span className="group-hover:text-teal-400">{item.name}</span>
        </div>
        <span>
          {submenuOpen[item.name] ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <ul
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          submenuOpen[item.name]
            ? "max-h-[300px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {item.submenu.map((subitem, index) => (
          <li key={index}>
            <Link
              to={subitem.path}
              onClick={toggleSidebar}
              className={`block py-2 px-4 rounded transition-colors text-left ${
                location.pathname === subitem.path
                  ? "bg-teal-600"
                  : "hover:bg-gray-700"
              }`}
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
      className={`flex items-center space-x-3 py-2 px-4 rounded transition-colors group ${
        isActive ? "bg-teal-600" : "hover:bg-gray-700"
      }`}
    >
      <span className="text-xl">{item.icon}</span>
      <span className="group-hover:text-teal-400">{item.name}</span>
    </Link>
  );
}
