import { Asset, AssetCategory, CATEGORY_COLORS, Currency, Portfolio, PortfolioStats } from '../types';
import { convertCurrency } from './storage';

export const calculatePortfolioStats = (
  portfolio: Portfolio, 
  displayCurrency: Currency, 
  exchangeRate: number
): PortfolioStats => {
  let totalValue = 0;
  let totalInvestment = 0;
  
  const assetDistribution: PortfolioStats['assetDistribution'] = {
    fon: { value: 0, percentage: 0 },
    hisse: { value: 0, percentage: 0 },
    doviz: { value: 0, percentage: 0 },
    kripto: { value: 0, percentage: 0 },
    kiymetli_maden: { value: 0, percentage: 0 }
  };
  // Aktif varlıkları hesapla
  portfolio.assets?.forEach(asset => {
    const currentPrice = asset.currentPrice ?? asset.purchasePrice;
    
    // Varlık para birimi ile değerleri hesapla
    const currentValueInAssetCurrency = (currentPrice ?? 0) * asset.amount;
    const investmentValueInAssetCurrency = (asset.purchasePrice ?? 0) * asset.amount;
    
    // Display currency'ye çevir
    const currentValue = convertCurrency(
      currentValueInAssetCurrency, 
      asset.currency, 
      displayCurrency, 
      exchangeRate
    );
    const investmentValue = convertCurrency(
      investmentValueInAssetCurrency, 
      asset.currency, 
      displayCurrency, 
      exchangeRate
    );
    
    totalValue += currentValue;
    totalInvestment += investmentValue;
    
    assetDistribution[asset.category].value += currentValue;
  });

  // Satılan varlıklardan gelen kazançları hesapla
  portfolio.sales?.forEach(sale => {
    const asset = portfolio.assets?.find(a => a.id === sale.assetId);
    if (asset) {
      const saleValueInSaleCurrency = (sale.salePrice ?? 0) * sale.amount;
      const originalInvestmentInAssetCurrency = (asset.purchasePrice ?? 0) * sale.amount;
      // Her ikisini de display currency'ye çevir
      const saleValue = convertCurrency(
        saleValueInSaleCurrency, 
        sale.currency, 
        displayCurrency, 
        exchangeRate
      );
      const originalInvestment = convertCurrency(
        originalInvestmentInAssetCurrency, 
        asset.currency, 
        displayCurrency, 
        exchangeRate
      );
      
      totalValue += saleValue - originalInvestment; // Net kazanç/zarar
    }
  });

  // Yüzdelikleri hesapla
  Object.keys(assetDistribution).forEach(category => {
    const cat = category as AssetCategory;
    if (totalValue > 0) {
      assetDistribution[cat].percentage = (assetDistribution[cat].value / totalValue) * 100;
    }
  });

  const totalGainLoss = totalValue - totalInvestment;
  const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  return {
    totalValue,
    totalInvestment,
    totalGainLoss,
    totalGainLossPercentage,
    assetDistribution
  };
};

export const calculateAssetValue = (
  asset: Asset, 
  displayCurrency: Currency, 
  exchangeRate: number
): number => {
  const valueInAssetCurrency = (asset.currentPrice ?? asset.purchasePrice ?? 0) * asset.amount;
  return convertCurrency(valueInAssetCurrency, asset.currency, displayCurrency, exchangeRate);
};

export const calculateAssetGainLoss = (
  asset: Asset, 
  displayCurrency: Currency, 
  exchangeRate: number
): { amount: number; percentage: number } => {
  const currentValueInAssetCurrency = (asset.currentPrice ?? asset.purchasePrice ?? 0) * asset.amount;
  const originalValueInAssetCurrency = (asset.purchasePrice ?? 0) * asset.amount;
  
  const currentValue = convertCurrency(
    currentValueInAssetCurrency, 
    asset.currency, 
    displayCurrency, 
    exchangeRate
  );
  const originalValue = convertCurrency(
    originalValueInAssetCurrency, 
    asset.currency, 
    displayCurrency, 
    exchangeRate
  );
  
  const gainLoss = currentValue - originalValue;
  const percentage = originalValue > 0 ? (gainLoss / originalValue) * 100 : 0;
  
  return { amount: gainLoss, percentage };
};

export const getPortfolioValueHistory = (
  portfolio: Portfolio, 
  days: number = 30,
  displayCurrency: Currency,
  exchangeRate: number
): { date: string; value: number }[] => {
  // Bu fonksiyon gerçek bir uygulamada dış kaynaklardan veri çekecek
  // Şimdilik mock data oluşturalım
  const history: { date: string; value: number }[] = [];
  const currentStats = calculatePortfolioStats(portfolio, displayCurrency, exchangeRate);
  const currentValue = currentStats.totalValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Rastgele değişim simülasyonu (-2% ile +2% arası)
    const randomChange = (Math.random() - 0.5) * 0.04;
    const value = currentValue * (1 + (randomChange * i / days));
    
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value)
    });
  }
  
  return history;
};

export const generateChartData = (data: { date: string; value: number }[], label: string) => {
  return {
    labels: data.map(d => new Date(d.date).toLocaleDateString('tr-TR', { 
      month: 'short', 
      day: 'numeric' 
    })),
    datasets: [{
      label,
      data: data.map(d => d.value),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
};

export const generatePieChartData = (stats: PortfolioStats) => {
  const categories = Object.keys(stats.assetDistribution) as AssetCategory[];
  const data = categories
    .filter(cat => stats.assetDistribution[cat].value > 0)
    .map(cat => ({
      label: getCategoryName(cat),
      value: stats.assetDistribution[cat].value,
      percentage: stats.assetDistribution[cat].percentage,
      color: CATEGORY_COLORS[cat]
    }));

  return {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: data.map(d => d.color),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
};

const getCategoryName = (category: AssetCategory): string => {
  const names: Record<AssetCategory, string> = {
    fon: 'Fon',
    hisse: 'Hisse',
    doviz: 'Döviz',
    kripto: 'Kripto',
    kiymetli_maden: 'Kıymetli Maden'
  };
  return names[category];
};

export const calculateTotalSalesProfit = (
  portfolio: Portfolio, 
  displayCurrency: Currency, 
  exchangeRate: number
): number => {
  return portfolio.sales?.reduce((total, sale) => {
    const asset = portfolio.assets?.find(a => a.id === sale.assetId);
    if (asset?.purchasePrice && sale?.salePrice) {
      const saleValueInSaleCurrency = sale.salePrice * sale.amount;
      const originalValueInAssetCurrency = asset.purchasePrice * sale.amount;
      
      const saleValue = convertCurrency(
        saleValueInSaleCurrency, 
        sale.currency, 
        displayCurrency, 
        exchangeRate
      );
      const originalValue = convertCurrency(
        originalValueInAssetCurrency, 
        asset.currency, 
        displayCurrency, 
        exchangeRate
      );
      
      return total + (saleValue - originalValue);
    }
    return total;
  }, 0) || 0;
}; 