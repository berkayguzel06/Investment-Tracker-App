import React from 'react';
import { Currency, Portfolio } from '../types';
import { calculatePortfolioStats } from '../utils/calculations';
import { formatCurrency } from '../utils/storage';

interface SidebarProps {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  activeView: 'dashboard' | 'portfolios' | 'assets' | 'analytics';
  onViewChange: (view: 'dashboard' | 'portfolios' | 'assets' | 'analytics') => void;
  onPortfolioChange: (portfolioId: string | null) => void;
  currentPortfolio?: Portfolio;
  displayCurrency: Currency;
  exchangeRate: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  portfolios,
  activePortfolioId,
  activeView,
  onViewChange,
  onPortfolioChange,
  currentPortfolio,
  displayCurrency,
  exchangeRate
}) => {
  const menuItems = [
    { key: 'dashboard', label: 'Ana Sayfa', icon: '📊' },
    { key: 'portfolios', label: 'Portföyler', icon: '📁' },
    { key: 'assets', label: 'Varlıklar', icon: '💎' },
    { key: 'analytics', label: 'Analiz', icon: '📈' },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">💰 Yatırım Takip</h1>
        {currentPortfolio && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Aktif Portföy</p>
            <p className="font-semibold text-gray-900">{currentPortfolio.name}</p>
            <p className="text-sm text-primary-600">
              {formatCurrency(
                calculatePortfolioStats(currentPortfolio, displayCurrency, exchangeRate).totalValue,
                displayCurrency
              )}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key as any)}
              className={`sidebar-item w-full text-left ${
                activeView === item.key ? 'active' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Portfolio List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Portföyler</h3>
            <button
              onClick={() => onViewChange('portfolios')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Yönet
            </button>
          </div>
          
          {portfolios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Henüz portföy yok
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {portfolios.map((portfolio) => {
                const stats = calculatePortfolioStats(portfolio, displayCurrency, exchangeRate);
                const isActive = portfolio.id === activePortfolioId;
                
                return (
                  <button
                    key={portfolio.id}
                    onClick={() => onPortfolioChange(portfolio.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isActive
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {portfolio.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(stats.totalValue, displayCurrency)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      stats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
                    }`}>
                      {stats.totalGainLoss >= 0 ? '+' : ''}
                      {formatCurrency(stats.totalGainLoss, displayCurrency)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Yatırım Takip v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 