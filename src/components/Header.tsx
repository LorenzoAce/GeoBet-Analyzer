import React from 'react';
import { Map, AlertCircle } from 'lucide-react';
import { AddressSearch } from './AddressSearch';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Map className="h-8 w-8" />
            <h1 className="text-2xl font-bold">GeoBet Analyzer</h1>
          </div>
          
          <div className="w-full md:w-2/3 lg:w-1/2">
            <AddressSearch />
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Per la pianificazione urbana responsabile</span>
          </div>
        </div>
      </div>
    </header>
  );
};