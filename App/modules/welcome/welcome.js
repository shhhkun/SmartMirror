Module.register("welcome", {
  defaults: {
    welcomeMessage: "Welcome! Please press your finger onto the sensor to begin",
    size: "large"
  },

  getTemplate: function() {
    return "welcome.njk";
  },

  getTemplateData: function() {
    return {
      welcomeMessage: this.config.welcomeMessage,
      size: this.config.size
    };
  },

  getStyles: function() {
    return [
      "welcome.css"
    ];
  }
});