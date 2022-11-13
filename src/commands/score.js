const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { displayScore } = require('../utils/helperFunctions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('Display your points gathered from the quiz game.'),
    async execute(interaction) {
        const userScore = await displayScore(interaction.user.id);
        return interaction.reply({
            content: codeBlock(`You currently have ${userScore} points.`),
            ephemeral: true
        });
    }
}