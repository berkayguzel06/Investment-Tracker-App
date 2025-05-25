import { useEffect, useState } from 'react';
import Analytics from './components/Analytics';
import AssetManager from './components/AssetManager';
import CurrencySettings from './components/CurrencySettings';
import Dashboard from './components/Dashboard';
import PortfolioManager from './components/PortfolioManager';
import Sidebar from './components/Sidebar';
import './index.css';
import { AppState, Currency, Portfolio } from './types';
import { defaultAppState, loadAppState, saveAppState } from './utils/storage';

type ActiveView = 'dashboard' | 'portfolios' | 'assets' | 'analytics';

function App() {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Uygulama başlatıldığında veriyi yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const state = await loadAppState();
        setAppState(state);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        // Hata durumunda default state kullan
        setAppState(defaultAppState);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Durum değiştiğinde kaydet
  useEffect(() => {
    if (!isLoading) {
      saveAppState(appState);
    }
  }, [appState, isLoading]);

  const currentPortfolio = appState.portfolios.find(p => p.id === appState.activePortfolioId);

  const updateAppState = (newState: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...newState }));
  };

  const updateExchangeRate = (rate: number) => {
    setAppState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        exchangeRates: {
          USD_TO_TRY: rate,
          lastUpdated: new Date().toISOString()
        }
      }
    }));
  };

  const changeDisplayCurrency = (currency: Currency) => {
    setAppState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        displayCurrency: currency
      }
    }));
  };

  const createPortfolio = (portfolio: Portfolio) => {
    setAppState(prev => ({
      ...prev,
      portfolios: [...prev.portfolios, portfolio],
      activePortfolioId: portfolio.id
    }));
  };

  const updatePortfolio = (portfolioId: string, updates: Partial<Portfolio>) => {
    setAppState(prev => ({
      ...prev,
      portfolios: prev.portfolios.map(p => 
        p.id === portfolioId ? { ...p, ...updates } : p
      )
    }));
  };

  const deletePortfolio = (portfolioId: string) => {
    setAppState(prev => {
      const newPortfolios = prev.portfolios.filter(p => p.id !== portfolioId);
      return {
        ...prev,
        portfolios: newPortfolios,
        activePortfolioId: newPortfolios.length > 0 ? newPortfolios[0].id : null
      };
    });
  };

  const setActivePortfolio = (portfolioId: string | null) => {
    setAppState(prev => ({ ...prev, activePortfolioId: portfolioId }));
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            portfolios={appState.portfolios}
            currentPortfolio={currentPortfolio}
            displayCurrency={appState.settings.displayCurrency}
            exchangeRate={appState.settings.exchangeRates.USD_TO_TRY}
          />
        );
      case 'portfolios':
        return (
          <PortfolioManager
            portfolios={appState.portfolios}
            activePortfolioId={appState.activePortfolioId}
            onCreatePortfolio={createPortfolio}
            onUpdatePortfolio={updatePortfolio}
            onDeletePortfolio={deletePortfolio}
            onSetActivePortfolio={setActivePortfolio}
          />
        );
      case 'assets':
        return currentPortfolio ? (
          <AssetManager
            portfolio={currentPortfolio}
            onUpdatePortfolio={(updates) => updatePortfolio(currentPortfolio.id, updates)}
            displayCurrency={appState.settings.displayCurrency}
            exchangeRate={appState.settings.exchangeRates.USD_TO_TRY}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Önce bir portföy seçin veya oluşturun</p>
          </div>
        );
      case 'analytics':
        return currentPortfolio ? (
          <Analytics
            portfolio={currentPortfolio}
            displayCurrency={appState.settings.displayCurrency}
            exchangeRate={appState.settings.exchangeRates.USD_TO_TRY}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Önce bir portföy seçin veya oluşturun</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        portfolios={appState.portfolios}
        activePortfolioId={appState.activePortfolioId}
        activeView={activeView}
        onViewChange={setActiveView}
        onPortfolioChange={setActivePortfolio}
        currentPortfolio={currentPortfolio}
        displayCurrency={appState.settings.displayCurrency}
        exchangeRate={appState.settings.exchangeRates.USD_TO_TRY}
      />
      
      <main className="flex-1 overflow-auto">
        {/* Currency Settings Bar */}
        <CurrencySettings
          exchangeRate={appState.settings.exchangeRates.USD_TO_TRY}
          displayCurrency={appState.settings.displayCurrency}
          lastUpdated={appState.settings.exchangeRates.lastUpdated}
          onUpdateExchangeRate={updateExchangeRate}
          onChangeDisplayCurrency={changeDisplayCurrency}
        />
        
        <div className="p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

export default App; 