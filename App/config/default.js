var config = {
  address: "localhost",
  port: 8080,
  ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
  language: "en",
  timeFormat: 24,
  units: "metric",
  modules: [
    {
      // alert
      module: "alert",
      disabled: 0 // 0 or 1
    },
    {
      module: "MMM-NowPlayingOnSpotify",
      position: "top_left",
      disabled: 1,
      showCoverArt: true,

      config: {
        clientID: "",
        clientSecret: "",
        accessToken: "",
        refreshToken: ""
      }
    },
    {
      // updatenotification
      module: "updatenotification",
      position: "top_left", // updatenotification position
      disabled: 0 // updatenotification disabled
    },
    {
      // clock
      module: "clock",
      position: "top_left", // clock position
      disabled: 0 // clock disabled
    },
    {
      // calendar
      module: "calendar",
      header: "Calendar",
      position: "top_left", // calendar position
      config: {
        calendars: [
          {
            symbol: "calendar-check",
            url: "https://www.calendarlabs.com/templates/ical/US-Holidays.ics"
          }
        ]
      },
      disabled: 0 // calendar disabled
    },
    {
      // compliments
      module: "compliments",
      position: "bottom_bar", // compliments position
      disabled: 0 // compliments disabled
    },
    {
      // weather
      module: "weather",
      position: "top_right", // weather position
      config: {
        weatherProvider: "openweathermap",
        type: "current",
        location: "Santa Cruz",
        //locationID: "5368361",
        apiKey: "945780832dc712da979aa1bc89616956"
      },
      disabled: 0 // weather disabled
    },
    {
      // newsfeed
      module: "newsfeed",
      position: "top_left", // news position
      config: {
        feeds: [
          {
            title: "New York Times",
            url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
          }
        ],
        showSourceTitle: true,
        showPublishDate: true,
        broadcastNewsFeeds: true,
        broadcastNewsUpdates: true
      },
      disabled: 0 // news disabled
    },
    {
      // counter
      module: "counter",
      position: "top_left",
      disabled: 1,
      config: {
        countdownSeconds: 10,
        alwaysLoadNodeHelper: true
      }
    }
  ]
};

// Function to convert 0/1 to false/true for the disabled field
function convertDisabledField(modules) {
  modules.forEach(module => {
    if (module.disabled === 0 || module.disabled === 1) {
      module.disabled = module.disabled === 1;
    }
  });
}

// Convert the disabled fields in the config
convertDisabledField(config.modules);

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
