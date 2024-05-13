let config = {
	modules: [
		{
			module: "compliments",
			position: "lower_third",
			animateIn: "flipOutX",
			animateOut: "flipInX",
			config: {
				compliments: {
					anytime: ["AnimateCSS Testing..."]
				},
				updateInterval: 2000,
				fadeSpeed: 1000
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
