import React, { useMemo } from 'react';
import { MealSelection, FoodItem } from '../types';
import MenuManagement from './MenuManagement';
import HistoricalData from './HistoricalData';

interface AdminViewProps {
  selections: MealSelection[];
  historicalSelections: MealSelection[];
  menuItems: FoodItem[];
  onAddItem: (item: Omit<FoodItem, 'id' | 'price'>) => void;
  onUpdateItem: (item: FoodItem) => void;
  onDeleteItem: (itemId: number) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ selections, historicalSelections, menuItems, onAddItem, onUpdateItem, onDeleteItem }) => {

  const report = useMemo(() => {
    const counts: Record<string, { item: FoodItem, count: number }> = {};
    selections.forEach(selection => {
      selection.items.forEach(item => {
        if (counts[item.name]) {
          counts[item.name].count++;
        } else {
          counts[item.name] = { item, count: 1 };
        }
      });
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [selections]);

  const totalResponses = selections.length;
  const totalItems = report.reduce((sum, current) => sum + current.count, 0);
  const totalOptedOut = useMemo(() => selections.filter(s => s.optedOut).length, [selections]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Daily Meal Report</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Employee Responses</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalResponses}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Items to Prepare</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalItems}</p>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Employees Opted Out</h3>
          <p className="text-3xl font-bold text-red-500">{totalOptedOut}</p>
        </div>
      </div>
      
      {report.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg xmlns="http://www.w0.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No meal selections yet</h3>
            <p className="mt-1 text-sm text-gray-500">Employee selections for today will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Selections</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {report.map(({ item, count }) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Fix: Updated category names and styling to match FoodItem type and maintain UI consistency. */}
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.category === 'Breakfast' ? 'bg-orange-100 text-orange-800' :
                                    item.category === 'Lunch' ? 'bg-blue-100 text-blue-800' :
                                    item.category === 'Evening Snack' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-800">{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      <MenuManagement 
        menuItems={menuItems}
        onAddItem={onAddItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />

      <HistoricalData selections={historicalSelections} />
    </div>
  );
};

export default AdminView;
