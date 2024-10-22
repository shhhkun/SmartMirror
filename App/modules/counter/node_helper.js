const NodeHelper = require("../../js/node_helper");
const path = require("path");
const fs = require("fs");

module.exports = NodeHelper.create({
  start() {
    console.log(`Starting module helper: ${this.name}`);
    this.loadConfig();
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "COUNTDOWN_FINISHED") {
      console.log(`Received COUNTDOWN_FINISHED notification for module: ${this.name}`);
      this.disableCounterModule();
    }
  },

  loadConfig() {
    const configFilePath = path.join(__dirname, "..", "..", "config", "config.js");
    delete require.cache[require.resolve(configFilePath)];

    if (fs.existsSync(configFilePath)) {
      const config = require(configFilePath);
      this.config = config.modules.find(m => m.module === "counter");
      if (!this.config) {
        console.log(`Counter module config not found in config file.`);
      }
    } else {
      console.warn(`Configuration file (${configFilePath}) not found. Using an empty configuration.`);
      this.config = {};
    }
  },

  disableCounterModule() {
    const userIdPath = path.join(__dirname, "..", "..", "js", "userId.js");
    const userId = require(userIdPath).userId;
    const userConfigFilePath = path.join(__dirname, "..", "..", "config", `${userId}.js`);

    if (fs.existsSync(userConfigFilePath)) {
      const userConfigContent = fs.readFileSync(userConfigFilePath, "utf8");
      const lines = userConfigContent.split("\n");

      let updatedContent = "";
      let insideCounterModule = false;

      for (const line of lines) {
        if (line.includes("module: \"counter\"")) {
          insideCounterModule = true;
        }

        if (insideCounterModule && line.includes("disabled:")) {
          updatedContent += "    disabled: 1,\n";
          insideCounterModule = false;
        } else {
          updatedContent += line + "\n";
        }
      }

      fs.writeFileSync(userConfigFilePath, updatedContent.trim());

      console.log(`Disabled counter module in user-specific config file for user: ${userId}`);
      this.sendSocketNotification("MODULE_DISABLED", "counter");
    } else {
      console.log(`User-specific config file not found for user: ${userId}`);
    }
  }
});