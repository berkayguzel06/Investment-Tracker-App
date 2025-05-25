# Investment Tracker Backend

Node.js ve PostgreSQL kullanarak geliştirilmiş Investment Tracker uygulamasının backend API'si.

## 🚀 Kurulum

### Gereksinimler

- Node.js 16 veya üzeri
- PostgreSQL 12 veya üzeri
- npm veya yarn

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment dosyasını oluşturun:**
```bash
cp env.example .env
```

3. **PostgreSQL veritabanını oluşturun:**
```sql
CREATE DATABASE investment_tracker;
```

4. **.env dosyasını düzenleyin:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=investment_tracker
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
```

5. **Veritabanı migrasyonlarını çalıştırın:**
```bash
npm run migrate
```

6. **Sunucuyu başlatın:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 API Endpoints

### Portfolios
- `GET /api/portfolios` - Tüm portfolyoları listele
- `GET /api/portfolios/:id` - Portfolyo detayı
- `GET /api/portfolios/:id/details` - Portfolyo + varlıklar + satışlar
- `POST /api/portfolios` - Yeni portfolyo oluştur
- `PUT /api/portfolios/:id` - Portfolyo güncelle
- `DELETE /api/portfolios/:id` - Portfolyo sil

### Assets
- `GET /api/assets` - Tüm varlıkları listele
- `GET /api/assets/portfolio/:portfolioId` - Portfolyoya ait varlıklar
- `GET /api/assets/:id` - Varlık detayı
- `POST /api/assets` - Yeni varlık oluştur
- `PUT /api/assets/:id` - Varlık güncelle
- `PUT /api/assets/:id/price` - Varlık fiyatı güncelle
- `DELETE /api/assets/:id` - Varlık sil

### Sales
- `GET /api/sales` - Tüm satışları listele
- `GET /api/sales/asset/:assetId` - Varlığa ait satışlar
- `GET /api/sales/portfolio/:portfolioId` - Portfolyoya ait satışlar
- `GET /api/sales/:id` - Satış detayı
- `POST /api/sales` - Yeni satış oluştur
- `DELETE /api/sales/:id` - Satış sil

### Settings
- `GET /api/settings` - Ayarları getir
- `PUT /api/settings` - Ayarları güncelle
- `PUT /api/settings/exchange-rate` - Döviz kurunu güncelle

## 🗄️ Veritabanı Şeması

### Portfolios
```sql
id (UUID, Primary Key)
name (VARCHAR, NOT NULL)
description (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Assets
```sql
id (UUID, Primary Key)
portfolio_id (UUID, Foreign Key)
name (VARCHAR, NOT NULL)
category (ENUM: fon, hisse, doviz, kripto, kiymetli_maden)
amount (DECIMAL)
purchase_price (DECIMAL)
purchase_date (DATE)
current_price (DECIMAL)
currency (ENUM: TRY, USD)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Sales
```sql
id (UUID, Primary Key)
asset_id (UUID, Foreign Key)
amount (DECIMAL)
sale_price (DECIMAL)
sale_date (DATE)
currency (ENUM: TRY, USD)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Settings
```sql
id (UUID, Primary Key)
currency (VARCHAR)
language (VARCHAR)
theme (ENUM: light, dark)
usd_to_try_rate (DECIMAL)
exchange_rate_updated (TIMESTAMP)
display_currency (ENUM: TRY, USD)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## 🔧 Geliştirme

### Migration Oluşturma
```bash
npx knex migrate:make migration_name
```

### Migration Çalıştırma
```bash
npm run migrate
```

### Seed Oluşturma
```bash
npx knex seed:make seed_name
```

### Seed Çalıştırma
```bash
npm run seed
```

## 🚀 Production Deployment

1. **Build:**
```bash
npm run build
```

2. **Start:**
```bash
npm start
```

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=investment_tracker
DB_USER=postgres
DB_PASSWORD=password

# Server
PORT=3001
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
``` 