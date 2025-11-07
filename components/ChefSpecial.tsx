
import React from 'react';

interface Special {
    name: string;
    description: string;
}

const ChefSpecial: React.FC = () => {
    const special: Special = {
        name: "Palak Paneer Delight",
        description: "Creamy spinach curry with soft paneer cubes, spiced to perfection. A comforting and healthy choice."
    };
    
    return (
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-indigo-700 to-purple-800 shadow-lg text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Chef's Special of the Day</h2>
                    <div>
                        <h3 className="text-xl font-bold text-yellow-300">{special.name}</h3>
                        <p className="mt-1 text-gray-200">{special.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChefSpecial;