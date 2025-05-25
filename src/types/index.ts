export type AssetCategory = 'fon' | 'hisse' | 'doviz' | 'kripto' | 'kiymetli_maden';
export type Currency = 'TRY' | 'USD';

export interface Asset {
  id: string;
  portfolio_id?: string;
  name: string;
  category: AssetCategory;
  amount: number;
  purchasePrice?: number; // Backward compatibility
  purchase_price?: number; // Backend format
  purchaseDate?: string; // Backward compatibility
  purchase_date?: string; // Backend format
  currentPrice?: number; // Backward compatibility
  current_price?: number; // Backend format
  currency: Currency;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  assetId?: string; // Backward compatibility
  asset_id?: string; // Backend format
  amount: number;
  salePrice?: number; // Backward compatibility
  sale_price?: number; // Backend format
  saleDate?: string; // Backward compatibility
  sale_date?: string; // Backend format
  currency: Currency;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  createdAt?: string; // Backward compatibility
  created_at?: string; // Backend format
  updated_at?: string;
  assets?: Asset[];
  sales?: Sale[];
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