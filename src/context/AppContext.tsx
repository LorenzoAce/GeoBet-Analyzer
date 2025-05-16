import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { geocodeAddress, findNearbyPlaces } from '../services/locationService';
import { Location, SearchResult } from '../types';
import { GoogleMapsApiLoader } from '../components/GoogleMapsApiLoader';
import { GOOGLE_MAPS_API_KEY } from '../config/apiKeys';

interface AppContextType {
  address: string;
  setAddress: (address: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  center: [number, number] | null;
  setCenter: (center: [number, number] | null) => void;
  isLoading: boolean;
  error: string | null;
  sensitivePlaces: Location[];
  bettingShops: Location[];
  searchResults: SearchResult | null;
  handleSearch: () => Promise<void>;
}

const initialState: AppContextType = {
  address: '',
  setAddress: () => {},
  radius: 300,
  setRadius: () => {},
  center: null,
  setCenter: () => {},
  isLoading: false,
  error: null,
  sensitivePlaces: [],
  bettingShops: [],
  searchResults: null,
  handleSearch: async () => {}
};

const AppContext = createContext<AppContextType>(initialState);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(300);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensitivePlaces, setSensitivePlaces] = useState<Location[]>([]);
  const [bettingShops, setBettingShops] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  // Reset error when address changes
  useEffect(() => {
    if (error) setError(null);
  }, [address]);

  // Fetch places when center or radius changes
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!center) return;
      
      try {
        setIsLoading(true);
        const results = await findNearbyPlaces(center, radius);
        
        setSearchResults(results);
        setSensitivePlaces(results.sensitivePlaces);
        setBettingShops(results.bettingShops);
      } catch (err) {
        setError('Errore nel recupero dei luoghi vicini');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (center) {
      fetchPlaces();
    }
  }, [center, radius]);

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Inserisci un indirizzo valido');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const coordinates = await geocodeAddress(address);
      if (!coordinates) {
        setError('Indirizzo non trovato. Verifica che sia un indirizzo italiano valido.');
        setCenter(null);
        return;
      }
      
      setCenter(coordinates);
    } catch (err) {
      setError('Errore nella ricerca dell\'indirizzo. Riprova più tardi.');
      console.error(err);
      setCenter(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleMapsApiLoader apiKey={GOOGLE_MAPS_API_KEY}>
      <AppContext.Provider
        value={{
          address,
          setAddress,
          radius,
          setRadius,
          center,
          setCenter,
          isLoading,
          error,
          sensitivePlaces,
          bettingShops,
          searchResults,
          handleSearch
        }}
      >
        {children}
      </AppContext.Provider>
    </GoogleMapsApiLoader>
  );
};