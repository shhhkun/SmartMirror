const { injectMockData } = require("../../utils/weather_mocker");
const helpers = require("./global-setup");

exports.getText = async (element, result) => {
	const elem = await helpers.waitForElement(element);
	expect(elem).not.toBeNull();
	expect(
		elem.textContent
			.trim()
			.replace(/(\r\n|\n|\r)/gm, "")
			.replace(/[ ]+/g, " ")
	).toBe(result);
	return true;
};

exports.startApp = async (configFileName, additionalMockData) => {
	await helpers.startApplication(injectMockData(configFileName, additionalMockData));
	await helpers.getDocument();
};
