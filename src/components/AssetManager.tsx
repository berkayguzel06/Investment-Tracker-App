import React, { useState } from 'react';
import { Asset, ASSET_CATEGORIES, AssetCategory, CURRENCIES, Currency, Portfolio } from '../types';
import { calculateAssetGainLoss, calculateAssetValue } from '../utils/calculations';
import { createAsset, createSale, formatCurrency, formatDate } from '../utils/storage';

interface AssetManagerProps {
  portfolio: Portfolio;
  onUpdatePortfolio: (updates: Partial<Portfolio>) => void;
  displayCurrency: Currency;
  exchangeRate: number;
}

const AssetManager: React.FC<AssetManagerProps> = ({ 
  portfolio, 
  onUpdatePortfolio, 
  displayCurrency, 
  exchangeRate 
}) => {
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Form state
  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'hisse' as AssetCategory,
    amount: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    currentPrice: '',
    currency: 'TRY' as Currency,
    notes: ''
  });

  const [saleForm, setSaleForm] = useState({
    amount: '',
    salePrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    currency: 'TRY' as Currency,
    notes: ''
  });

  const resetAssetForm = () => {
    setAssetForm({
      name: '',
      category: 'hisse',
      amount: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      currentPrice: '',
      currency: 'TRY',
      notes: ''
    });
  };

  const resetSaleForm = () => {
    setSaleForm({
      amount: '',
      salePrice: '',
      saleDate: new Date().toISOString().split('T')[0],
      currency: 'TRY',
      notes: ''
    });
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assetForm.name && assetForm.amount && assetForm.purchasePrice) {
      try {
        const newAsset = await createAsset(
          portfolio.id,
          assetForm.name,
          assetForm.category,
          Number(assetForm.amount),
          Number(assetForm.purchasePrice),
          assetForm.purchaseDate,
          assetForm.currency,
          assetForm.notes
        );
        
        if (assetForm.currentPrice) {
          // Update current price via API if provided
          // This would need an API call to update the asset
        }

        onUpdatePortfolio({
          assets: [...(portfolio.assets || []), newAsset]
        });

        resetAssetForm();
        setShowAddAssetForm(false);
      } catch (error) {
        console.error('Varlık eklenirken hata:', error);
        alert('Varlık eklenirken bir hata oluştu');
      }
    }
  };

  const handleUpdateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset && assetForm.name && assetForm.amount && assetForm.purchasePrice) {
      const updatedAsset: Asset = {
        ...editingAsset,
        name: assetForm.name,
        category: assetForm.category,
        amount: parseFloat(assetForm.amount),
        purchasePrice: parseFloat(assetForm.purchasePrice),
        purchaseDate: assetForm.purchaseDate,
        currentPrice: assetForm.currentPrice ? parseFloat(assetForm.currentPrice) : undefined,
        currency: assetForm.currency,
        notes: assetForm.notes
      };

      onUpdatePortfolio({
        assets: (portfolio.assets || []).map(asset => 
          asset.id === editingAsset.id ? updatedAsset : asset
        )
      });

      resetAssetForm();
      setEditingAsset(null);
    }
  };

  const handleSaleAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showSaleForm && saleForm.amount && saleForm.salePrice) {
      try {
        const newSale = await createSale(
          showSaleForm,
          parseFloat(saleForm.amount),
          parseFloat(saleForm.salePrice),
          saleForm.saleDate,
          saleForm.currency,
          saleForm.notes
        );

        onUpdatePortfolio({
          sales: [...(portfolio.sales || []), newSale]
        });

        resetSaleForm();
        setShowSaleForm(null);
      } catch (error) {
        console.error('Satış kaydedilirken hata:', error);
        alert('Satış kaydedilirken bir hata oluştu');
      }
    }
  };

  const startEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      category: asset.category,
      amount: asset.amount.toString(),
      purchasePrice: asset.purchasePrice?.toString() || '',
      purchaseDate: asset.purchaseDate || '',
      currentPrice: asset.currentPrice?.toString() || '',
      currency: asset.currency,
      notes: asset.notes || ''
    });
    setShowAddAssetForm(false);
  };

  const deleteAsset = (assetId: string) => {
    if (window.confirm('Bu varlığı silmek istediğinizden emin misiniz?')) {
      onUpdatePortfolio({
        assets: (portfolio.assets || []).filter(asset => asset.id !== assetId),
        sales: (portfolio.sales || []).filter(sale => sale.assetId !== assetId)
      });
    }
  };

  const deleteSale = (saleId: string) => {
    if (window.confirm('Bu satış kaydını silmek istediğinizden emin misiniz?')) {
      onUpdatePortfolio({
        sales: (portfolio.sales || []).filter(sale => sale.id !== saleId)
      });
    }
  };
  const getSalesForAsset = (assetId: string) => {
    return (portfolio.sales || []).filter(sale => sale.assetId === assetId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Varlık Yönetimi</h1>
          <p className="text-gray-600">
            {portfolio.name} portföyündeki varlıklarınızı yönetin
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddAssetForm(true);
            setEditingAsset(null);
            resetAssetForm();
          }}
          className="btn-primary"
        >
          + Varlık Ekle
        </button>
      </div>

      {/* Add/Edit Asset Form */}
      {(showAddAssetForm || editingAsset) && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingAsset ? 'Varlık Düzenle' : 'Yeni Varlık Ekle'}
          </h2>
          
          <form onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varlık Adı *
                </label>
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({...assetForm, name: e.target.value})}
                  className="input-field"
                  placeholder="Örn: BIST100, Bitcoin, Altın"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={assetForm.category}
                  onChange={(e) => setAssetForm({...assetForm, category: e.target.value as AssetCategory})}
                  className="input-field"
                  required
                >
                  {Object.entries(ASSET_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miktar *
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={assetForm.amount}
                  onChange={(e) => setAssetForm({...assetForm, amount: e.target.value})}
                  className="input-field"
                  placeholder="Örn: 1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para Birimi *
                </label>
                <select
                  value={assetForm.currency}
                  onChange={(e) => setAssetForm({...assetForm, currency: e.target.value as Currency})}
                  className="input-field"
                  required
                >
                  {Object.entries(CURRENCIES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alış Fiyatı * ({assetForm.currency === 'TRY' ? '₺' : '$'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={assetForm.purchasePrice}
                  onChange={(e) => setAssetForm({...assetForm, purchasePrice: e.target.value})}
                  className="input-field"
                  placeholder="Örn: 1.25"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alış Tarihi *
                </label>
                <input
                  type="date"
                  value={assetForm.purchaseDate}
                  onChange={(e) => setAssetForm({...assetForm, purchaseDate: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Güncel Fiyat ({assetForm.currency === 'TRY' ? '₺' : '$'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={assetForm.currentPrice}
                  onChange={(e) => setAssetForm({...assetForm, currentPrice: e.target.value})}
                  className="input-field"
                  placeholder="Örn: 1.45"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notlar
              </label>
              <textarea
                value={assetForm.notes}
                onChange={(e) => setAssetForm({...assetForm, notes: e.target.value})}
                className="input-field"
                rows={2}
                placeholder="Ek notlar (isteğe bağlı)"
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button type="submit" className="btn-primary">
                {editingAsset ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddAssetForm(false);
                  setEditingAsset(null);
                  resetAssetForm();
                }}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sale Form */}
      {showSaleForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Satış Kaydet</h2>
          
          <form onSubmit={handleSaleAsset}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satış Miktarı *
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm({...saleForm, amount: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para Birimi *
                </label>
                <select
                  value={saleForm.currency}
                  onChange={(e) => setSaleForm({...saleForm, currency: e.target.value as Currency})}
                  className="input-field"
                  required
                >
                  {Object.entries(CURRENCIES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satış Fiyatı * ({saleForm.currency === 'TRY' ? '₺' : '$'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={saleForm.salePrice}
                  onChange={(e) => setSaleForm({...saleForm, salePrice: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satış Tarihi *
                </label>
                <input
                  type="date"
                  value={saleForm.saleDate}
                  onChange={(e) => setSaleForm({...saleForm, saleDate: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notlar
              </label>
              <textarea
                value={saleForm.notes}
                onChange={(e) => setSaleForm({...saleForm, notes: e.target.value})}
                className="input-field"
                rows={2}
                placeholder="Satış notları (isteğe bağlı)"
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button type="submit" className="btn-success">
                Satışı Kaydet
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaleForm(null);
                  resetSaleForm();
                }}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Assets List */}
      {portfolio && portfolio.assets && portfolio.assets.length > 0 ? (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Varlıklar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Varlık
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Miktar
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Alış Fiyatı
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Güncel Fiyat
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Değer ({displayCurrency === 'TRY' ? '₺' : '$'})
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Kazanç/Zarar
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolio.assets.map((asset) => {
                  const value = calculateAssetValue(asset, displayCurrency, exchangeRate);
                  const gainLoss = calculateAssetGainLoss(asset, displayCurrency, exchangeRate);
                  const sales = getSalesForAsset(asset.id);
                  
                  return (
                    <tr key={asset.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">
                            {ASSET_CATEGORIES[asset.category]} • {asset.currency}
                          </div>
                          {sales.length > 0 && (
                            <div className="text-xs text-orange-600">
                              {sales.length} satış yapıldı
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {asset.amount.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {formatCurrency(asset.purchasePrice ?? 0, asset.currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {asset.currentPrice 
                          ? formatCurrency(asset.currentPrice, asset.currency)
                          : formatCurrency(asset.purchasePrice ?? 0, asset.currency)
                        }
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(value, displayCurrency)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        gainLoss.amount >= 0 ? 'gain-positive' : 'gain-negative'
                      }`}>
                        {formatCurrency(gainLoss.amount, displayCurrency)}
                        <div className="text-xs">
                          {gainLoss.percentage >= 0 ? '+' : ''}
                          {gainLoss.percentage.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              setShowSaleForm(asset.id);
                              // Satış para birimini varlık para birimi ile aynı yap
                              setSaleForm(prev => ({...prev, currency: asset.currency}));
                            }}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Sat"
                          >
                            💰
                          </button>
                          <button
                            onClick={() => startEdit(asset)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteAsset(asset.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💎</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz varlık bulunmuyor
          </h3>
          <p className="text-gray-600 mb-6">
            İlk varlığınızı ekleyerek portföyünüzü oluşturmaya başlayın
          </p>
          <button
            onClick={() => setShowAddAssetForm(true)}
            className="btn-primary"
          >
            İlk Varlığımı Ekle
          </button>
        </div>
      )}
      {/* Sales History */}
      {portfolio?.sales && portfolio.sales.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Satış Geçmişi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Varlık
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Miktar
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Satış Fiyatı
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Toplam ({displayCurrency === 'TRY' ? '₺' : '$'})
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Tarih
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolio.sales.map((sale) => {
                  const asset = portfolio?.assets?.find(a => a.id === sale.assetId);
                  const totalInSaleCurrency = sale.amount * (sale.salePrice || 0);
                  
                  return (
                    <tr key={sale.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {asset?.name || 'Silinmiş Varlık'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sale.currency}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {sale.amount.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {formatCurrency(sale.salePrice || 0, sale.currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatCurrency(totalInSaleCurrency || 0, sale.currency)}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {formatDate(sale.saleDate || '')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteSale(sale.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManager; 