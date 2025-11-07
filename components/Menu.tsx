import React, { useMemo, useState } from 'react';
import { FoodItem } from '../types';
import MenuItemCard from './MenuItemCard';

interface MenuProps {
  menuItems: FoodItem[];
  onSelectItem: (item: FoodItem) => void;
  isAfterCutoff: boolean;
}

const Menu: React.FC<MenuProps> = ({ menuItems, onSelectItem, isAfterCutoff }) => {
  const groupedMenu = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as Record<string, FoodItem[]>);
  }, [menuItems]);

  const categoryOrder: (keyof typeof groupedMenu)[] = ['Breakfast', 'Lunch', 'Evening Snack', 'Beverage'];
  const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md animate-slide-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Tomorrow's Menu</h2>
          <p className="text-slate-500 mt-1">
            Deadline for selection is <span className="font-semibold text-indigo-600">9:00 PM</span> tonight.
          </p>
        </div>
         <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg mt-4 md:mt-0">
          {categoryOrder.map(category => (
            groupedMenu[category] && (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  activeCategory === category ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {category}
              </button>
            )
          ))}
        </div>
      </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupedMenu[activeCategory]?.map((item, index) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onSelectItem={onSelectItem} 
              isAfterCutoff={isAfterCutoff}
              style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
              className="animate-slide-in-up"
            />
          ))}
        </div>
    </div>
  );
};

export default Menu;