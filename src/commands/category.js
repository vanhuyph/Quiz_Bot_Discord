const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { categoriesCollection } = require('../utils/helperFunctions.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('category')
    .setDescription('Display all categories.'),
  async execute(interaction) {
    // Deferring the reply to allow the application fetching all the requested data
    // otherwise the application will not respond in time
    await interaction.deferReply({ ephemeral: true });
    const categories = await categoriesCollection();
    const embedCategory = new EmbedBuilder().setTitle('📃 All categories 📃').setTimestamp();

    let msg = '';
    for (let i = 0; i < categories.size; i++) {
      msg += '\n▫️' + categories.at(i);
    }
    embedCategory.setDescription(msg);

    // Need to edit the reply after deferring otherwise the bot's message will be stuck
    await interaction.editReply({ embeds: [embedCategory], fetchReply: true });
  }
}