const fs = require('node:fs');
const path = require('node:path');
module.exports = function loadCommands(client) {
	const commandsPath = path.join(__dirname, '../commands');
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		delete require.cache[require.resolve(filePath)];
		const command = require(filePath);
		try {
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
				console.log(`Loaded command: ${ command.data.name }`);
			}
			else {
				console.warn(
					`[WARNING] The command at ${ filePath } is missing a required "data" or "execute" property.`,
				);
			}
		}
		catch (error) {
			console.error(`Failed to load command ${ filePath }:`, error);
		}
	}
};