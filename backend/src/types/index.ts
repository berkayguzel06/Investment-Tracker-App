export type AssetCategory = 'fon' | 'hisse' | 'doviz' | 'kripto' | 'kiymetli_maden';
export type Currency = 'TRY' | 'USD';
export type Theme = 'light' | 'dark';

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  assets?: Asset[];
  sales?: Sale[];
}

export interface Asset {
  id: string;
  portfolio_id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  purchase_price: number;
  purchase_date: string;
  current_price?: number;
  currency: Currency;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  asset_id: string;
  amount: number;
  sale_price: number;
  sale_date: string;
  currency: Currency;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  currency: string;
  language: string;
  theme: Theme;
  usd_to_try_rate: number;
  exchange_rate_updated: string;
  display_currency: Currency;
  created_at: string;
  updated_at: string;
}

export interface CreatePortfolioDto {
  name: string;
  description?: string;
}

export interface UpdatePortfolioDto {
  name?: string;
  description?: string;
}

export interface CreateAssetDto {
  portfolio_id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  purchase_price: number;
  purchase_date: string;
  current_price?: number;
  currency: Currency;
  notes?: string;
}

export interface UpdateAssetDto {
  name?: string;
  category?: AssetCategory;
  amount?: number;
  purchase_price?: number;
  purchase_date?: string;
  current_price?: number;
  currency?: Currency;
  notes?: string;
}

export interface CreateSaleDto {
  asset_id: string;
  amount: number;
  sale_price: number;
  sale_date: string;
  currency: Currency;
  notes?: string;
}

export interface UpdateSettingsDto {
  currency?: string;
  language?: string;
  theme?: Theme;
  usd_to_try_rate?: number;
  display_currency?: Currency;
} 