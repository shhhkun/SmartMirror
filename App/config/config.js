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
      disabled: 1,
    
      config: {
        clientID: "d8264bf147e445f4b36ccbdef94e4024",
        clientSecret: "6f6d58b29297488495419155630023e0",
        accessToken: "BQAPCg4Rd8yQdYvxQe02-osipY7mwweBJDH2CFXKbIR438D6ENlBXAArHuvpf2tnzQM9jYuSrkodlV2M7d_Jc-UQYj87QhKAVO8zJeI5bZUrK-6OJCszuTVzgGALv9SjoiPxZXAbGkj-BfIsgCNQB9O7bScRNZCG2XT-Kemb8Neu0dDmEL7_4QIScTLDOg",
        refreshToken: "AQBWRAJuTVrJ7d8pxnEwmoDxPYnJJOMnXH220490DX8n5cDYfVGxIbpFaIXraMqp8N9gFdvknK7u2Ti396cV--gT2ZddKYyt43DMTzRw0Btg9ZMKGxGLdtpFifLq1jUGxlc"
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
		header: "Daniels Calendar",
		position: "top_left", // calendar position
		config: {
		  calendars: [
			{
			  symbol: "calendar-check",
			  url: "https://calendar.google.com/calendar/ical/dsarni%40ucsc.edu/public/basic.ics"
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
		position: "lower_third",
    disabled: 1,
		config: {
		  countdownSeconds: 10,
      alwaysLoadNodeHelper: true
		}
	  },
    {
      module: "affirmations",
      position: "lower_third",
      disabled: 0
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