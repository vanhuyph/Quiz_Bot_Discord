const { SlashCommandBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
const { addScore, displayScore } = require('../utils/helperFunctions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changescore')
        .setDescription('Select a member and change his score points.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to change score points.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('points')
                .setDescription('Amount of points to add or remove.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        // Retrieve the option values
        const user = interaction.options.getUser('target');
        const points = interaction.options.getInteger('points');

        await addScore(user, points);
        const userScore = await displayScore(user.id);

        return interaction.reply({
            content: codeBlock(`Command successful. ${user.username} has now ${userScore} points.`),
            ephemeral: true
        });
    }
}