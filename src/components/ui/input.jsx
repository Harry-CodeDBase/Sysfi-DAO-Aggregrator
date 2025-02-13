import React from "react";

export const Input = ({ className, ...props }) => (
  <input
    className={`w-full p-2 rounded border border-gray-600 bg-black text-white ${className}`}
    {...props}
  />
);
