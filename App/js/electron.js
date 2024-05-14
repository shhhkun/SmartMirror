"use strict";

const electron = require("electron");
const core = require("./app");
const Log = require("./logger");
const fs = require("fs");
const path = require("path");

let config = process.env.config ? JSON.parse(process.env.config) : {};

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  let electronSize = (800, 600);
  try {
    electronSize = electron.screen.getPrimaryDisplay().workAreaSize;
  } catch {
    Log.warn("Could not get display size, using defaults ...");
  }

  let electronSwitchesDefaults = ["autoplay-policy", "no-user-gesture-required"];
  app.commandLine.appendSwitch(...new Set(electronSwitchesDefaults, config.electronSwitches));
  let electronOptionsDefaults = {
    width: electronSize.width,
    height: electronSize.height,
    icon: "mm2.png",
    x: 0,
    y: 0,
    darkTheme: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      zoomFactor: config.zoom
    },
    backgroundColor: "#000000"
  };

  if (config.kioskmode) {
    electronOptionsDefaults.kiosk = true;
  } else {
    electronOptionsDefaults.show = false;
    electronOptionsDefaults.frame = false;
    electronOptionsDefaults.transparent = true;
    electronOptionsDefaults.hasShadow = false;
    electronOptionsDefaults.fullscreen = true;
  }

  const electronOptions = Object.assign({}, electronOptionsDefaults, config.electronOptions);

  mainWindow = new BrowserWindow(electronOptions);

  let prefix;
  if ((config["tls"] !== null && config["tls"]) || config.useHttps) {
    prefix = "https://";
  } else {
    prefix = "http://";
  }

  let address = (config.address === void 0) | (config.address === "") | (config.address === "0.0.0.0") ? (config.address = "localhost") : config.address;
  const port = process.env.MM_PORT || config.port;
  mainWindow.loadURL(`${prefix}${address}:${port}`);

  if (process.argv.includes("dev")) {
    if (process.env.JEST_WORKER_ID !== undefined) {
      const devtools = new BrowserWindow(electronOptions);
      mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    }
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on("dom-ready", (event) => {
    mainWindow.webContents.sendInputEvent({ type: "mouseMove", x: 0, y: 0 });
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  if (config.kioskmode) {
    mainWindow.on("blur", function () {
      mainWindow.focus();
    });

    mainWindow.on("leave-full-screen", function () {
      mainWindow.setFullScreen(true);
    });

    mainWindow.on("resize", function () {
      setTimeout(function () {
        mainWindow.reload();
      }, 1000);
    });
  }

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    let curHeaders = details.responseHeaders;
    if (config["ignoreXOriginHeader"] || false) {
      curHeaders = Object.fromEntries(Object.entries(curHeaders).filter((header) => !(/x-frame-options/i).test(header[0])));
    }

    if (config["ignoreContentSecurityPolicy"] || false) {
      curHeaders = Object.fromEntries(Object.entries(curHeaders).filter((header) => !(/content-security-policy/i).test(header[0])));
    }

    callback({ responseHeaders: curHeaders });
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

app.on("window-all-closed", function () {
  if (process.env.JEST_WORKER_ID !== undefined) {
    app.quit();
  } else {
    createWindow();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("before-quit", async (event) => {
  Log.log("Shutting down server...");
  event.preventDefault();
  setTimeout(() => {
    process.exit(0);
  }, 3000);
  await core.stop();
  process.exit(0);
});

app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

if (process.env.clientonly) {
  app.whenReady().then(() => {
    Log.log("Launching client viewer application.");
    createWindow();
  });
}

let userId = "default"; // Initial userId value

function loadConfiguration() {
  try {
    const configDir = path.join(__dirname, "..", "config");
    const defaultConfigPath = path.join(configDir, "config.js");
    const userConfigPath = path.join(configDir, `${userId}.js`);

    console.log("Default config path:", defaultConfigPath);
    console.log("User config path:", userConfigPath);

    if (fs.existsSync(userConfigPath)) {
      console.log(`Copying user-specific configuration file (${userConfigPath}) to ${defaultConfigPath}`);
      fs.copyFileSync(userConfigPath, defaultConfigPath);
    } else {
      console.warn(`Configuration file not found for user ${userId}. Using default configuration.`);
    }

    delete require.cache[require.resolve(defaultConfigPath)]; // Clear the module cache
    config = require(defaultConfigPath); // Load the updated configuration
  } catch (error) {
    console.error(`Error loading configuration:`, error);
  }
}

function watchElectronJSFile() {
  const electronJSPath = __filename;

  fs.watch(electronJSPath, (eventType, filename) => {
    if (filename === path.basename(electronJSPath)) {
      delete require.cache[require.resolve(electronJSPath)]; // Clear the module cache
      const updatedElectronJS = require(electronJSPath); // Load the updated electron.js file
      const newUserId = updatedElectronJS.userId;

      if (newUserId !== userId) {
        userId = newUserId;
        loadConfiguration();
        app.relaunch();
        app.quit();
      }
    }
  });
}

if (["localhost", "127.0.0.1", "::1", "::ffff:127.0.0.1", undefined].includes(config.address)) {
  core.start().then((c) => {
    config = c;
    app.whenReady().then(async () => {
      Log.log("Launching application.");
      loadConfiguration(); // Initial configuration load
      createWindow();
      watchElectronJSFile(); // Start watching the electron.js file for changes
    });
  });
}