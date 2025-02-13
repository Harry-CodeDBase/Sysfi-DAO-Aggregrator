import React from "react";
import "./Floatingimage.css";
import image from "../../img/ethg.png";

const FloatingImage = ({ src, alt }) => {
  return (
    <div className="floating-image-container">
      <img
        src={image}
        alt={alt}
        className="floating-image"
      />
    </div>
  );
};

export default FloatingImage;
