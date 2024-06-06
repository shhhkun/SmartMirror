Module.register("counter", {
  defaults: {
    countdownSeconds: 30,
    alwaysLoadNodeHelper: true
  },

  getTemplate() {
    return "counter.njk";
  },

  getTemplateData() {
    return {
      text: this.text
    };
  },

  start() {
    Log.info("Starting module: " + this.name);
    this.countdown = this.config.countdownSeconds;
    this.text = `You have ${this.countdown} seconds to login.`;
    this.timer = setInterval(() => {
      this.countdown--;
      this.text = `You have ${this.countdown} seconds to login.`;
      this.updateDom();
      if (this.countdown === 0) {
        clearInterval(this.timer);
        this.onCountdownFinished();
      }
    }, 1000);
  },

  onCountdownFinished() {
    Log.info("Countdown finished for module: " + this.name);
    //this.hide(); // Hide the module immediately
    this.sendSocketNotification("COUNTDOWN_FINISHED", this.name);
  },

  stop() {
    Log.info("Stopping module: " + this.name);
    clearInterval(this.timer);
  },

  notificationReceived(notification, payload, sender) {
    if (notification === "DISABLE_MODULE" && payload === "counter") {
      console.log("Received DISABLE_MODULE notification for the counter module");
      const counterElement = document.querySelector(".counter");
      if (counterElement) {
        counterElement.style.transition = "opacity 1s";
        counterElement.style.opacity = 0;
        setTimeout(() => {
          this.hide();
        }, 1000);
      }
    } else if (notification === "ENABLE_COUNTER_MODULE") {
      const userId = payload;
      const userConfigFilePath = path.join(__dirname, "..", "config", `${userId}.js`);

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
            updatedContent += "    disabled: 0,\n";
            insideCounterModule = false;
          } else {
            updatedContent += line + "\n";
          }
        }

        fs.writeFileSync(userConfigFilePath, updatedContent.trim());

        console.log(`Enabled counter module in user-specific config file for user: ${userId}`);
        this.config.disabled = false;
        this.show();
        this.start();
      } else {
        console.log(`User-specific config file not found for user: ${userId}`);
      }
    }
  }
});