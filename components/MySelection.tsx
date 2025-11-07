import React from 'react';
import { FoodItem, User } from '../types';

interface MySelectionProps {
  user: User;
  selection: FoodItem[];
  isConfirmed: boolean;
  onDeselect: (itemId: number) => void;
  onConfirm: () => void;
  onOptOut: () => void;
  onModify: () => void;
  isAfterCutoff: boolean;
}

const MySelectionItem: React.FC<{item: FoodItem; onDeselect: (itemId: number) => void; isActionsDisabled: boolean}> = ({ item, onDeselect, isActionsDisabled }) => {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">{item.category}</p>
            </div>
            {!isActionsDisabled && (
                <button onClick={() => onDeselect(item.id)} className="w-7 h-7 rounded-full text-slate-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors" aria-label={`Remove ${item.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
    );
};


const MySelection: React.FC<MySelectionProps> = ({ user, selection, isConfirmed, onDeselect, onConfirm, onOptOut, onModify, isAfterCutoff }) => {
  
  const handleDownload = async () => {
    const qrData = JSON.stringify({
        email: user.email,
        name: user.name,
        date: new Date().toISOString().split('T')[0],
        items: selection.map(i => i.name)
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}&format=png`;

    try {
        const response = await fetch(qrCodeUrl);
        if (!response.ok) throw new Error('QR code fetch failed');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `karmic-canteen-coupon-${user.name.replace(/\s/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download QR code:", error);
        alert("Sorry, the coupon could not be downloaded. Please try again or take a screenshot.");
    }
  };

  const renderContent = () => {
    if (isAfterCutoff && !isConfirmed) {
        return (
            <div className="text-center py-8 flex flex-col items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-red-600">The 9:00 PM deadline has passed.</p>
                <p className="text-sm text-slate-500 mt-1">You can no longer make a selection.</p>
            </div>
        );
    }

    if (isConfirmed) {
        const hasOptedOut = selection.length === 0;

        if (hasOptedOut) {
            return (
              <div className="text-center py-6 flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  </div>
                  <p className="font-semibold text-slate-700">You have opted out for tomorrow.</p>
                  <p className="text-sm text-slate-500 mt-1">{isAfterCutoff ? "The deadline has passed." : "Your choice is saved."}</p>
                   {!isAfterCutoff && (
                    <button
                        onClick={onModify}
                        className="mt-4 w-full bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 transition-colors duration-200 text-sm"
                    >
                        Modify Selection
                    </button>
                   )}
              </div>
            );
        }

        // Coupon View
        const qrData = JSON.stringify({
            email: user.email,
            name: user.name,
            date: new Date().toISOString().split('T')[0],
            items: selection.map(i => i.name)
        });
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}&format=png`;
        
        return (
            <div className="flex flex-col items-center">
                <div className="bg-emerald-100 p-4 rounded-lg w-full text-center">
                    <h3 className="font-bold text-emerald-800 text-lg">Your Meal Coupon is Ready!</h3>
                    <p className="text-sm text-emerald-700 mt-1">Show this QR code at the canteen counter.</p>
                </div>
                
                <div className="w-full mt-4 p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white">
                    <div className="text-left mb-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800 text-lg">{user.name}</p>
                            <p className="text-sm text-slate-500">For: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H12.5a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <img src={qrCodeUrl} alt="Meal Coupon QR Code" className="mx-auto rounded-md border-2 border-slate-200 shadow-sm p-1 bg-white" width="180" height="180" />
                    <div className="text-left mt-4">
                        <h4 className="font-semibold text-slate-700 border-b border-slate-200 pb-1 mb-2">Your Selection:</h4>
                        <ul className="text-slate-600 text-sm space-y-1">
                            {selection.map(item => <li key={item.id} className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>{item.name}</li>)}
                        </ul>
                    </div>
                </div>
                
                <button
                    onClick={handleDownload}
                    className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Download Coupon</span>
                </button>
                
                {!isAfterCutoff && (
                    <button
                        onClick={onModify}
                        className="mt-3 w-full bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 transition-colors duration-200 text-sm"
                    >
                        Modify Selection
                    </button>
                )}
            </div>
        );
    }

    if (selection.length === 0) {
      return (
        <div className="text-center py-8 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <p className="text-slate-500 font-medium">Your plate is empty.</p>
            <p className="text-sm text-slate-500 mt-1">Choose items from the menu!</p>
            <button
                onClick={onOptOut}
                className="mt-6 w-full border border-red-300 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 text-sm"
            >
                Not eating tomorrow (Opt Out)
            </button>
        </div>
      );
    }

    return (
        <>
            <div className="divide-y divide-slate-200">
                {selection.map((item) => (
                    <MySelectionItem key={item.id} item={item} onDeselect={onDeselect} isActionsDisabled={isConfirmed || isAfterCutoff} />
                ))}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
                <button
                    onClick={onConfirm}
                    className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200"
                >
                    Confirm My Selection
                </button>
            </div>
        </>
    );
  };


  return (
    <aside className="sticky top-24">
        <div className="bg-white rounded-xl shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 p-4">My Plate for Tomorrow</h2>
            <div className="p-4">
                {renderContent()}
            </div>
        </div>
    </aside>
  );
};

export default MySelection;