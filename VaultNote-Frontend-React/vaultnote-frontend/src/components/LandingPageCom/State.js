import React from "react";
import CardSlider from "./CardSlider";

const State = () => {
  return (
    <div className="py-28">
      <div className="bg-gray-800 bg-opacity-80 rounded-md py-8 px-8 mx-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <span className="sm:text-4xl text-3xl text-white font-bold">
              256-bit
            </span>
            <span className="text-gray-300 text-center sm:text-sm text-xs">
              Encryption
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <span className="sm:text-4xl text-3xl text-white font-bold">
              100K+
            </span>
            <span className="text-gray-300 text-center sm:text-sm text-xs">
              Trusted Users
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <span className="sm:text-4xl text-3xl text-white font-bold">
              Instant
            </span>
            <span className="text-gray-300 text-center sm:text-sm text-xs">
              Note Access
            </span>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-white text-2xl font-semibold pb-5 pt-6">
            Vault Note by the Numbers
          </h3>
          <div className="flex md:flex-row flex-col md:gap-0 gap-16 justify-between">
            <ul className="list-disc pl-10 text-gray-300 flex flex-col gap-5 flex-1">
              <li>Military-grade encryption protecting every note.</li>
              <li>Trusted by over 100,000 users worldwide.</li>
              <li>Real-time synchronization across all your devices.</li>
              <li>No data breaches—ever.</li>
              <li>99.99% uptime for constant availability.</li>
              <li>Lightning-fast search and note retrieval.</li>
              <li>Regular security audits for utmost safety.</li>
            </ul>
            <div className="flex-1">
              <CardSlider />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default State;
