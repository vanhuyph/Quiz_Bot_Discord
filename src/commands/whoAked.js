const { SlashCommandBuilder } = require("discord.js");
const {
  getRandomGifUrl,
  shuffleArrayAndGetOneElement,
} = require("../utils/helperFunctions.js");

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

      const query = [
        "did i ask",
        "who asked",
        "but no one asked",
        "didn't ask + ratio",
      ];
      const randomQuery = shuffleArrayAndGetOneElement(query);

      const user = interaction.options.getUser("member");
      const gifUrl = await getRandomGifUrl(randomQuery);

      await interaction.editReply({ content: `${user}`, files: [gifUrl] });
    } catch (error) {
      console.error('Error executing "whoasked" command:', error);
      await interaction.editReply("Failed to fetch the GIF.");
    }
  },
};
