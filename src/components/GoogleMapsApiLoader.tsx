import React, { useEffect, useState } from 'react';

interface GoogleMapsApiLoaderProps {
  apiKey: string;
  children: React.ReactNode;
  libraries?: string[];
}

export const GoogleMapsApiLoader: React.FC<GoogleMapsApiLoaderProps> = ({
  apiKey,
  children,
  libraries = ['places', 'geocoding']
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Verifica se l'API è già caricata
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Funzione per caricare lo script di Google Maps API
    const loadGoogleMapsApi = () => {
      // Crea un ID univoco per la callback
      const callbackName = `googleMapsApiCallback_${Math.round(Date.now() * Math.random())}`;
      
      // Aggiungi la callback alla finestra globale
      window[callbackName] = () => {
        setIsLoaded(true);
        delete window[callbackName];
      };

      // Crea lo script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        setError(new Error('Errore nel caricamento delle Google Maps API'));
        console.error('Google Maps API loading error:', error);
      };

      // Aggiungi lo script al documento
      document.head.appendChild(script);

      return () => {
        // Pulizia
        if (window[callbackName]) {
          delete window[callbackName];
        }
        script.remove();
      };
    };

    const cleanup = loadGoogleMapsApi();
    return cleanup;
  }, [apiKey, libraries]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="font-medium">Errore nel caricamento delle API di Google Maps</p>
        <p className="text-sm mt-1">Ricarica la pagina o controlla la tua connessione internet.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-700">Caricamento Google Maps API...</span>
      </div>
    );
  }

  return <>{children}</>;
};

// Aggiungi la dichiarazione globale per TypeScript
declare global {
  interface Window {
    [key: string]: any;
    google: typeof google;
  }
}