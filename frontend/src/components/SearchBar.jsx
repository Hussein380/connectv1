import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search opportunities..." }) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
    );
};

export default SearchBar; 