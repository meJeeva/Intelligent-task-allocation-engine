import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Intelligent Task Allocation Engine
            </h1>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
