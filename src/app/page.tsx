"use client";

import Link from "next/link";
import React from "react";

// ✅ Homepage Component
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6">Welcome to Music Player 🎵</h1>

      {/* Navigation Link to /music */}
      <Link
        href="/music"
        className="flex justify-between items-center bg-[#ec0000] rounded-md cursor-pointer text-2xl hover:py-5 py-3 px-8 my-4 hover:my-2 duration-200 transition-all ease-in-out"
      >
        Go to Music Page
      </Link>
    </div>
  );
};

export default HomePage;
