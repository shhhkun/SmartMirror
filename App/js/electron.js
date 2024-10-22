"use strict";

const electron = require("electron");
const core = require("./app");
const Log = require("./logger");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process"); // used to spawn fingerprint py file as a child process

let config = process.env.config ? JSON.parse(process.env.config) : {};
const userConfig = {
  config: {}
};

const userIdModule = require("./userId");
let userId = userIdModule.userId;
let existingUsers = userIdModule.existingUsers || [];

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  console.log("Creating file");
  let electronSize = (800, 600);
  try {
    electronSize = electron.screen.getPrimaryDisplay().workAreaSize;
  } catch {
    Log.warn("Could not get display size, using defaults ...");
  }

  let electronSwitchesDefaults = [
    "autoplay-policy",
    "no-user-gesture-required"
  ];
  app.commandLine.appendSwitch(
    ...new Set(electronSwitchesDefaults, config.electronSwitches)
  );
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

  const electronOptions = Object.assign(
    {},
    electronOptionsDefaults,
    config.electronOptions
  );

  mainWindow = new BrowserWindow(electronOptions);

  let prefix;
  if ((config["tls"] !== null && config["tls"]) || config.useHttps) {
    prefix = "https://";
  } else {
    prefix = "http://";
  }

  let address =
    (config.address === void 0) |
    (config.address === "") |
    (config.address === "0.0.0.0")
      ? (config.address = "localhost")
      : config.address;
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

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      let curHeaders = details.responseHeaders;
      if (config["ignoreXOriginHeader"] || false) {
        curHeaders = Object.fromEntries(
          Object.entries(curHeaders).filter(
            (header) => !/x-frame-options/i.test(header[0])
          )
        );
      }

      if (config["ignoreContentSecurityPolicy"] || false) {
        curHeaders = Object.fromEntries(
          Object.entries(curHeaders).filter(
            (header) => !/content-security-policy/i.test(header[0])
          )
        );
      }

      callback({ responseHeaders: curHeaders });
    }
  );

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    watchFiles();
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

app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  }
);

if (process.env.clientonly) {
  app.whenReady().then(() => {
    Log.log("Launching client viewer application.");
    createWindow();
  });
}

function loadConfiguration() {
  try {
    const configDir = path.join(__dirname, "..", "config");
    const defaultConfigPath = path.join(configDir, "config.js");
    const defaultUser = path.join(configDir, "default.js");
    const userConfigPath = path.join(configDir, `${userId}.js`);

    console.log("Default config path:", defaultConfigPath);
    console.log("User config path:", userConfigPath);

    if (!existingUsers.includes(userId)) {
      console.log(
        `User ${userId} does not exist. Creating a new configuration file.`
      );
      existingUsers.push(userId);
      const numNewUsers = existingUsers.length - userIdModule.numUsers;
      userIdModule.numUsers += numNewUsers;
      fs.writeFileSync(
        path.join(__dirname, "userId.js"),
        `exports.userId = "${userId}";\nexports.existingUsers = ${JSON.stringify(existingUsers)};\nexports.numUsers = ${userIdModule.numUsers};`
      );
      fs.copyFileSync(defaultUser, userConfigPath);
    }

    if (fs.existsSync(userConfigPath)) {
      console.log(
        `Copying user-specific configuration file (${userConfigPath}) to ${defaultConfigPath}`
      );
      fs.copyFileSync(userConfigPath, defaultConfigPath);
    } else {
      console.warn(
        `Configuration file not found for user ${userId}. Using default configuration.`
      );
    }

    //delete require.cache[require.resolve(defaultConfigPath)];

    if (fs.existsSync(defaultConfigPath)) {
      userConfig.config = require(defaultConfigPath);
    } else {
      console.warn(
        `Default configuration file (${defaultConfigPath}) not found. Using an empty configuration.`
      );
      userConfig.config = {};
    }
  } catch (error) {
    console.error(`Error loading configuration:`, error);
  }
}

