const { Events, Collection } = require('discord.js');
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    console.log(`Received interaction by: ${interaction.user.tag}`);
    if (!command) {
      console.warn(`No command was found for interaction: ${interaction.commandName}`);
      return;
    }
    const { cooldowns } = interaction.client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        return interaction.reply({
          content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          ephemeral: true,
        });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    try {
      console.log(`Executing command: ${interaction.commandName}`);
      await command.execute(interaction, interaction.client);
      console.log(`Command executed: ${interaction.commandName}`);
    } catch (error) {
      console.error(`Error executing command: ${interaction.commandName}:`, error);
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
