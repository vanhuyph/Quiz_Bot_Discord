const { SlashCommandBuilder, PermissionFlagsBits, codeBlock } = require('discord.js');
const { addScore, displayScore } = require('../utils/helperFunctions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change_score')
        .setDescription('Select a member and show his points or change his score points.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_info')
                .setDescription('Show the score points of the user.')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user to show points.')
                        .setRequired(true)
                ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_points')
                .setDescription('Change the score points of the user.')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The member to change score.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('points')
                        .setDescription('The amount of points to add or remove.')
                        .setRequired(true)
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        // Retrieve the option values
        const user = interaction.options.getUser('target');

        if (interaction.options.getSubcommand() === 'user_info') {
            const userScore = await displayScore(user.id);

            return interaction.reply({
                content: codeBlock(`${user.username} has ${userScore} points.`),
                ephemeral: true
            });
        }
        else if (interaction.options.getSubcommand() === 'user_points') {
            const points = interaction.options.getInteger('points');

            await addScore(user, points);
            const userScore = await displayScore(user.id);

            return interaction.reply({
                content: codeBlock(`Change successful. ${user.username} has now ${userScore} points.`),
                ephemeral: true
            });
        }
    }
}
