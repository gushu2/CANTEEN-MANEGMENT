import React from 'react';
import { View, User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, setView }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">KARMIC Solution</h1>
        </div>
        <div className="flex items-center space-x-4">
            {user.isAdmin && (
                <div className="flex items-center space-x-2 bg-gray-200 p-1 rounded-lg">
                <button
                    onClick={() => setView('customer')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    currentView === 'customer' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    Menu
                </button>
                <button
                    onClick={() => setView('admin')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    currentView === 'admin' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    Admin
                </button>
                </div>
            )}
             <div className="flex items-center space-x-3">
                <img src={user.photoUrl} alt={user.name} className="w-9 h-9 rounded-full border-2 border-indigo-200" />
                <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
                <button 
                    onClick={onLogout}
                    className="text-sm font-semibold text-gray-600 hover:text-indigo-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Logout"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;