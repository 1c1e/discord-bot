const fs = require('node:fs');
const path = require('node:path');
module.exports = function loadEvents(client) {
	const eventsPath = path.join(__dirname, '../events');
	const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		delete require.cache[require.resolve(filePath)];
		const event = require(filePath);
		try {
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
				console.log(`Loaded one-time event: ${ event.name }`);
			}
			else {
				client.on(event.name, (...args) => event.execute(...args));
				console.log(`Loaded recurring event: ${ event.name }`);
			}
		}
		catch (error) {
			console.error(`Failed to load event ${ file }:`, error);
		}
	}
};