// This function watches the userId file and the user-specific configuration file
function watchFiles() {
  const userIdPath = path.join(__dirname, "userId.js");
  let userConfigPath = path.join(__dirname, "..", "config", `${userId}.js`);
  let userConfigWatcher = null;

  function watchUserConfig() {
    if (userConfigWatcher) {
      userConfigWatcher.close();
    }

    userConfigPath = path.join(__dirname, "..", "config", `${userId}.js`);
    userConfigWatcher = fs.watch(userConfigPath, (eventType, filename) => {
      if (filename === `${userId}.js`) {
        console.log(
          `User-specific configuration file (${userConfigPath}) changed`
        );
        loadConfiguration();
        mainWindow.webContents.reload();
      }
    });
  }

  // This watches the userId file
  fs.watch(userIdPath, (eventType, filename) => {
    if (filename === "userId.js") {
      console.log("userId file changed");
      delete require.cache[require.resolve(userIdPath)];
      const updatedUserIdModule = require(userIdPath);
      const newUserId = updatedUserIdModule.userId;

      console.log("Previous userId:", userId);
      console.log("New userId:", newUserId);

      if (newUserId !== userId) {
        userId = newUserId;
        userConfig.userId = userId;
        loadConfiguration();
        mainWindow.webContents.reload();
        watchUserConfig();
      }
    }
  });

  watchUserConfig();
}
// This will run the fingerprint python script and watch its output
const userIdPath = path.join(__dirname, "userId.js");
const pythonScriptPath = path.join(
  __dirname,
  "..",
  "..",
  "fingerprint_scanner",
  "fingerprint_test.py"
);
//DEBUG
console.log("Python script path:", pythonScriptPath);
const pythonProcess = spawn("python3", [pythonScriptPath]);

//DEBUG
console.log("1.Post const definitions");

// The logic for the python fingerprint, read outputs and looks for keywords
pythonProcess.stdout.on("data", (data) => {
  //DEBUG
  console.log("2. In stdout.on");

  const output = data.toString(); // Converts Buffer to string
  let numFailures = 0; // Number of failures to read the fingerprint

  // Logic for calling commands
  const userMatch = output.match(/(user \d+)/); // regex for the output to see if it userMatches a found user
  const failedMatch = output.match(/READ_FAIL/); // regex for the output to see if it failed

  //debug
  console.log("2.5 Output:", output);
  console.log("2.6 userMatch:", userMatch);
  console.log("2.7 failedMatch:", failedMatch);

  if (numFailures >= 2) {
    console.log("Inside numFailures");
    numFailures = 0; // Reset the number of failures
    console.warn("Failed to read fingerprint 2 times, enrolling");
  } else if (userMatch) {
    numFailures = 0; // Reset the number of failures
    //DEBUG
    console.log("3. In userMatch: ", userMatch);
    console.log("3.1 Reset number of failures to: ", numFailures);

    // Change the userID to be the found user ID
    const userID = userMatch[1]; // should capture just the user id
    const newContent = `exports.userId = "${userID}";`;

    //DEBUG
    console.log("3.5 New content:", newContent);

    // Will try to write the new user ID to the userId.js file
    try {
      //DEBUG
      console.log("4. In try");
      fs.writeFileSync(userIdPath, newContent); // NOTE: do I need utf-8? lets try without it first
      console.log("Wrote to userid file");
    } catch (error) {
      console.log("Error writing to userid file");
    }
  } else if (failedMatch) {
    numFailures += 1; // Increment the number of failures
    console.warn("Fingerprint failed to read");

    // Will now display the module that ask the user if they want to enroll a new fingerprint
    // IMPLEMENT
    mainWindow.webContents.send("ENABLE_COUNTER_MODULE", userId);
  }
});

if (
  ["localhost", "127.0.0.1", "::1", "::ffff:127.0.0.1", undefined].includes(
    config.address
  )
) {
  core.start().then((c) => {
    config = c;
    console.log("RESET");
    app.whenReady().then(async () => {
      console.log("APPLICATION LAUNCHED");
      Log.log("Launching application.");
      loadConfiguration();
      createWindow();
    });
  });
}
