import React from "react";

export const Button = ({ children, className, ...props }) => (
  <button
    className={`w-full bg-teal-400 hover:bg-purple-600 text-black p-2 rounded ${className}`}
    {...props}
  >
    {children}
  </button>
);
