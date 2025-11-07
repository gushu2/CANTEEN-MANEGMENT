import React, { useMemo } from 'react';
import { MealSelection, FoodItem } from '../types';

interface HistoricalDataProps {
  selections: MealSelection[];
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ selections }) => {
  const analytics = useMemo(() => {
    if (selections.length === 0) {
      return null;
    }

    const itemCounts: Record<number, { name: string; category: FoodItem['category']; count: number }> = {};
    let totalOptOuts = 0;
    const dates = new Set<string>();

    selections.forEach(sel => {
      dates.add(sel.date.toDateString());
      if (sel.optedOut) {
        totalOptOuts++;
      }
      sel.items.forEach(item => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { name: item.name, category: item.category, count: 0 };
        }
        itemCounts[item.id].count++;
      });
    });

    const totalDays = dates.size;
    const avgOptOutRate = totalDays > 0 ? (totalOptOuts / (totalDays * 25)) * 100 : 0; // Assuming 25 employees
    
    const sortedItems = Object.values(itemCounts).sort((a, b) => b.count - a.count);
    
    const mostPopularLunch = sortedItems.find(item => item.category === 'Lunch') || null;
    const mostPopularSnack = sortedItems.find(item => item.category === 'Evening Snack') || null;

    const maxCount = sortedItems.length > 0 ? sortedItems[0].count : 0;

    return {
      avgOptOutRate,
      mostPopularLunch,
      mostPopularSnack,
      sortedItems,
      maxCount
    };
  }, [selections]);

  if (!analytics) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Data-Driven Planning</h3>
            <p className="text-slate-500">No historical data available to generate insights.</p>
        </div>
    );
  }

  const { avgOptOutRate, mostPopularLunch, mostPopularSnack, sortedItems, maxCount } = analytics;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Data-Driven Planning (Last 30 Days)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-600">Most Popular Lunch</h4>
          <p className="text-lg font-bold text-indigo-600 truncate">{mostPopularLunch?.name || 'N/A'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-600">Most Popular Snack</h4>
          <p className="text-lg font-bold text-indigo-600 truncate">{mostPopularSnack?.name || 'N/A'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-600">Average Opt-Out Rate</h4>
          <p className="text-lg font-bold text-red-500">{avgOptOutRate.toFixed(1)}%</p>
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold text-slate-700 mb-4">Item Popularity Trends</h4>
        <div className="space-y-4">
          {sortedItems.map((item, index) => (
            <div key={item.name} className="animate-slide-in-up" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
                <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium text-slate-700 truncate pr-2">{item.name}</div>
                    <div className="text-sm font-bold text-slate-600">{item.count}</div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%' }}
                    >
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricalData;