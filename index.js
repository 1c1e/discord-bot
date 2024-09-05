const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require('discord.js');
const {
	token,
} = require('./config.json');
const {
	startMetricsServer,
} = require('./scripts/promClient');
const loadEvents = require('./core/loadEvents');
const loadCommands = require('./core/loadCommands');
const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageReactions,
];
const partials = [Partials.Message, Partials.Channel, Partials.Reaction];
const client = new Client({
	intents,
	partials,
});
client.commands = new Collection();
client.cooldowns = new Collection();
loadEvents(client);
loadCommands(client);
startMetricsServer();
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
client.login(token).catch(error => {
	console.error('Failed to login:', error);
});