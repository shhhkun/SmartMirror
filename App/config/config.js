var config = {
	address: "localhost",
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
	language: "en",
	timeFormat: 24,
	units: "metric",
	modules: [
	  {
		module: "alert",
	  },
	  {
		module: "weather",
		position: "top_right",
		config: {
		  weatherProvider: "openweathermap",
		  type: "current",
		  location: "New York",
		  locationID: "5128581",
		  apiKey: "YOUR_OPENWEATHER_API_KEY"
		}
	  },
	  {
		module: "newsfeed",
		position: "bottom_bar",
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