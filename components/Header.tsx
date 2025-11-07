import React, { useState } from 'react';
import { View, User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, setView }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
              <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .55-.02.81-.05.1-.01.19-.08.24-.17.1-.17.02-.38-.15-.48-1.57-.92-2.6-2.61-2.6-4.47 0-2.84 2.3-5.14 5.14-5.14.75 0 1.46.17 2.1.46.18.08.39 0 .48-.15.09-.15.08-.34-.02-.48C17.06 4.3 14.63 4 12 4z"/>
            </svg>
            <h1 className="text-2xl font-bold text-slate-800">Karmic Canteen</h1>
        </div>
        <div className="flex items-center space-x-4">
            {user.isAdmin && (
                <div className="hidden sm:flex items-center space-x-1 bg-slate-200 p-1 rounded-lg">
                <button
                    onClick={() => setView('customer')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    currentView === 'customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                    Menu View
                </button>
                <button
                    onClick={() => setView('admin')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    currentView === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                    }`}
                >
                    Admin Dashboard
                </button>
                </div>
            )}
             <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-3 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                  <img src={user.photoUrl} alt={user.name} className="w-9 h-9 rounded-full border-2 border-indigo-200" />
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-slate-800 font-semibold text-sm leading-tight">{user.name}</span>
                     <span className="text-slate-500 text-xs leading-tight">{user.email}</span>
                  </div>
                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <div 
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-slate-200 transition-all duration-300 origin-top-right ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                    onMouseLeave={() => setIsDropdownOpen(false)}>
                      <div className="p-2 border-b">
                          <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button 
                          onClick={onLogout}
                          className="w-full flex items-center space-x-2 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-md"
                      >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                      </button>
                  </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;