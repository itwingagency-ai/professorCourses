"use client";

import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-5">
      <div className="text-center">
        <h1 className="text-[70px] font-bold text-[#37a39a]">404</h1>
        <h2 className="text-[28px] font-semibold text-black dark:text-white">
          Page not found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-3">
          The page you are looking for does not exist.
        </p>

        <Link href="/">
          <button className="mt-6 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
