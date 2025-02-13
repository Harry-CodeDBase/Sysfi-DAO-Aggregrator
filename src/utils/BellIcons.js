import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import './BellIcon.css';

const BellIcon = ({ showBadge, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
  };

  return (
    <div className="bell-icon-container">
      <NavLink to="/notification" onClick={handleClick}>
        <FaBell />
        {showBadge && !isClicked && <span className="badge">New</span>}
      </NavLink>
    </div>
  );
};

export default BellIcon;
