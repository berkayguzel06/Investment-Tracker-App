import { AppState, Asset, Currency, Portfolio, Sale } from '../types';

const STORAGE_KEY = 'investment-tracker-data';

export const defaultAppState: AppState = {
  portfolios: [],
  activePortfolioId: null,
  settings: {
    currency: 'TRY',
    language: 'tr',
    theme: 'light',
    exchangeRates: {
      USD_TO_TRY: 34.50, // Varsayılan dolar kuru
      lastUpdated: new Date().toISOString()
    },
    displayCurrency: 'TRY'
  }
};

export const loadAppState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Eski veriler için varsayılan değerleri ekle
      return { 
        ...defaultAppState, 
        ...parsed,
        settings: {
          ...defaultAppState.settings,
          ...parsed.settings
        }
      };
    }
  } catch (error) {
    console.error('Veri yüklenirken hata:', error);
  }
  return defaultAppState;
};

export const saveAppState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Veri kaydedilirken hata:', error);
  }
};

export const exportData = (): string => {
  const state = loadAppState();
  return JSON.stringify(state, null, 2);
};

export const importData = (jsonData: string): AppState => {
  try {
    const parsed = JSON.parse(jsonData);
    return { ...defaultAppState, ...parsed };
  } catch (error) {
    throw new Error('Geçersiz veri formatı');
  }
};

export const createPortfolio = (name: string, description?: string): Portfolio => {
  return {
    id: generateId(),
    name,
    description,
    createdAt: new Date().toISOString(),
    assets: [],
    sales: []
  };
};

export const createAsset = (
  name: string,
  category: any,
  amount: number,
  purchasePrice: number,
  purchaseDate: string,
  currency: Currency,
  notes?: string
): Asset => {
  return {
    id: generateId(),
    name,
    category,
    amount,
    purchasePrice,
    purchaseDate,
    currency,
    notes
  };
};

export const createSale = (
  assetId: string,
  amount: number,
  salePrice: number,
  saleDate: string,
  currency: Currency,
  notes?: string
): Sale => {
  return {
    id: generateId(),
    assetId,
    amount,
    salePrice,
    saleDate,
    currency,
    notes
  };
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Döviz kuru çeviri fonksiyonları
export const convertCurrency = (
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency, 
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'TRY') {
    return amount * exchangeRate;
  }
  
  if (fromCurrency === 'TRY' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  
  return amount;
};

export const formatCurrency = (
  amount: number, 
  currency: Currency = 'TRY', 
  locale: string = 'tr-TR'
): string => {
  const symbols: Record<Currency, string> = {
    TRY: '₺',
    USD: '$'
  };

  const symbol = symbols[currency];
  return `${amount.toLocaleString(locale, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })} ${symbol}`;
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
}; 