import { Asset, AssetCategory, Currency, Portfolio, Sale } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Portfolio API methods
  async getPortfolios(): Promise<Portfolio[]> {
    return this.request<Portfolio[]>('/portfolios');
  }

  async getPortfolio(id: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`);
  }

  async getPortfolioWithAssets(id: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}/details`);
  }

  async createPortfolio(data: { name: string; description?: string }): Promise<Portfolio> {
    return this.request<Portfolio>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(id: string, data: { name?: string; description?: string }): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id: string): Promise<void> {
    return this.request<void>(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  // Asset API methods
  async getAssets(): Promise<Asset[]> {
    return this.request<Asset[]>('/assets');
  }

  async getAssetsByPortfolio(portfolioId: string): Promise<Asset[]> {
    return this.request<Asset[]>(`/assets/portfolio/${portfolioId}`);
  }

  async getAsset(id: string): Promise<Asset> {
    return this.request<Asset>(`/assets/${id}`);
  }

  async createAsset(data: {
    portfolio_id: string;
    name: string;
    category: AssetCategory;
    amount: number;
    purchase_price: number;
    purchase_date: string;
    current_price?: number;
    currency: Currency;
    notes?: string;
  }): Promise<Asset> {
    return this.request<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAsset(id: string, data: {
    name?: string;
    category?: AssetCategory;
    amount?: number;
    purchase_price?: number;
    purchase_date?: string;
    current_price?: number;
    currency?: Currency;
    notes?: string;
  }): Promise<Asset> {
    return this.request<Asset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateAssetPrice(id: string, currentPrice: number): Promise<Asset> {
    return this.request<Asset>(`/assets/${id}/price`, {
      method: 'PUT',
      body: JSON.stringify({ currentPrice }),
    });
  }

  async deleteAsset(id: string): Promise<void> {
    return this.request<void>(`/assets/${id}`, {
      method: 'DELETE',
    });
  }

  // Sale API methods
  async getSales(): Promise<Sale[]> {
    return this.request<Sale[]>('/sales');
  }

  async getSalesByAsset(assetId: string): Promise<Sale[]> {
    return this.request<Sale[]>(`/sales/asset/${assetId}`);
  }

  async getSalesByPortfolio(portfolioId: string): Promise<Sale[]> {
    return this.request<Sale[]>(`/sales/portfolio/${portfolioId}`);
  }

  async createSale(data: {
    asset_id: string;
    amount: number;
    sale_price: number;
    sale_date: string;
    currency: Currency;
    notes?: string;
  }): Promise<Sale> {
    return this.request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSale(id: string): Promise<void> {
    return this.request<void>(`/sales/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings API methods
  async getSettings(): Promise<any> {
    return this.request<any>('/settings');
  }

  async updateSettings(data: {
    currency?: string;
    language?: string;
    theme?: 'light' | 'dark';
    usd_to_try_rate?: number;
    display_currency?: Currency;
  }): Promise<any> {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateExchangeRate(rate: number): Promise<any> {
    return this.request<any>('/settings/exchange-rate', {
      method: 'PUT',
      body: JSON.stringify({ rate }),
    });
  }
}

export const apiService = new ApiService(); 