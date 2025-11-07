import React, { useState } from 'react';

interface LoginProps {
  onLogin: (isAdmin: boolean, email?: string, phoneNumber?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !phoneNumber) {
      setError('Both email and phone number are required.');
      return;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Please use your @gmail.com email to log in.');
      return;
    }
    
    if (!/^[0-9-]+$/.test(phoneNumber)) {
        setError('Please enter a valid phone number.');
        return;
    }

    onLogin(false, email, phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">KARMIC Solution</h1>
            </div>
            <p className="text-gray-600 text-lg">Your smart and simple canteen solution.</p>
      </div>
      <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <form onSubmit={handleEmployeeLogin} className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-700">Employee Login</h2>
          {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Google Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@gmail.com"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number (for SMS)
            </label>
            <div className="mt-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 555-123-4567"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <button
          onClick={() => onLogin(true)}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Sign in as Admin (Demo)
        </button>
      </div>
       <div className="max-w-md w-full text-left mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 text-center">The Challenge</h2>
        <p className="mt-2 text-sm text-gray-700">
          Karmic Solutions currently faces significant food wastage and operational inefficiency within its complimentary employee canteen service. The existing manual process for tracking daily meal preferences lacks coordination, leading to:
        </p>
         <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Inaccurate estimation of meal quantities.</li>
          <li>Increased operational costs due to excess food preparation.</li>
          <li>Limited insights into employee dietary preferences.</li>
        </ul>
      </div>
      <div className="max-w-md w-full text-left mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 text-center">The Proposed Solution</h2>
        <p className="mt-2 text-sm text-gray-700">
          Development of the "Karmic Canteen App," a dedicated web and mobile application to bridge the communication gap between employees and the canteen administration. This system will automate the process of meal selection, data consolidation, and reporting, ensuring food is prepared based on precise, confirmed demand.
        </p>
      </div>
       <p className="mt-8 text-center text-sm text-gray-500">
        Built with Gemini AI
      </p>
    </div>
  );
};

export default Login;