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
    }
  }
});