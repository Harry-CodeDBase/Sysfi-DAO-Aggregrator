import React from "react";

export const Card = ({ children, className }) => (
  <div
    className={`rounded-xl shadow-lg p-6 bg-gradient-to-br from-gray-800 via-teal-400 to-black ${className}`}
  >
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);
