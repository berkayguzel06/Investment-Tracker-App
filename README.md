# 💰 Investment Tracker App

A modern and user-friendly investment portfolio tracking application. Developed using Electron and React technologies.

## 🚀 Features

### 📊 Portfolio Management

* Support for multiple portfolios
* Create, edit, and delete portfolios
* Select active portfolio

### 💎 Asset Management

* 5 asset categories: Funds, Stocks, Currencies, Cryptocurrencies, Precious Metals
* Add, edit, and delete assets
* Track purchase and current prices
* Record sales transactions

### 📈 Analytics & Reporting

* Real-time profit/loss calculation
* Portfolio performance analysis
* Asset allocation charts
* Risk analysis and diversification reports
* Weekly, monthly, and yearly performance tracking

### 🎨 User Interface

* Modern and responsive design
* Dark/light theme support
* Turkish language support
* Intuitive user experience

## 🛠️ Technologies

* **Frontend:** React 18, TypeScript
* **Desktop:** Electron
* **UI Framework:** Tailwind CSS
* **Charts:** Chart.js
* **Data:** Local Storage

## 📦 Installation

### Requirements

* Node.js 16 or above
* npm or yarn

### Installation Steps

1. **Install dependencies:**

```bash
npm install
```

2. **Run in development mode:**

```bash
npm run dev
```

3. **Run only the React app:**

```bash
npm start
```

4. **Build for production:**

```bash
npm run build
```

5. **Package the Electron app:**

```bash
npm run electron-pack
```

## 🎯 Usage

### First Setup

1. After launching the app, create your first portfolio
2. Add your assets (category, amount, purchase price, etc.)
3. Track your portfolio performance by updating current prices

### Adding Assets

1. Go to the **Assets** section
2. Click on the **+ Add Asset** button
3. Fill in the required fields:

   * Asset name
   * Category
   * Amount
   * Purchase price
   * Purchase date
   * Current price (optional)

### Recording a Sale

1. Click the 💰 button next to the asset you want to sell
2. Enter sale amount, price, and date
3. Save the sale

### Analytics & Reports

1. Go to the **Analytics** section
2. View your portfolio performance, asset distribution, and risk analysis
3. Explore charts for different time periods

## 📁 Project Structure

```
investment-tracker/
├── public/
│   ├── electron.js          # Main Electron file
│   └── index.html           # HTML template
├── src/
│   ├── components/          # React components
│   │   ├── Analytics.tsx    # Analytics page
│   │   ├── AssetManager.tsx # Asset management
│   │   ├── Dashboard.tsx    # Dashboard
│   │   ├── PortfolioManager.tsx # Portfolio management
│   │   └── Sidebar.tsx      # Sidebar menu
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── calculations.ts  # Calculation logic
│   │   └── storage.ts       # Data storage
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # Entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Development

### Adding New Features

1. Create a new component in `src/components/`
2. Add new types to `src/types/index.ts` if needed
3. Add utility functions in `src/utils/` if necessary

### Styling Changes

* Use Tailwind CSS classes
* Define custom styles in `src/index.css`
* Modify theme settings in `tailwind.config.js`

## 📊 Data Model

### Portfolio

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

### Asset

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

### Sale

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

## 🎨 Themes & Colors

### Colors

* **Primary:** Blue (#3b82f6)
* **Success:** Green (#22c55e)
* **Danger:** Red (#ef4444)
* **Warning:** Orange (#f59e0b)

### Category Colors

* **Funds:** Blue (#3b82f6)
* **Stocks:** Green (#22c55e)
* **Currency:** Orange (#f59e0b)
* **Crypto:** Purple (#8b5cf6)
* **Precious Metals:** Red (#ef4444)

## 🚀 Upcoming Features

* [ ] Real-time price updates (API integration)
* [ ] More detailed charts and analysis tools
* [ ] Import/export data (CSV, Excel)
* [ ] Backup and sync options
* [ ] Mobile app support
* [ ] Multi-currency support
* [ ] Goal setting and alerts

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📞 Contact

For questions, use GitHub Issues.

---

**Manage your portfolio like a pro with Investment Tracker!** 💰📈
