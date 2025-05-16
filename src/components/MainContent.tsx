import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Map } from './Map';
import { LocationsList } from './LocationsList';
import { RadiusControl } from './RadiusControl';
import { LocationStats } from './LocationStats';
import { AlertCircle, Map as MapIcon } from 'lucide-react';

export const MainContent = () => {
  const { center, error, isLoading, sensitivePlaces, bettingShops } = useAppContext();
  
  // Determine if we have results to show
  const hasResults = center && (sensitivePlaces.length > 0 || bettingShops.length > 0);
  const hasNoResults = center && !isLoading && sensitivePlaces.length === 0 && bettingShops.length === 0;
  
  return (
    <main className="flex-grow container mx-auto px-4 py-6 pb-20">
      {!center && !isLoading && !error && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <MapIcon className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Benvenuto in GeoBet Analyzer
            </h2>
            <p className="text-gray-600 mb-6">
              Inserisci un indirizzo italiano per visualizzare tutti i luoghi sensibili nelle vicinanze
              e verificare la presenza di sale scommesse nell'area.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                L'applicazione identifica scuole, chiese, centri giovanili, RSA, ospedali e 
                altri luoghi sensibili nel raggio specificato.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {hasNoResults && (
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 my-4">
          <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
          <h3 className="text-lg font-medium text-gray-700">Nessun luogo sensibile trovato</h3>
          <p className="text-gray-600 mt-1">
            Non sono stati trovati luoghi sensibili o sale scommesse nel raggio selezionato.
            Prova ad aumentare il raggio di ricerca o a cercare un indirizzo diverso.
          </p>
        </div>
      )}
      
      {(center || isLoading) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Map />
            </div>
            
            {center && (
              <div className="mt-4">
                <RadiusControl />
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            {hasResults && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <LocationStats />
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <LocationsList />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};