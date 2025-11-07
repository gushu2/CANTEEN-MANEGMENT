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
        <div className="flex items-center justify-between py-3 animate-fade-in">
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
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const itemsList = selection.map(i => `- ${i.name}`).join('\n');
    const qrData = `Karmic Canteen Coupon\n--------------------\nName: ${user.name}\nDate: ${today}\n\nYour Items:\n${itemsList}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}&format=png&color=4f46e5&bgcolor=ffffff`;

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
            <div className="text-center py-8 flex flex-col items-center animate-fade-in">
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
              <div className="text-center py-6 flex flex-col items-center animate-fade-in">
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
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const itemsList = selection.map(i => `- ${i.name}`).join('\n');
        const qrData = `Karmic Canteen Coupon\n--------------------\nName: ${user.name}\nDate: ${today}\n\nYour Items:\n${itemsList}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}&format=png&color=4f46e5&bgcolor=ffffff`;
        
        return (
            <div className="flex flex-col items-center animate-fade-in">
                 <div className="bg-emerald-100 p-4 rounded-lg w-full text-center mb-4">
                    <h3 className="font-bold text-emerald-800 text-lg">Your Meal Coupon is Ready!</h3>
                    <p className="text-sm text-emerald-700 mt-1">Show this QR code at the canteen counter.</p>
                </div>

                <div className="w-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full opacity-50"></div>

                    <div className="p-5 relative z-10">
                        <div className="flex justify-between items-center border-b-2 border-white/20 pb-3 mb-4">
                            <div>
                                <p className="font-bold text-xl tracking-wide">{user.name}</p>
                                <p className="text-xs text-indigo-200">For: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
                                    <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .55-.02.81-.05.1-.01.19-.08.24-.17.1-.17.02-.38-.15-.48-1.57-.92-2.6-2.61-2.6-4.47 0-2.84 2.3-5.14 5.14-5.14.75 0 1.46.17 2.1.46.18.08.39 0 .48-.15.09-.15.08-.34-.02-.48C17.06 4.3 14.63 4 12 4z"/>
                                </svg>
                                <span className="font-bold text-lg">Karmic</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div className="bg-white p-2 rounded-lg shadow-md">
                                <img src={qrCodeUrl} alt="Meal Coupon QR Code" className="mx-auto rounded-md w-full" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-indigo-100 mb-2">Your Selection:</h4>
                                <ul className="text-white text-sm space-y-1.5">
                                    {selection.map(item => (
                                        <li key={item.id} className="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-emerald-300 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>{item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={handleDownload}
                    className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
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
        <div className="text-center py-8 flex flex-col items-center animate-fade-in">
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
        <div className="animate-fade-in">
            <div className="divide-y divide-slate-200">
                {selection.map((item) => (
                    <MySelectionItem key={item.id} item={item} onDeselect={onDeselect} isActionsDisabled={isConfirmed || isAfterCutoff} />
                ))}
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
                <button
                    onClick={onConfirm}
                    className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
                >
                    Confirm My Selection
                </button>
            </div>
        </div>
    );
  };


  return (
    <aside className="sticky top-24">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 animate-slide-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 p-4">My Plate for Tomorrow</h2>
            <div className="p-4">
                {renderContent()}
            </div>
        </div>
    </aside>
  );
};

export default MySelection;