const axios = require('axios');
const { Events, EmbedBuilder } = require('discord.js');
const { deeplApiKey } = require('../config.json');
const { languageMap } = require('./languageMap');
module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    console.log(
      `Reaction added by user: ${user.tag}, Reaction: ${reaction.emoji.name}, Message ID: ${reaction.message.id}`,
    );
    if (user.bot) return;
    const { message } = reaction;
    const targetLanguage = languageMap[reaction.emoji.name];
    if (targetLanguage) {
      if (message.partial) {
        console.log(`Message ${reaction.message.id} is partial, fetching full message.`);
        try {
          await message.fetch();
        } catch (error) {
          console.error(`Failed to fetch message ${reaction.message.id}:`, error);
          return;
        }
      }
      const { content } = message;
      if (content) {
        try {
          const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
            params: {
              auth_key: deeplApiKey,
              text: content,
              target_lang: targetLanguage,
              formality: 'prefer_less',
            },
          });
          const translatedText = response.data.translations[0].text;
          const sourceLanguage = response.data.translations[0].detected_source_language;
          const embed = new EmbedBuilder()
            .setDescription(translatedText)
            .setFooter({ text: `Translated from ${sourceLanguage} to ${targetLanguage}` });
          await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
          console.log(
            `Message ${reaction.message.id} translated to ${targetLanguage} from ${sourceLanguage}.`,
          );
        } catch (error) {
          console.error(`Error translating message ${reaction.message.id}:`, error);
        }
      } else {
        console.error(`Error: Message ${reaction.message.id} content is undefined or empty.`);
      }
    } else {
      console.log(
        `Reaction added by user: ${user.tag}, Reaction: ${reaction.emoji.name}, Message ID: ${reaction.message.id} is not in the languageMap, no action taken.`,
      );
    }
  },
};
