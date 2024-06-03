var config = {
	address: "localhost",
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
	language: "es",
	timeFormat: 24,
	units: "metric",
	modules: [
	  {
		// alert
		module: "alert",
		disabled: 0 // 0 or 1
	  },
	  {
		// updatenotification
		module: "updatenotification",
		position: "top_bar",
		disabled: 0 // 0 or 1
	  },
	  {
		// clock
		module: "clock",
		position: "top_left",
		disabled: 0 // 0 or 1
	  },
	  {
		// calendar
		module: "calendar",
		header: "US Holidays",
		position: "top_left",
		disabled: 0, // 0 or 1
		config: {
		  calendars: [
			{
			  symbol: "calendar-check",
			  url: "webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics"
			}
		  ]
		}
	  },
	  {
		// compliments
		module: "compliments",
		position: "lower_third",
		disabled: 0 // 0 or 1
	  },
	  {
		// weather
		module: "weather",
		position: "top_right",
		disabled: 0, // 0 or 1
		config: {
		  weatherProvider: "openweathermap",
		  type: "current",
		  location: "Santa Cruz",
		  //locationID: "5368361",
		  apiKey: "945780832dc712da979aa1bc89616956"
		}
	  },
	  {
		// newsfeed
		module: "newsfeed",
		position: "bottom_bar",
		disabled: 0, // 0 or 1
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
		}
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
if (typeof module !== "undefined") {module.exports = config;}