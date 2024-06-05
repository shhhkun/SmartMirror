var config = {
	address: "localhost",
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
	language: "es",
	timeFormat: 24,
	units: "imperial",
	modules: [
	  {
		// alert
		module: "alert",
		disabled: 0 // alert disabled
	  },
	  {
		// updatenotification
		module: "updatenotification",
		position: "top_bar", // updatenotification position
		disabled: 0 // updatenotification disabled
	  },
	  {
		// clock
		module: "clock",
		position: "bottom_bar" // clock position
		disabled: 0 // clock disabled
	  },
	  {
		// calendar
		module: "calendar",
		header: "US Holidays",
		position: "top_left", // calendar position
		disabled: 0, // calendar disabled
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
		position: "lower_third", // compliments position
		disabled: 0 // compliments disabled
	  },
	  {
		// weather
		module: "weather",
		position: "top_right", // weather position
		disabled: 0, // weather disabled
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
		position: "bottom_bar", // news position
		disabled: 0, // news disabled
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
