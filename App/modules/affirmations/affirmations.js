Module.register("affirmations", {
  defaults: {
    updateInterval: 24 * 60 * 60 * 1000, // Update every 24 hours
    fadeSpeed: 4000, // Fading speed in milliseconds
    affirmationSize: "44px", // Font size of the affirmation text
    affirmations: [
      "I am worthy of love and respect.",
      "I believe in myself and my abilities.",
      "I am grateful for all the blessings in my life.",
      "I choose to focus on the positive.",
      "I am resilient and can overcome any challenge.",
      "I am surrounded by love and support.",
      "I trust in the journey of life.",
      "I am capable of achieving my dreams.",
      "I am at peace with myself and the world around me.",
      "I radiate confidence and positivity."
    ]
  },

  getTemplate: function () {
    return "affirmations.njk";
  },

  getTemplateData: function () {
    return {
      affirmation: this.affirmation,
      affirmationSize: this.config.affirmationSize
    };
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.affirmation = "";
    this.loadAffirmation();
    setInterval(() => {
      this.loadAffirmation();
    }, this.config.updateInterval);
  },

  loadAffirmation: function () {
    this.affirmation = this.config.affirmations[Math.floor(Math.random() * this.config.affirmations.length)];
    this.updateDom(this.config.fadeSpeed);
  }
});