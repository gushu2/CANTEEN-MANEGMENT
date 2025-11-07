import React, { useState } from 'react';

interface LoginProps {
  onLogin: (isAdmin: boolean, email?: string, phoneNumber?: string) => void;
}

// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const InfoCard: React.FC<{title: string, color: string, icon: React.ReactElement, children: React.ReactNode}> = ({title, color, icon, children}) => {
    return (
        <div className={`w-full text-left p-6 bg-${color}-50 border border-${color}-200 rounded-lg`}>
            <div className="flex items-center">
                <div className={`text-${color}-600`}>{icon}</div>
                <h2 className={`ml-2 text-lg font-bold text-${color}-800`}>{title}</h2>
            </div>
            <div className={`mt-2 text-sm text-slate-700 space-y-2`}>
                {children}
            </div>
        </div>
    );
};


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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        <div className="hidden md:flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12.5 13.04l2.71-2.71c.2-.2.2-.51 0-.71s-.51-.2-.71 0L12 12.08l-2.5-2.5c-.2-.2-.51-.2-.71 0s-.2.51 0 .71l2.71 2.71-2.71 2.71c-.2.2-.2.51 0 .71.1.1.23.15.35.15s.26-.05.35-.15L12 13.92l2.5 2.5c.1.1.23.15.35.15s.26-.05.35-.15c.2-.2.2-.51 0-.71L12.5 13.04z" opacity=".3"/>
                  <path d="M12.5 13.04l2.71-2.71c.2-.2.2-.51 0-.71s-.51-.2-.71 0L12 12.08l-2.5-2.5c-.2-.2-.51-.2-.71 0s-.2.51 0 .71l2.71 2.71-2.71 2.71c-.2.2-.2.51 0 .71.1.1.23.15.35.15s.26-.05.35-.15L12 13.92l2.5 2.5c.1.1.23.15.35.15s.26-.05.35-.15c.2-.2.2-.51 0-.71L12.5 13.04z" />
                </svg>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Karmic Canteen</h1>
                  <p className="text-slate-500">Your smart and simple canteen solution.</p>
                </div>
            </div>
            <InfoCard title="The Challenge" color="amber" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                 <p>
                    Karmic Solutions faces food wastage and operational inefficiency due to a manual process for tracking employee meal preferences. This leads to inaccurate estimations, increased costs, and limited dietary insights.
                </p>
            </InfoCard>
             <InfoCard title="The Solution" color="emerald" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                 <p>
                    The Karmic Canteen App automates meal selection and data consolidation, ensuring food is prepared based on precise, confirmed demand, reducing waste and providing valuable insights.
                </p>
            </InfoCard>
        </div>

        <div className="w-full bg-white rounded-xl shadow-lg p-8 space-y-6 border border-slate-200">
            <div className="md:hidden text-center mb-4">
                <h1 className="text-3xl font-bold text-slate-800">Karmic Canteen</h1>
                <p className="text-slate-500">Welcome! Please sign in.</p>
            </div>
            <form onSubmit={handleEmployeeLogin} className="space-y-4">
            <h2 className="text-xl font-bold text-center text-slate-700">Employee Login</h2>
            {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md font-medium">{error}</p>}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
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
                    placeholder="you@gmail.com"
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                </div>
            </div>
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
                Mobile Number
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
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                </div>
            </div>
            <div>
                <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                Sign In
                </button>
            </div>
            </form>
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or</span>
            </div>
            </div>
            <button
            onClick={() => onLogin(true)}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
            Sign in as Admin (Demo)
            </button>
        </div>
        </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        Built with Gemini AI
      </p>
    </div>
  );
};

export default Login;
