import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import packageJson from '../../../package.json';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      name: 'Team Management',
      href: '/team',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      name: 'Task Management',
      href: '/tasks',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
      name: 'Allocation Results',
      href: '/allocation',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200 min-h-screen transition-all duration-300 ease-in-out shadow-xl flex flex-col`}>
      <div className={`flex-grow ${isCollapsed ? 'px-3' : 'p-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">TaskFlow</h1>
                <p className="text-xs text-slate-500">Intelligent Allocation</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 group ${isCollapsed ? 'mt-5' : ''}`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group relative flex items-center ${isCollapsed ? 'justify-center' : ''} ${isCollapsed ? 'py-3' : 'py-2.5 px-3'} text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                }`
              }
              title={isCollapsed ? item.name : ''}
            >
              {({ isActive }) => (
                <>
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
                  )}

                  <svg className={`w-5 h-4 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>

                  {!isCollapsed && (
                    <span className={`ml-3 transition-all duration-200 ${isActive ? 'text-white font-semibold' : 'text-slate-700'
                      }`}>
                      {item.name}
                    </span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 -ml-1"></div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-20 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Pro Tip</p>
                  <p className="text-xs text-slate-600">Use the allocation engine for optimal task assignment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`p-4 border-t border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <p className={`text-[10px] font-medium text-slate-400 tracking-wider uppercase ${isCollapsed ? '' : 'ml-2'}`}>
          {isCollapsed ? `v${packageJson.version}` : `Version ${packageJson.version}`}
        </p>
      </div>
    </div>
  );

};

export default Sidebar;
