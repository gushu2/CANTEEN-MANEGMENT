
import React, { useMemo } from 'react';
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

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Tomorrow's Menu</h2>
      <p className="text-gray-600 mb-6">
        Please make your selection for tomorrow before the <span className="font-bold text-indigo-600">9:00 PM</span> deadline tonight. Selections are final.
      </p>
      
      {categoryOrder.map(category => (
        groupedMenu[category] && (
          <div key={category} className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-200">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedMenu[category].map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onSelectItem={onSelectItem} 
                  isAfterCutoff={isAfterCutoff}
                />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Menu;