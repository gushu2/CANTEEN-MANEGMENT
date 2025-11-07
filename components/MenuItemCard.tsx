import React from 'react';
import { FoodItem } from '../types';

interface MenuItemCardProps {
  item: FoodItem;
  onSelectItem: (item: FoodItem) => void;
  isAfterCutoff: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelectItem, isAfterCutoff }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 p-5 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            item.category === 'Breakfast' ? 'bg-amber-100 text-amber-800' :
            item.category === 'Lunch' ? 'bg-sky-100 text-sky-800' :
            item.category === 'Evening Snack' ? 'bg-rose-100 text-rose-800' :
            'bg-emerald-100 text-emerald-800'
        }`}>{item.category}</span>
      </div>
      <p className="text-slate-500 mt-1 text-sm flex-grow">{item.description}</p>
      <button
        onClick={() => onSelectItem(item)}
        disabled={isAfterCutoff}
        className="mt-4 w-full bg-indigo-50 text-indigo-600 font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed group-hover:bg-indigo-600 group-hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Select</span>
      </button>
    </div>
  );
};

export default MenuItemCard;