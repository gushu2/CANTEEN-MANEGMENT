import React from 'react';
import { FoodItem } from '../types';

interface MySelectionProps {
  selection: FoodItem[];
  isConfirmed: boolean;
  onDeselect: (itemId: number) => void;
  onConfirm: () => void;
  onOptOut: () => void;
  onModify: () => void;
  isAfterCutoff: boolean;
}

const MySelectionItem: React.FC<{item: FoodItem; onDeselect: (itemId: number) => void; isConfirmed: boolean}> = ({ item, onDeselect, isConfirmed }) => {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            {!isConfirmed && (
                <button onClick={() => onDeselect(item.id)} className="w-6 h-6 rounded-full text-red-500 flex items-center justify-center hover:bg-red-100" aria-label={`Remove ${item.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};


const MySelection: React.FC<MySelectionProps> = ({ selection, isConfirmed, onDeselect, onConfirm, onOptOut, onModify, isAfterCutoff }) => {
  const hasOptedOut = isConfirmed && selection.length === 0;

  const renderContent = () => {
    if (isConfirmed) {
      if (!isAfterCutoff) {
        return (
          <div className="text-center py-8">
              <p className="font-semibold text-gray-700">{hasOptedOut ? "You have opted out for tomorrow." : "Your selection for tomorrow is confirmed."}</p>
              <p className="text-sm text-gray-500 mt-1">Thank you!</p>
               <button
                onClick={onModify}
                className="mt-4 w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Modify Selection
              </button>
          </div>
        );
      }
      return (
        <div className="text-center py-8">
            <p className="font-semibold text-gray-700">{hasOptedOut ? "You have opted out for tomorrow." : "Your selection for tomorrow is confirmed."}</p>
            <p className="text-sm text-gray-500 mt-1">The deadline has passed, selection is final.</p>
        </div>
      );
    }

    if (isAfterCutoff) {
        return (
            <div className="text-center py-8">
                <p className="font-semibold text-red-600">The 9:00 PM deadline has passed.</p>
                <p className="text-sm text-gray-500 mt-1">You can no longer make a selection for tomorrow.</p>
            </div>
        );
    }
    
    if (selection.length === 0) {
      return (
        <div className="text-center py-8">
            <p className="text-gray-500">Your selection is empty. Choose items from the menu!</p>
            <button
                onClick={onOptOut}
                className="mt-4 w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
            >
                I'm not eating tomorrow (Opt Out)
            </button>
        </div>
      );
    }

    return (
        <>
            <div className="divide-y divide-gray-200">
                {selection.map((item) => (
                    <MySelectionItem key={item.id} item={item} onDeselect={onDeselect} isConfirmed={isConfirmed} />
                ))}
            </div>
            <div className="mt-6 border-t pt-4">
                <button
                    onClick={onConfirm}
                    className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
                >
                    Confirm My Selection
                </button>
            </div>
        </>
    );
  };


  return (
    <aside className="sticky top-28">
        <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">My Selection for Tomorrow</h2>
            {renderContent()}
        </div>
    </aside>
  );
};

export default MySelection;