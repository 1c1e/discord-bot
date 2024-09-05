const { Events } = require('discord.js');
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    try {
      console.log(`Ready! Logged in as ${client.user.tag}`);
    } catch (error) {
      console.error('Error during ready event execution:', error);
    }
  },
};
