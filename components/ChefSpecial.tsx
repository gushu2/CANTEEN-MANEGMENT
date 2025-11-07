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
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white relative overflow-hidden animate-gradient-shift">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-2 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
                <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 mr-2 animate-shimmer" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <h2 className="text-xl font-bold">Chef's Special of the Day</h2>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-yellow-300">{special.name}</h3>
                    <p className="mt-1 text-indigo-100">{special.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ChefSpecial;