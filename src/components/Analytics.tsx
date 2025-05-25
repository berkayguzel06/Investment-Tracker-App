import React, { useState } from 'react';
import { Currency, Portfolio } from '../types';
import { calculatePortfolioStats, generateChartData, generatePieChartData, getPortfolioValueHistory } from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/storage';

interface AnalyticsProps {
  portfolio: Portfolio;
  displayCurrency: Currency;
  exchangeRate: number;
}

const Analytics: React.FC<AnalyticsProps> = ({ portfolio, displayCurrency, exchangeRate }) => {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90 | 365>(30);
  
  const stats = calculatePortfolioStats(portfolio, displayCurrency, exchangeRate);
  const history = getPortfolioValueHistory(portfolio, timeRange, displayCurrency, exchangeRate);
  const chartData = generateChartData(history, 'Portföy Değeri');
  const pieData = generatePieChartData(stats);

  const timeRanges = [
    { value: 7, label: '7 Gün' },
    { value: 30, label: '30 Gün' },
    { value: 90, label: '90 Gün' },
    { value: 365, label: '1 Yıl' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analiz ve Raporlar</h1>
        <p className="text-gray-600">
          {portfolio.name} portföyünüzün detaylı analizini görüntüleyin
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Değer</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue, displayCurrency)}
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
                {formatCurrency(stats.totalInvestment, displayCurrency)}
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
              <p className="text-sm text-gray-600">Net Kazanç/Zarar</p>
              <p className={`text-2xl font-bold ${
                stats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
              }`}>
                {formatCurrency(stats.totalGainLoss, displayCurrency)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              stats.totalGainLoss >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <span className={`text-xl ${
                stats.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {stats.totalGainLoss >= 0 ? '📈' : '📉'}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-sm ${
              stats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'
            }`}>
              {formatPercentage(stats.totalGainLossPercentage)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Varlık Sayısı</p>
              <p className="text-2xl font-bold text-gray-900">{portfolio.assets.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-orange-600 text-xl">💎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Portföy Performansı</h2>
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as any)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeRange === range.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">
                Son {timeRange} günlük performans grafiği
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Chart.js ile grafikler geliştirilecek
              </p>
            </div>
          </div>
        </div>

        {/* Asset Distribution Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Varlık Dağılımı</h2>
          
          {/* Mock Pie Chart Area */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🥧</div>
              <p className="text-gray-600">Varlık dağılım grafiği</p>
              <p className="text-sm text-gray-500 mt-2">
                Chart.js ile pasta grafiği geliştirilecek
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Asset Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Varlık Bazlı Analiz</h2>
        
        {portfolio.assets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Varlık
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Ağırlık
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Değer ({displayCurrency === 'TRY' ? '₺' : '$'})
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Kazanç/Zarar
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Getiri Oranı
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolio.assets.map((asset) => {
                  // Varlığın kendi para birimindeki değerleri
                  const currentValueInAssetCurrency = (asset.currentPrice || asset.purchasePrice) * asset.amount;
                  const originalValueInAssetCurrency = asset.purchasePrice * asset.amount;
                  
                  // Display currency'ye çevrilmiş değerler
                  const currentValue = currentValueInAssetCurrency;
                  if (asset.currency !== displayCurrency) {
                    // Burada currency conversion yapılacak
                  }
                  
                  const gainLossInAssetCurrency = currentValueInAssetCurrency - originalValueInAssetCurrency;
                  const returnPercentage = originalValueInAssetCurrency > 0 ? (gainLossInAssetCurrency / originalValueInAssetCurrency) * 100 : 0;
                  const weight = stats.totalValue > 0 ? (currentValueInAssetCurrency / stats.totalValue) * 100 : 0;
                  
                  return (
                    <tr key={asset.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">
                          {getCategoryName(asset.category)} • {asset.currency}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {weight.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(currentValueInAssetCurrency, asset.currency)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        gainLossInAssetCurrency >= 0 ? 'gain-positive' : 'gain-negative'
                      }`}>
                        {formatCurrency(gainLossInAssetCurrency, asset.currency)}
                      </td>
                      <td className={`py-3 px-4 text-right ${
                        returnPercentage >= 0 ? 'gain-positive' : 'gain-negative'
                      }`}>
                        {formatPercentage(returnPercentage)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600">Analiz için varlık bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Category Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategori Bazlı Analiz</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.assetDistribution)
            .filter(([_, data]) => data.value > 0)
            .map(([category, data]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {getCategoryName(category)}
                  </h3>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  ></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Değer:</span>
                    <span className="font-medium">{formatCurrency(data.value, displayCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ağırlık:</span>
                    <span className="font-medium">{data.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Varlık Sayısı:</span>
                    <span className="font-medium">
                      {portfolio.assets.filter(a => a.category === category).length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Analizi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Diversifikasyon</h3>
            <p className="text-sm text-gray-600">
              {Object.keys(stats.assetDistribution).filter(cat => stats.assetDistribution[cat as keyof typeof stats.assetDistribution].value > 0).length} kategori
            </p>
            <p className="text-sm text-gray-600">
              {portfolio.assets.length} farklı varlık
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">Volatilite</h3>
            <p className="text-sm text-gray-600">Düşük Risk</p>
            <p className="text-xs text-gray-500">
              Gerçek volatilite hesaplaması geliştirilecek
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Performans Skoru</h3>
            <p className={`text-sm ${stats.totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'}`}>
              {stats.totalGainLoss >= 0 ? 'İyi' : 'Kötü'}
            </p>
            <p className="text-xs text-gray-500">
              {formatPercentage(stats.totalGainLossPercentage)} getiri
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
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

export default Analytics; 