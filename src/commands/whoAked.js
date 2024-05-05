const { SlashCommandBuilder } = require("discord.js");
const { getRandomGifUrl } = require("../utils/helperFunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("who")
    .setDescription('Responds with a random "who asked" GIF.')
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The name of the member to mention.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const user = interaction.options.getUser("member");
      const gifUrl = await getRandomGifUrl("who asked");

      await interaction.editReply({ content: `${user}`, files: [gifUrl] });
    } catch (error) {
      console.error('Error executing "whoasked" command:', error);
      await interaction.editReply("Failed to fetch the GIF.");
    }
  },
};
