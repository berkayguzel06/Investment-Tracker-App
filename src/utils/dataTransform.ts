import { Asset, Portfolio, Sale } from '../types';

// Backend'den gelen veriyi frontend formatına dönüştür
export const transformAssetFromBackend = (asset: any): Asset => {
  return {
    id: asset.id,
    portfolio_id: asset.portfolio_id,
    name: asset.name,
    category: asset.category,
    amount: Number(asset.amount),
    purchasePrice: Number(asset.purchase_price),
    purchase_price: Number(asset.purchase_price),
    purchaseDate: asset.purchase_date,
    purchase_date: asset.purchase_date,
    currentPrice: asset.current_price ? Number(asset.current_price) : undefined,
    current_price: asset.current_price ? Number(asset.current_price) : undefined,
    currency: asset.currency,
    notes: asset.notes,
    created_at: asset.created_at,
    updated_at: asset.updated_at
  };
};

export const transformSaleFromBackend = (sale: any): Sale => {
  return {
    id: sale.id,
    assetId: sale.asset_id,
    asset_id: sale.asset_id,
    amount: Number(sale.amount),
    salePrice: Number(sale.sale_price),
    sale_price: Number(sale.sale_price),
    saleDate: sale.sale_date,
    sale_date: sale.sale_date,
    currency: sale.currency,
    notes: sale.notes,
    created_at: sale.created_at,
    updated_at: sale.updated_at
  };
};

export const transformPortfolioFromBackend = (portfolio: any): Portfolio => {
  return {
    id: portfolio.id,
    name: portfolio.name,
    description: portfolio.description,
    createdAt: portfolio.created_at,
    created_at: portfolio.created_at,
    updated_at: portfolio.updated_at,
    assets: portfolio.assets ? portfolio.assets.map(transformAssetFromBackend) : [],
    sales: portfolio.sales ? portfolio.sales.map(transformSaleFromBackend) : []
  };
};

// Backward compatibility için getter fonksiyonları
export const getAssetPurchasePrice = (asset: Asset): number => {
  return asset.purchasePrice || asset.purchase_price || 0;
};

export const getAssetPurchaseDate = (asset: Asset): string => {
  return asset.purchaseDate || asset.purchase_date || '';
};

export const getAssetCurrentPrice = (asset: Asset): number | undefined => {
  return asset.currentPrice || asset.current_price;
};

export const getSalePrice = (sale: Sale): number => {
  return sale.salePrice || sale.sale_price || 0;
};

export const getSaleDate = (sale: Sale): string => {
  return sale.saleDate || sale.sale_date || '';
};

export const getSaleAssetId = (sale: Sale): string => {
  return sale.assetId || sale.asset_id || '';
};

export const getPortfolioCreatedAt = (portfolio: Portfolio): string => {
  return portfolio.createdAt || portfolio.created_at || '';
}; 