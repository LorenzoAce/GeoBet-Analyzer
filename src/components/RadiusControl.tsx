import React from 'react';
import { useAppContext } from '../context/AppContext';

export const RadiusControl = () => {
  const { radius, setRadius } = useAppContext();
  
  // Predefined radius options
  const radiusOptions = [200, 300, 400, 500];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800">Raggio di ricerca</h3>
          <p className="text-sm text-gray-600">
            Regola il raggio per trovare luoghi sensibili nella zona
          </p>
        </div>
        
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="200"
              max="500"
              step="10"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-52 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="font-medium text-blue-700">{radius}m</span>
          </div>
          
          <div className="flex items-center gap-2">
            {radiusOptions.map((option) => (
              <button
                key={option}
                onClick={() => setRadius(option)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  radius === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {option}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};