import React from 'react';
import { Currency, Portfolio } from '../types';
import { calculatePortfolioStats } from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/storage';

interface DashboardProps {
  portfolios: Portfolio[];
  currentPortfolio?: Portfolio;
  displayCurrency: Currency;
  exchangeRate: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  portfolios, 
  currentPortfolio, 
  displayCurrency, 
  exchangeRate 
}) => {
  // Genel istatistikleri hesapla
  const totalStats = portfolios.reduce(
    (acc, portfolio) => {
      const stats = calculatePortfolioStats(portfolio, displayCurrency, exchangeRate);
      return {
        totalValue: acc.totalValue + stats.totalValue,
        totalInvestment: acc.totalInvestment + stats.totalInvestment,
        totalGainLoss: acc.totalGainLoss + stats.totalGainLoss,
      };
    },
    { totalValue: 0, totalInvestment: 0, totalGainLoss: 0 }
  );

  const totalGainLossPercentage = totalStats.totalInvestment > 0 
    ? (totalStats.totalGainLoss / totalStats.totalInvestment) * 100 
    : 0;

  const currentStats = currentPortfolio ? 
    calculatePortfolioStats(currentPortfolio, displayCurrency, exchangeRate) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa</h1>
        <p className="text-gray-600">Yatırım portföyünüzün genel durumu</p>
      </div>

      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Değer</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalStats.totalValue, displayCurrency)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <span className="text-primary-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Yatırım</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalStats.totalInvestment, displayCurrency)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kazanç/Zarar</p>
              <p className={`text-2xl font-bold ${
                totalStats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
              }`}>
                {formatCurrency(totalStats.totalGainLoss, displayCurrency)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              totalStats.totalGainLoss >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <span className={`text-xl ${
                totalStats.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {totalStats.totalGainLoss >= 0 ? '📈' : '📉'}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${
              totalStats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
            }`}>
              {formatPercentage(totalGainLossPercentage)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Portföy Sayısı</p>
              <p className="text-2xl font-bold text-gray-900">{portfolios.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-xl">📁</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aktif Portföy Detayları */}
      {currentPortfolio && currentStats && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Aktif Portföy: {currentPortfolio.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Portföy Değeri</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(currentStats.totalValue, displayCurrency)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Yatırım Tutarı</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(currentStats.totalInvestment, displayCurrency)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Net Kazanç</p>
              <p className={`text-xl font-bold ${
                currentStats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
              }`}>
                {formatCurrency(currentStats.totalGainLoss, displayCurrency)}
              </p>
              <p className={`text-sm ${
                currentStats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
              }`}>
                {formatPercentage(currentStats.totalGainLossPercentage)}
              </p>
            </div>
          </div>

          {/* Varlık Dağılımı */}
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Varlık Dağılımı</h3>
            <div className="space-y-2">
              {Object.entries(currentStats.assetDistribution)
                .filter(([_, data]) => data.value > 0)
                .map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: getCategoryColor(category) }}
                      ></div>
                      <span className="text-sm text-gray-700">
                        {getCategoryName(category)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(data.value, displayCurrency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {data.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Portföy Listesi */}
      {portfolios.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tüm Portföyler</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Portföy Adı
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Değer
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Yatırım
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Kazanç/Zarar
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Oran
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((portfolio) => {
                  const stats = calculatePortfolioStats(portfolio, displayCurrency, exchangeRate);
                  return (
                    <tr key={portfolio.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{portfolio.name}</div>
                        {portfolio.description && (
                          <div className="text-sm text-gray-500">{portfolio.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(stats.totalValue, displayCurrency)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {formatCurrency(stats.totalInvestment, displayCurrency)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        stats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
                      }`}>
                        {formatCurrency(stats.totalGainLoss, displayCurrency)}
                      </td>
                      <td className={`py-3 px-4 text-right ${
                        stats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
                      }`}>
                        {formatPercentage(stats.totalGainLossPercentage)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Boş durum */}
      {portfolios.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz portföy bulunmuyor
          </h3>
          <p className="text-gray-600 mb-6">
            İlk portföyünüzü oluşturarak yatırım takibinize başlayın
          </p>
          <button className="btn-primary">
            Portföy Oluştur
          </button>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    fon: '#3b82f6',
    hisse: '#22c55e',
    doviz: '#f59e0b',
    kripto: '#8b5cf6',
    kiymetli_maden: '#ef4444'
  };
  return colors[category] || '#6b7280';
};

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    fon: 'Fon',
    hisse: 'Hisse',
    doviz: 'Döviz',
    kripto: 'Kripto',
    kiymetli_maden: 'Kıymetli Maden'
  };
  return names[category] || category;
};

export default Dashboard; 