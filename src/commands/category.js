const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("category")
    .setDescription("all category"),

  async execute(interaction) {
    const data = await (
      await axios("https://opentdb.com/api_category.php")
    ).data.trivia_categories;

    console.log(data);
    const embedCategory = new EmbedBuilder();
    embedCategory.setTitle("all category   :smiley: ");

    let msg = "";
    for (let i = 0; i < data.length; i++) {
      msg += "\n" + data[i].name;
    }
    embedCategory.setDescription(msg);

    embedCategory.setTimestamp();
    await interaction.reply({
      embeds: [embedCategory],
      fetchReply: true,
      ephemeral: true,
    });
  },
};
