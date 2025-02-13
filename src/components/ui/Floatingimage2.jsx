import React from "react";
import "./Floatingimage2.css";
import image from "../../img/wallet.png";

const FloatingImage2 = ({ src, alt }) => {
  return (
    <div className="floating-image-container2">
      <img src={image} alt={alt} className="floating-image2" />
    </div>
  );
};

export default FloatingImage2;
