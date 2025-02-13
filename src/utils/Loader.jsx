// src/components/Loader.js

import React from "react";
import "./Loader.css"; // Import the CSS for the loader
import logo from "../img/loader.png"; // Import your logo image

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={logo} alt="Loading..." className="loader-logo" />
    </div>
  );
};

export default Loader;
