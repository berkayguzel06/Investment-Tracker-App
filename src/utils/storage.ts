import { apiService } from '../services/api';
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

// Backend'den veri yükleme
export const loadAppState = async (): Promise<AppState> => {
  try {
    // Backend'den portfolyoları ve ayarları çek
    const [portfolios, settings] = await Promise.all([
      apiService.getPortfolios(),
      apiService.getSettings().catch(() => null)
    ]);

    // LocalStorage'dan aktif portfolyo ID'sini al
    const localData = localStorage.getItem(STORAGE_KEY);
    let activePortfolioId = null;
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        activePortfolioId = parsed.activePortfolioId;
      } catch (error) {
        console.error('LocalStorage verisi okunamadı:', error);
      }
    }

    return {
      portfolios: portfolios || [],
      activePortfolioId,
      settings: settings ? {
        currency: settings.currency || 'TRY',
        language: settings.language || 'tr',
        theme: settings.theme || 'light',
        exchangeRates: {
          USD_TO_TRY: settings.usd_to_try_rate || 34.50,
          lastUpdated: settings.exchange_rate_updated || new Date().toISOString()
        },
        displayCurrency: settings.display_currency || 'TRY'
      } : defaultAppState.settings
    };
  } catch (error) {
    console.error('Backend\'den veri yüklenirken hata:', error);
    // Fallback olarak localStorage'dan yükle
    return loadAppStateFromLocalStorage();
  }
};

// LocalStorage'dan veri yükleme (fallback)
export const loadAppStateFromLocalStorage = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
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
    console.error('LocalStorage\'dan veri yüklenirken hata:', error);
  }
  return defaultAppState;
};

// Sadece aktif portfolyo ID'sini localStorage'a kaydet
export const saveAppState = (state: AppState): void => {
  try {
    // Sadece aktif portfolyo ID'sini localStorage'a kaydet
    const dataToSave = {
      activePortfolioId: state.activePortfolioId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
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

// Backend API kullanarak portfolyo oluşturma
export const createPortfolio = async (name: string, description?: string): Promise<Portfolio> => {
  try {
    return await apiService.createPortfolio({ name, description });
  } catch (error) {
    console.error('Portfolyo oluşturulurken hata:', error);
    throw error;
  }
};

// Backend API kullanarak varlık oluşturma
export const createAsset = async (
  portfolioId: string,
  name: string,
  category: any,
  amount: number,
  purchasePrice: number,
  purchaseDate: string,
  currency: Currency,
  notes?: string
): Promise<Asset> => {
  try {
    return await apiService.createAsset({
      portfolio_id: portfolioId,
      name,
      category,
      amount,
      purchase_price: purchasePrice,
      purchase_date: purchaseDate,
      currency,
      notes
    });
  } catch (error) {
    console.error('Varlık oluşturulurken hata:', error);
    throw error;
  }
};

// Backend API kullanarak satış oluşturma
export const createSale = async (
  assetId: string,
  amount: number,
  salePrice: number,
  saleDate: string,
  currency: Currency,
  notes?: string
): Promise<Sale> => {
  try {
    return await apiService.createSale({
      asset_id: assetId,
      amount,
      sale_price: salePrice,
      sale_date: saleDate,
      currency,
      notes
    });
  } catch (error) {
    console.error('Satış oluşturulurken hata:', error);
    throw error;
  }
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