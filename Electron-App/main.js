const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    mouseScrollBounce: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    hideCursor(mainWindow);
    watchFiles();
  });

  globalShortcut.register('Ctrl+Shift+F', () => {
    mainWindow.setFullScreen(false);
    showCursor(mainWindow);
  });

  mainWindow.on('closed', () => {
    app.quit();
  });
}

function hideCursor(window) {
  window.webContents.executeJavaScript(`
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
  `);
}

function showCursor(window) {
  window.webContents.executeJavaScript(`
    document.body.style.cursor = 'default';
    document.documentElement.style.cursor = 'default';
  `);
}

function watchFiles() {
  const mainJSFilePath = path.join(__dirname, 'main.js');
  const clockRendererFilePath = path.join(__dirname, 'clockRenderer.js');

  fs.watchFile(mainJSFilePath, { interval: 500 }, () => {
    console.log('main.js file changed, reloading app...');
    mainWindow.reload();
  });

  fs.watchFile(clockRendererFilePath, { interval: 500 }, () => {
    console.log('clockRenderer.js file changed, reloading app...');
    mainWindow.reload();
  });
}

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
