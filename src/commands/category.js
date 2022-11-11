const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("category")
    .setDescription("Display all categories."),
  async execute(interaction) {
    let data;
    try {
      data = await (await axios("https://opentdb.com/api_category.php")).data.trivia_categories;
    } catch (error) {
      console.log(error);
      return await interaction.channel.send({ content: 'Something went wrong while trying to retrieve the categories... Please try again later!' });
    }

    const embedCategory = new EmbedBuilder().setTitle("All categories:").setTimestamp();

    let msg = '';
    for (let i = 0; i < data.length; i++) {
      msg += '\n' + data[i].name;
    }
    embedCategory.setDescription(msg);

    await interaction.reply({ embeds: [embedCategory], fetchReply: true, ephemeral: true });
  }
}
