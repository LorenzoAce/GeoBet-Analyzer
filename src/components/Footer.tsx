import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            <p>© 2025 GeoBet Analyzer by Acerbo Lorenzo. Tutti i diritti riservati.</p>
            <p className="text-xs mt-1">
              Dati forniti da OpenStreetMap. Beta version.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};