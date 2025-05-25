# 💰 Yatırım Takip Uygulaması

Modern ve kullanıcı dostu yatırım portföyü takip uygulaması. Electron ve React teknolojileri ile geliştirilmiştir.

## 🚀 Özellikler

### 📊 Portföy Yönetimi
- Çoklu portföy desteği
- Portföy oluşturma, düzenleme ve silme
- Aktif portföy seçimi

### 💎 Varlık Yönetimi
- 5 farklı kategori: Fon, Hisse Senedi, Döviz, Kripto Para, Kıymetli Maden
- Varlık ekleme, düzenleme ve silme
- Alış fiyatı ve güncel fiyat takibi
- Satış işlemleri kaydetme

### 📈 Analiz ve Raporlama
- Gerçek zamanlı kazanç/zarar hesaplama
- Portföy performans analizi
- Varlık dağılım grafikleri
- Risk analizi ve diversifikasyon raporları
- Haftalık, aylık, yıllık performans takibi

### 🎨 Kullanıcı Arayüzü
- Modern ve responsive tasarım
- Koyu/açık tema desteği
- Türkçe dil desteği
- Intuitive kullanıcı deneyimi

## 🛠️ Teknolojiler

- **Frontend:** React 18, TypeScript
- **Desktop:** Electron
- **UI Framework:** Tailwind CSS
- **Charts:** Chart.js
- **Data:** Local Storage

## 📦 Kurulum

### Gereksinimler
- Node.js 16 veya üzeri
- npm veya yarn

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme modunda çalıştırın:**
```bash
npm run dev
```

3. **Sadece React uygulamasını çalıştırın:**
```bash
npm start
```

4. **Üretim için build alın:**
```bash
npm run build
```

5. **Electron uygulamasını paketleyin:**
```bash
npm run electron-pack
```

## 🎯 Kullanım

### İlk Kurulum
1. Uygulamayı başlattıktan sonra ilk portföyünüzü oluşturun
2. Varlıklarınızı ekleyin (kategori, miktar, alış fiyatı vs.)
3. Güncel fiyatları güncelleyerek portföy performansınızı takip edin

### Varlık Ekleme
1. **Varlıklar** sekmesine gidin
2. **+ Varlık Ekle** butonuna tıklayın
3. Gerekli bilgileri doldurun:
   - Varlık adı
   - Kategori
   - Miktar
   - Alış fiyatı
   - Alış tarihi
   - Güncel fiyat (opsiyonel)

### Satış Kaydetme
1. Varlık listesinde satmak istediğiniz varlığın yanındaki 💰 butonuna tıklayın
2. Satış miktarı, fiyat ve tarih bilgilerini girin
3. Satışı kaydedin

### Analiz ve Raporlar
1. **Analiz** sekmesine gidin
2. Portföy performansınızı, varlık dağılımınızı ve risk analizinizi görüntüleyin
3. Farklı zaman aralıkları için grafikleri inceleyin

## 📁 Proje Yapısı

```
investment-tracker/
├── public/
│   ├── electron.js          # Electron ana dosyası
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React bileşenleri
│   │   ├── Analytics.tsx   # Analiz sayfası
│   │   ├── AssetManager.tsx # Varlık yönetimi
│   │   ├── Dashboard.tsx   # Ana sayfa
│   │   ├── PortfolioManager.tsx # Portföy yönetimi
│   │   └── Sidebar.tsx     # Yan menü
│   ├── types/             # TypeScript tipleri
│   │   └── index.ts
│   ├── utils/             # Yardımcı fonksiyonlar
│   │   ├── calculations.ts # Hesaplama fonksiyonları
│   │   └── storage.ts     # Veri depolama
│   ├── App.tsx            # Ana uygulama
│   ├── index.tsx          # Giriş noktası
│   └── index.css          # Global stiller
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. `src/components/` klasöründe yeni bileşen oluşturun
2. Gerekirse `src/types/index.ts` dosyasına yeni tipler ekleyin
3. `src/utils/` klasöründe yardımcı fonksiyonlar ekleyin

### Stil Değişiklikleri
- Tailwind CSS sınıflarını kullanın
- `src/index.css` dosyasında custom stiller tanımlayın
- `tailwind.config.js` dosyasında tema ayarlarını değiştirin

## 📊 Veri Modeli

### Portfolio (Portföy)
```typescript
interface Portfolio {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  assets: Asset[];
  sales: Sale[];
}
```

### Asset (Varlık)
```typescript
interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice?: number;
  notes?: string;
}
```

### Sale (Satış)
```typescript
interface Sale {
  id: string;
  assetId: string;
  amount: number;
  salePrice: number;
  saleDate: string;
  notes?: string;
}
```

## 🎨 Temalar ve Renkler

### Renkler
- **Primary:** Mavi (#3b82f6)
- **Success:** Yeşil (#22c55e)
- **Danger:** Kırmızı (#ef4444)
- **Warning:** Turuncu (#f59e0b)

### Kategori Renkleri
- **Fon:** Mavi (#3b82f6)
- **Hisse:** Yeşil (#22c55e)
- **Döviz:** Turuncu (#f59e0b)
- **Kripto:** Mor (#8b5cf6)
- **Kıymetli Maden:** Kırmızı (#ef4444)

## 🚀 Gelecek Özellikler

- [ ] Gerçek zamanlı fiyat güncellemeleri (API entegrasyonu)
- [ ] Daha detaylı grafikler ve analiz araçları
- [ ] Veri dışa/içe aktarma (CSV, Excel)
- [ ] Yedekleme ve senkronizasyon
- [ ] Mobil uygulama desteği
- [ ] Çoklu para birimi desteği
- [ ] Hedef belirleme ve uyarılar

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'i push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Yatırım Takip** ile portföyünüzü profesyonelce yönetin! 💰📈 