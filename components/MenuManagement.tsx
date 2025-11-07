import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';

interface MenuManagementProps {
    menuItems: FoodItem[];
    onAddItem: (item: Omit<FoodItem, 'id' | 'price'>) => void;
    onUpdateItem: (item: FoodItem) => void;
    onDeleteItem: (itemId: number) => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ menuItems, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
    const [formData, setFormData] = useState<{name: string, description: string, category: FoodItem['category']}>({ name: '', description: '', category: 'Lunch' });

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name,
                description: editingItem.description,
                category: editingItem.category,
            });
            setIsFormOpen(true);
        }
    }, [editingItem]);

    const resetForm = () => {
        setFormData({ name: '', description: '', category: 'Lunch' });
        setEditingItem(null);
        setIsFormOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            onUpdateItem({ ...editingItem, ...formData });
        } else {
            onAddItem(formData);
        }
        resetForm();
    };

    const handleEdit = (item: FoodItem) => {
        setEditingItem(item);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold text-slate-800">Menu Management</h3>
                 {!isFormOpen && (
                     <button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Add New Item</span>
                    </button>
                 )}
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <h4 className="text-lg font-semibold text-slate-700">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h4>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleFormChange} required rows={3} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                        <select name="category" id="category" value={formData.category} onChange={handleFormChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Evening Snack">Evening Snack</option>
                            <option value="Beverage">Beverage</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={resetForm} className="bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors">{editingItem ? 'Update Item' : 'Save Item'}</button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {menuItems.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                    <div className="text-sm text-slate-500 truncate" style={{maxWidth: '300px'}}>{item.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                        item.category === 'Breakfast' ? 'bg-amber-100 text-amber-800' :
                                        item.category === 'Lunch' ? 'bg-sky-100 text-sky-800' :
                                        item.category === 'Evening Snack' ? 'bg-rose-100 text-rose-800' :
                                        'bg-emerald-100 text-emerald-800'
                                    }`}>{item.category}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 font-semibold">Edit</button>
                                    <button onClick={() => onDeleteItem(item.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuManagement;