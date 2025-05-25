export type AssetCategory = 'fon' | 'hisse' | 'doviz' | 'kripto' | 'kiymetli_maden';
export type Currency = 'TRY' | 'USD';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice?: number;
  currency: Currency;
  notes?: string;
}

export interface Sale {
  id: string;
  assetId: string;
  amount: number;
  salePrice: number;
  saleDate: string;
  currency: Currency;
  notes?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  assets: Asset[];
  sales: Sale[];
}

export interface AppState {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  settings: {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
    exchangeRates: {
      USD_TO_TRY: number;
      lastUpdated: string;
    };
    displayCurrency: Currency;
  };
}

export interface PriceData {
  date: string;
  value: number;
}

export interface PortfolioStats {
  totalValue: number;
  totalInvestment: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  assetDistribution: {
    [key in AssetCategory]: {
      value: number;
      percentage: number;
    };
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export const ASSET_CATEGORIES: Record<AssetCategory, string> = {
  fon: 'Fon',
  hisse: 'Hisse Senedi',
  doviz: 'Döviz',
  kripto: 'Kripto Para',
  kiymetli_maden: 'Kıymetli Maden'
};

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  fon: '#3b82f6',
  hisse: '#22c55e',
  doviz: '#f59e0b',
  kripto: '#8b5cf6',
  kiymetli_maden: '#ef4444'
};

export const CURRENCIES: Record<Currency, string> = {
  TRY: '₺ Türk Lirası',
  USD: '$ Amerikan Doları'
}; 