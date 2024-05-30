Module.register("counter", {
    defaults: {
      countdownSeconds: 30
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
        }
      }, 1000);
    },
  
    stop() {
      Log.info("Stopping module: " + this.name);
      clearInterval(this.timer);
    }
  });