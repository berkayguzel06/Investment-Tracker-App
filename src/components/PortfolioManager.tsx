import React, { useState } from 'react';
import { Portfolio } from '../types';
import { createPortfolio } from '../utils/storage';

interface PortfolioManagerProps {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  onCreatePortfolio: (portfolio: Portfolio) => void;
  onUpdatePortfolio: (portfolioId: string, updates: Partial<Portfolio>) => void;
  onDeletePortfolio: (portfolioId: string) => void;
  onSetActivePortfolio: (portfolioId: string | null) => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolios,
  activePortfolioId,
  onCreatePortfolio,
  onUpdatePortfolio,
  onDeletePortfolio,
  onSetActivePortfolio
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPortfolioName.trim()) {
      const portfolio = createPortfolio(newPortfolioName.trim(), newPortfolioDescription.trim());
      onCreatePortfolio(portfolio);
      setNewPortfolioName('');
      setNewPortfolioDescription('');
      setShowCreateForm(false);
    }
  };

  const handleUpdatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPortfolio && newPortfolioName.trim()) {
      onUpdatePortfolio(editingPortfolio.id, {
        name: newPortfolioName.trim(),
        description: newPortfolioDescription.trim()
      });
      setEditingPortfolio(null);
      setNewPortfolioName('');
      setNewPortfolioDescription('');
    }
  };

  const startEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setNewPortfolioName(portfolio.name);
    setNewPortfolioDescription(portfolio.description || '');
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingPortfolio(null);
    setNewPortfolioName('');
    setNewPortfolioDescription('');
  };

  const handleDelete = (portfolio: Portfolio) => {
    if (window.confirm(`"${portfolio.name}" portföyünü silmek istediğinizden emin misiniz?`)) {
      onDeletePortfolio(portfolio.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portföy Yönetimi</h1>
          <p className="text-gray-600">Portföylerinizi oluşturun, düzenleyin ve yönetin</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingPortfolio(null);
            setNewPortfolioName('');
            setNewPortfolioDescription('');
          }}
          className="btn-primary"
        >
          + Yeni Portföy
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingPortfolio) && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPortfolio ? 'Portföy Düzenle' : 'Yeni Portföy Oluştur'}
          </h2>
          
          <form onSubmit={editingPortfolio ? handleUpdatePortfolio : handleCreatePortfolio}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portföy Adı *
                </label>
                <input
                  type="text"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="input-field"
                  placeholder="Örn: Ana Portföy, Emeklilik Fonu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newPortfolioDescription}
                  onChange={(e) => setNewPortfolioDescription(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Portföy hakkında kısa açıklama (isteğe bağlı)"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button type="submit" className="btn-primary">
                {editingPortfolio ? 'Güncelle' : 'Oluştur'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  cancelEdit();
                }}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio List */}
      {portfolios.length > 0 ? (
        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className={`card transition-all duration-200 ${
                portfolio.id === activePortfolioId
                  ? 'border-primary-200 bg-primary-50'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {portfolio.name}
                    </h3>
                    {portfolio.id === activePortfolioId && (
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>
                  
                  {portfolio.description && (
                    <p className="text-gray-600 mt-1">{portfolio.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>📅 {new Date(portfolio.createdAt).toLocaleDateString('tr-TR')}</span>
                    <span>💎 {portfolio.assets.length} varlık</span>
                    <span>💰 {portfolio.sales.length} satış</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {portfolio.id !== activePortfolioId && (
                    <button
                      onClick={() => onSetActivePortfolio(portfolio.id)}
                      className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      Aktif Yap
                    </button>
                  )}
                  
                  <button
                    onClick={() => startEdit(portfolio)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Düzenle"
                  >
                    ✏️
                  </button>
                  
                  <button
                    onClick={() => handleDelete(portfolio)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz portföy bulunmuyor
          </h3>
          <p className="text-gray-600 mb-6">
            İlk portföyünüzü oluşturarak yatırım takibinize başlayın
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            İlk Portföyümü Oluştur
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager; 