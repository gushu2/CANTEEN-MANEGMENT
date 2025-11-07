import React, { useMemo, useState, useEffect, useRef } from 'react';
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

type AdminTab = 'report' | 'menu' | 'history';

// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; highlight: boolean; }> = ({ title, value, icon, highlight }) => (
    <div className={`p-5 rounded-xl bg-white shadow-sm transition-all duration-500 ease-out ${highlight ? 'animate-pulse-effect' : ''}`}>
        <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </div>
);


const AdminView: React.FC<AdminViewProps> = ({ selections, historicalSelections, menuItems, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('report');
  
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

  const [highlight, setHighlight] = useState(false);
  const prevTotalResponses = useRef(totalResponses);

  useEffect(() => {
    if (totalResponses > prevTotalResponses.current) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1500);
      return () => clearTimeout(timer);
    }
    prevTotalResponses.current = totalResponses;
  }, [totalResponses]);

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'report', label: 'Today\'s Report' },
    { id: 'menu', label: 'Menu Management' },
    { id: 'history', label: 'Historical Data' },
  ];
  
  const renderContent = () => {
      switch(activeTab) {
          case 'report':
              return (
                 <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Daily Meal Report</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       <StatCard 
                          title="Total Employee Responses"
                          value={totalResponses}
                          highlight={highlight}
                          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.25-.743-1.676M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.28-1.25.743-1.676M12 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM12 12H9m3 0h3" /></svg>}
                       />
                       <StatCard 
                          title="Total Items to Prepare"
                          value={totalItems}
                          highlight={highlight}
                          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" /></svg>}
                       />
                       <StatCard 
                          title="Employees Opted Out"
                          value={totalOptedOut}
                          highlight={highlight}
                          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                       />
                    </div>
                    
                    {report.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-slate-900">No meal selections yet</h3>
                          <p className="mt-1 text-sm text-slate-500">Employee selections for today will appear here.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                          <table className="min-w-full divide-y divide-slate-200">
                              <thead className="bg-slate-50">
                                  <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                      <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Selections</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-200">
                                  {report.map(({ item, count }, index) => (
                                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                  item.category === 'Breakfast' ? 'bg-amber-100 text-amber-800' :
                                                  item.category === 'Lunch' ? 'bg-sky-100 text-sky-800' :
                                                  item.category === 'Evening Snack' ? 'bg-rose-100 text-rose-800' :
                                                  'bg-emerald-100 text-emerald-800'
                                              }`}>
                                                  {item.category}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-800">{count}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    )}
                  </div>
              );
            case 'menu':
                return (
                    <div className="animate-fade-in">
                        <MenuManagement 
                            menuItems={menuItems}
                            onAddItem={onAddItem}
                            onUpdateItem={onUpdateItem}
                            onDeleteItem={onDeleteItem}
                        />
                    </div>
                );
            case 'history':
                 return (
                    <div className="animate-fade-in">
                        <HistoricalData selections={historicalSelections} />
                    </div>
                );
            default:
                return null;
      }
  }

  return (
    <div>
        <div className="border-b border-slate-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        
        {renderContent()}
    </div>
  );
};

export default AdminView;