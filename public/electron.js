const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Ana pencereyi oluştur
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // React uygulamasını yükle
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Pencere hazır olduğunda göster
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Menüyü oluştur
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'Dosya',
      submenu: [
        {
          label: 'Yeni Portföy',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-portfolio');
          }
        },
        {
          label: 'Veri Yedekle',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-backup-data');
          }
        },
        { type: 'separator' },
        {
          label: 'Çıkış',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Düzenle',
      submenu: [
        { label: 'Geri Al', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Yinele', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Kes', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Kopyala', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Yapıştır', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Görünüm',
      submenu: [
        { label: 'Yeniden Yükle', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Tam Ekran', accelerator: 'F11', role: 'togglefullscreen' },
        { type: 'separator' },
        { label: 'Yakınlaştır', accelerator: 'CmdOrCtrl+Plus', role: 'zoomin' },
        { label: 'Uzaklaştır', accelerator: 'CmdOrCtrl+-', role: 'zoomout' },
        { label: 'Gerçek Boyut', accelerator: 'CmdOrCtrl+0', role: 'resetzoom' }
      ]
    },
    {
      label: 'Yardım',
      submenu: [
        {
          label: 'Hakkında',
          click: () => {
            mainWindow.webContents.send('menu-about');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Uygulama olayları
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Güvenlik: Yeni pencere açılmasını engelle
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
}); 