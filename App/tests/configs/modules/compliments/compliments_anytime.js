let config = {
	timeFormat: 12,

	modules: [
		{
			module: "compliments",
			position: "middle_center",
			config: {
				compliments: {
					morning: [],
					afternoon: [],
					evening: [],
					anytime: ["Anytime here"]
				}
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
