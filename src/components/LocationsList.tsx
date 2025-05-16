import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getCategoryInfo } from '../utils/categoryUtils';
import { Filter, MapPin, Loader2 } from 'lucide-react';
import { LocationCategory } from '../types';

export const LocationsList = () => {
  const { sensitivePlaces, bettingShops, isLoading, center } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<LocationCategory | 'all'>('all');
  
  // Combine all locations
  const allLocations = [...sensitivePlaces, ...bettingShops];
  
  // Apply filter
  const filteredLocations = activeFilter === 'all' 
    ? allLocations 
    : allLocations.filter(loc => loc.category === activeFilter);
  
  // Sort by distance
  const sortedLocations = [...filteredLocations].sort((a, b) => a.distance - b.distance);
  
  if (!center && !isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-700">Nessun luogo da mostrare</h3>
          <p className="text-gray-600 mt-1">
            Inserisci un indirizzo per visualizzare i luoghi sensibili nelle vicinanze.
          </p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-700">Ricerca luoghi...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Luoghi trovati ({allLocations.length})
          </h2>
          
          <div className="relative">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as LocationCategory | 'all')}
                className="bg-white border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tutti i luoghi</option>
                <option value="school">Scuole</option>
                <option value="church">Chiese</option>
                <option value="hospital">Ospedali</option>
                <option value="youth_center">Centri giovanili</option>
                <option value="nursing_home">RSA</option>
                <option value="betting_shop">Sale scommesse</option>
                <option value="other">Altri luoghi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {sortedLocations.length === 0 ? (
        <div className="p-4 text-center py-12">
          <p className="text-gray-600">
            Nessun luogo trovato con il filtro selezionato.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
          {sortedLocations.map((location) => {
            const categoryInfo = getCategoryInfo(location.category);
            
            return (
              <li 
                key={location.id} 
                className="p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex gap-3">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" 
                    style={{ backgroundColor: `${categoryInfo.color}30`, color: categoryInfo.color }}
                  >
                    <span className="text-sm font-semibold">
                      {location.distance}m
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{location.name}</h3>
                    
                    <div className="mt-1 flex items-center gap-2">
                      <span 
                        className="inline-block px-2 py-0.5 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${categoryInfo.color}20`, 
                          color: categoryInfo.color 
                        }}
                      >
                        {categoryInfo.label}
                      </span>
                      
                      {location.category === 'betting_shop' && (
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Attenzione
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};