import React from "react";
import { Link } from "react-router-dom";
import launch from "../img/launch.png";
import crowdsale from "../img/crowdsale.png";
import dac from "../img/dac.png";

const tiles = [
  { name: "MemeCoins", image: launch, path: "/factory/memecoins" },
  { name: "Sub DAO/DAC", image: dac, path: "/factory/subdao" },
  { name: "Crowdsale", image: crowdsale, path: "/factory/crowdsale" },
];

export default function Factory() {
  return (
    <div className="min-h-[70vh] lg:min-h-[80vh] flex flex-col items-center justify-center bg-black bg-opacity-15 backdrop-blur-lg text-white p-6">
      <h1 className="text-3xl font-bold text-teal-300 mb-6">
        What will you create today?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {tiles.map((tile, index) => (
          <Link
            key={index}
            to={tile.path}
            className="bg-gray-800/50 backdrop-blur-md shadow-lg hover:shadow-2xl transition duration-300 rounded-lg p-4 flex flex-col items-center w-full"
          >
            <img
              src={tile.image}
              alt={tile.name}
              className="w-24 h-24 object-cover rounded-lg mb-4"
            />
            <p className="text-lg font-semibold text-teal-300">{tile.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
