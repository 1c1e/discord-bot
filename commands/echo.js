const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('The input to echo back')
        .setMaxLength(2000)
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to echo into')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName('embed')
        .setDescription('Whether or not the echo should be embedded')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const input = interaction.options.getString('input');
    const channel = interaction.options.getChannel('channel');
    const useEmbed = interaction.options.getBoolean('embed');
    const replyMessage = createReplyMessage(input, useEmbed);
    try {
      await channel.send(replyMessage);
      console.log(`Message sent to ${channel.name} by ${interaction.user.tag}`);
      await interaction.reply({ content: `Message sent to ${channel}.` });
    } catch (error) {
      console.error('Error sending message:', error);
      await interaction.reply({
        content: 'There was an error trying to send the message.',
        ephemeral: true,
      });
    }
  },
};
function createReplyMessage(input, useEmbed) {
  if (useEmbed) {
    const embed = new EmbedBuilder().setDescription(input).setColor(0x0099ff).setTimestamp();
    return { embeds: [embed] };
  } else {
    return { content: input };
  }
}
