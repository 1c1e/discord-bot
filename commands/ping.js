const {
	SlashCommandBuilder,
} = require('discord.js');
module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		try {
			const ping = client.ws.ping;
			console.log(
				`Ping command executed by: ${ interaction.user.tag }. Current WebSocket ping: ${ ping }ms`);
			await interaction.reply(`Pong! \`${ ping }ms\``);
		}
		catch (error) {
			console.log('Error executing the ping command:', error);
			await interaction.reply('There was an error executing the command.');
		}
	},
};