const { Events } = require('discord.js');
module.exports = {
  name: Events.ShardError,
  async execute(error) {
    console.error('A websocket connection encountered an error:', error);
  },
};
