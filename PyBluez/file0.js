javascript 
var config = {
    address: "localhost",
    port: 8080,
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
    language: "en", // modifiable
    timeFormat: 24,
    units: "metric",// modifiable
    modules: [
      {
        // alert
        module: "alert",
      },
      {
        // updatenotification
        module: "updatenotification",
        position: "top_bar" // modifiable
      },
      {
        // clock
        module: "clock",
        position: "top_left" // modifiable
      },
      {
        // calendar
        module: "calendar",
        header: "US Holidays", // modifiable
        position: "top_left", // modifiable
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
        position: "lower_third" // modifiable
      },
      {
        // weather
        module: "weather",
        position: "top_right", // modifiable
        config: {
          weatherProvider: "openweathermap",
          type: "current",
          location: "New York",
          locationID: "5128581",
          apiKey: "YOUR_OPENWEATHER_API_KEY"
        }
      },
      {
        // newsfeed
        module: "newsfeed",
        position: "bottom_bar", // modifiable
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