import React from 'react';
import { FoodItem } from '../types';

interface MenuItemCardProps {
  item: FoodItem;
  onSelectItem: (item: FoodItem) => void;
  isAfterCutoff: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelectItem, isAfterCutoff }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl p-6 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            item.category === 'Breakfast' ? 'bg-orange-100 text-orange-800' :
            item.category === 'Lunch' ? 'bg-blue-100 text-blue-800' :
            item.category === 'Evening Snack' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
        }`}>{item.category}</span>
      </div>
      <p className="text-gray-600 mt-2 text-sm flex-grow">{item.description}</p>
      <button
        onClick={() => onSelectItem(item)}
        disabled={isAfterCutoff}
        className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Select</span>
      </button>
    </div>
  );
};

export default MenuItemCard;