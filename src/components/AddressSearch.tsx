import React, { useEffect, useRef, KeyboardEvent } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const AddressSearch = () => {
  const { 
    address, 
    setAddress, 
    handleSearch, 
    isLoading, 
    error 
  } = useAppContext();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  useEffect(() => {
    if (!inputRef.current) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'it' },
      fields: ['formatted_address', 'geometry'],
      types: ['address']
    });

    // Handle place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        setAddress(place.formatted_address);
        handleSearch();
      }
    });

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [setAddress, handleSearch]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (!autocompleteRef.current?.getPlace()) {
        // If no place is selected from dropdown, trigger search with current input
        handleSearch();
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Inserisci un indirizzo in Italia"
          className={`w-full p-3 pl-10 pr-14 rounded-lg bg-white/90 backdrop-blur-sm
                     border ${error ? 'border-red-400' : 'border-blue-300'} 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-500`}
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          ) : (
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !address.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md
                         transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cerca
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
};