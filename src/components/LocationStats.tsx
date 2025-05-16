import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getCategoryInfo } from '../utils/categoryUtils';
import { LocationCategory } from '../types';

export const LocationStats = () => {
  const { sensitivePlaces, bettingShops } = useAppContext();
  
  // Count locations by category
  const categoryCounts: Record<LocationCategory, number> = {
    school: 0,
    church: 0,
    hospital: 0,
    youth_center: 0,
    nursing_home: 0,
    betting_shop: 0,
    other: 0
  };
  
  // Count sensitive places
  sensitivePlaces.forEach(place => {
    categoryCounts[place.category]++;
  });
  
  // Count betting shops
  bettingShops.forEach(place => {
    categoryCounts[place.category]++;
  });
  
  // Get total counts - excluding 'other' category from sensitive places
  const totalSensitivePlaces = sensitivePlaces.filter(place => place.category !== 'other').length;
  const totalBettingShops = bettingShops.length;
  const totalPlaces = totalSensitivePlaces + totalBettingShops;
  
  // Get categories with at least one location
  const activeCategories = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([category]) => category as LocationCategory);
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Riepilogo</h2>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-700">Luoghi sensibili</div>
          <div className="text-2xl font-bold text-blue-800">{totalSensitivePlaces}</div>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-sm text-red-700">Sale scommesse</div>
          <div className="text-2xl font-bold text-red-800">{totalBettingShops}</div>
        </div>
      </div>
      
      {activeCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Distribuzione per categoria</h3>
          
          <div className="space-y-2">
            {activeCategories.map(category => {
              const info = getCategoryInfo(category);
              const count = categoryCounts[category];
              const percentage = (count / totalPlaces) * 100;
              
              return (
                <div key={category} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">{info.label}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: info.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};