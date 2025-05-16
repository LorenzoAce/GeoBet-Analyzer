import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;