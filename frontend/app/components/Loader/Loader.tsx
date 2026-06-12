import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-lightBg dark:bg-darkBg">
      {/* Branded spinner */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-white/5" />
        {/* Spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <p className="mt-5 text-sm font-medium text-gray-400 dark:text-gray-500 font-Inter animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;