const { SlashCommandBuilder, codeBlock } = require("discord.js");
const { Users } = require('../database/dbObjects.js')

/**
 * Display the points of the user
 * @param {*} userID the user's ID to display points
 * @returns the points of the user or 0
 */
async function displayScore(userID) {
    const user = await Users.findOne({ where: { user_id: userID } });

    if (user) {
        return user.score;
    }

    return 0;
}

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