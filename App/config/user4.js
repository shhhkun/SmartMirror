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
		disabled: false
	  },
	  {
		// updatenotification
		module: "updatenotification",
		position: "top_bar",
		disabled: false
	  },
	  {
		// clock
		module: "clock",
		position: "top_left",
		disabled: false
	  },
	  {
		// calendar
		module: "calendar",
		header: "US Holidays",
		position: "top_left",
		disabled: false,
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
		disabled: false
	  },
	  {
		// weather
		module: "weather",
		position: "top_right",
		disabled: false,
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
		disabled: false,
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
	  }
	]
  };
  
  /*************** DO NOT EDIT THE LINE BELOW ***************/
  if (typeof module !== "undefined") {module.exports = config;}