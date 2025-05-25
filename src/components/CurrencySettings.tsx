import React, { useState } from 'react';
import { CURRENCIES, Currency } from '../types';

interface CurrencySettingsProps {
  exchangeRate: number;
  displayCurrency: Currency;
  lastUpdated: string;
  onUpdateExchangeRate: (rate: number) => void;
  onChangeDisplayCurrency: (currency: Currency) => void;
}

const CurrencySettings: React.FC<CurrencySettingsProps> = ({
  exchangeRate,
  displayCurrency,
  lastUpdated,
  onUpdateExchangeRate,
  onChangeDisplayCurrency
}) => {
  const [newRate, setNewRate] = useState(exchangeRate.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveRate = () => {
    const rate = parseFloat(newRate);
    if (rate > 0) {
      onUpdateExchangeRate(rate);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewRate(exchangeRate.toString());
    setIsEditing(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Sol taraf - Döviz Kuru */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">💱 USD/TRY:</span>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  onClick={handleSaveRate}
                  className="px-2 py-1 bg-success-500 text-white text-xs rounded hover:bg-success-600"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-bold text-primary-600">
                  {exchangeRate.toFixed(2)} ₺
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                  title="Kuru düzenle"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Son güncelleme: {new Date(lastUpdated).toLocaleString('tr-TR')}
          </div>
        </div>

        {/* Sağ taraf - Display Currency Switch */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Görüntüle:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {Object.entries(CURRENCIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onChangeDisplayCurrency(key as Currency)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  displayCurrency === key
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {key === 'TRY' ? '₺ TL' : '$ USD'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hızlı kur güncellemesi ipuçları */}
      {isEditing && (
        <div className="mt-2 text-xs text-gray-500">
          💡 İpucu: Güncel USD/TRY kurunu finansal sitelerden kontrol edebilirsiniz
        </div>
      )}
    </div>
  );
};

export default CurrencySettings; 