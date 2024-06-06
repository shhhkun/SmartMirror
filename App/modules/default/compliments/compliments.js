Module.register("compliments", {
	defaults: {
		compliments: {
			anytime: ["Welcome"],
			morning: ["Good morning!"],
			afternoon: ["Good afternoon!"],
			evening: ["Good evening!"],
			"....-01-01": ["Happy new year!"]
		},
		updateInterval: 30000,
		remoteFile: null,
		fadeSpeed: 4000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17,
		random: true
	},
	lastIndexUsed: -1,
	currentWeatherType: "",

	getScripts () {
		return ["moment.js"];
	},

	async start () {
		Log.info(`Starting module: ${this.name}`);

		this.lastComplimentIndex = -1;

		if (this.config.remoteFile !== null) {
			const response = await this.loadComplimentFile();
			this.config.compliments = JSON.parse(response);
			this.updateDom();
		}

		const userId = await this.loadUserId();
		const userName = await this.loadUserName(userId);
		this.config.compliments.anytime[0] = `Hi ${userName}!`;

		setInterval(() => {
			this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	randomIndex (compliments) {
		if (compliments.length <= 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	complimentArray () {
		const hour = moment().hour();
		const date = moment().format("YYYY-MM-DD");
		let compliments = [];

		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime && this.config.compliments.hasOwnProperty("morning")) {
			compliments = [...this.config.compliments.morning];
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime && this.config.compliments.hasOwnProperty("afternoon")) {
			compliments = [...this.config.compliments.afternoon];
		} else if (this.config.compliments.hasOwnProperty("evening")) {
			compliments = [...this.config.compliments.evening];
		}

		if (this.currentWeatherType in this.config.compliments) {
			Array.prototype.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
		}

		Array.prototype.push.apply(compliments, this.config.compliments.anytime);

		for (let entry in this.config.compliments) {
			if (new RegExp(entry).test(date)) {
				Array.prototype.push.apply(compliments, this.config.compliments[entry]);
			}
		}

		return compliments;
	},

	async loadUserId() {
		try {
			const response = await fetch('../../js/userId.js');
			const userIdContent = await response.text();
			const userIdMatch = userIdContent.match(/exports\.userId\s*=\s*"(.+)"/);
			return userIdMatch ? userIdMatch[1] : 'default';
		} catch (error) {
			console.error('Error loading user ID:', error);
			return 'default';
		}
	},

	async loadUserName(userId) {
		try {
			const response = await fetch(`../../config/${userId}.js`);
			const configContent = await response.text();
			const nameMatch = configContent.match(/\/\/\s*Name\s*=\s*(.+)/i);
			return nameMatch ? nameMatch[1].trim() : userId;
		} catch (error) {
			console.error('Error loading user name:', error);
			return userId;
		}
	},

	getRandomCompliment () {
		const compliments = this.complimentArray();
		let index;
		if (this.config.random) {
			index = this.randomIndex(compliments);
		} else {
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}

		return compliments[index] || "";
	},

	async loadComplimentFile () {
		const isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			url = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		const response = await fetch(url);
		return await response.text();
	},

	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
		const complimentText = this.getRandomCompliment();
		const parts = complimentText.split("\n");
		const compliment = document.createElement("span");
		for (const part of parts) {
			if (part !== "") {
				compliment.appendChild(document.createTextNode(part));
				compliment.appendChild(document.createElement("BR"));
			}
		}
		if (compliment.children.length > 0) {
			compliment.lastElementChild.remove();
			wrapper.appendChild(compliment);
		}
		return wrapper;
	},

	notificationReceived (notification, payload, sender) {
		if (notification === "CURRENTWEATHER_TYPE") {
			this.currentWeatherType = payload.type;
		}
	}
});