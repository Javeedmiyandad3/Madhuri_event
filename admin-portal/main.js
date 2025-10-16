const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false // Allow loading local files
        },
        title: 'AA Event Decor - Admin Portal',
        icon: path.join(__dirname, 'admin', 'icon.png') // Optional icon
    });

    mainWindow.loadFile(path.join(__dirname, 'admin', 'index.html'));
    
    // Remove menu bar for cleaner interface
    mainWindow.setMenuBarVisibility(false);
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});