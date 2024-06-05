var config = {
	address: "localhost",
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
	language: "en",
	timeFormat: 24,
	units: "imperial",
	modules: [
	  {
		// alert
		module: "alert",
		disabled: 0 // alert disabled
	  },
    {
      module: "MMM-NowPlayingOnSpotify",
      position: "top_left",
      disabled: 0,
      showCoverArt: true,
    
      config: {
        clientID: "d8264bf147e445f4b36ccbdef94e4024",
        clientSecret: "6f6d58b29297488495419155630023e0",
        accessToken: "BQC1GDO0g9I-yNcj_V03i4zmDDoNincgxXLe4jKZwUuSIleh2np7MpVNMS1SV1yDoLanGfV6MV6RJ05pz_5BVqLLepbSc9aGOKCCypuyGad73-Q1tMRJEtW6obqlHIOJA067R2nNdrEnY6WFGBpnncD_ljdJU6Xn0RoBzCh4IXy9--ntLlUFpqFhFGvlGg",
        refreshToken: "AQCYVsRbq7FxB8weak_ARMVy9B7Xl7JUY1d72GmZFnc01N2_azdAbtSnTWyuxfNZPXHSSeLV2_dfVCHLQTq5D47Hch1PS-X2pvChDEZb97VWxps6Zl-TBI7m8h8o5ANCav0"
      }
    },    
	  {
		// updatenotification
		module: "updatenotification",
		position: "top_bar", // updatenotification position
		disabled: 69 // updatenotification disabled
	  },
	  {
		// clock
		module: "clock",
		position: "bottom_bar", // clock position
		disabled: 2 // clock disabled
	  },
	  {
		// calendar
		module: "calendar",
		header: "Daniels Calendar",
		position: "top_left", // calendar position
		disabled: 0, // calendar disabled
		config: {
		  calendars: [
			{
			  symbol: "calendar-check",
			  url: "https://calendar.google.com/calendar/ical/dsarni%40ucsc.edu/public/basic.ics"
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