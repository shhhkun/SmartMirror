let config = {
	timeFormat: 12,

	modules: [
		{
			module: "clock",
			position: "middle_center",
			config: {
				displaySeconds: false
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
