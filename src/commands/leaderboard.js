const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Users } = require('../database/dbObjects.js')

/**
 * Retrieve all users limited by 10 ordered by their score
 * @returns the top 10 users with the most points
 */
async function searchTop10() {
    const user = await Users.findAll({
        order: [
            ['score', 'DESC']
        ],
        limit: 10
    });

    return user;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('Display the top 10 users with the most points in the server.'),
    async execute(interaction) {
        const userTop10 = await searchTop10();
        const embedMsg = new EmbedBuilder().setTitle('🏆 Top 10 leaderboard 🏆').setColor('#FF47CA');
        let usernames = '';
        let points = '';
        for (let i = 0; i < userTop10.length; i++) {
            const user = userTop10[i];
            if (i === 0) {
                usernames += `🥇 ${user.username}\n`;
            } else if (i === 1) {
                usernames += `🥈 ${user.username}\n`;
            } else if (i === 2) {
                usernames += `🥉 ${user.username}\n`;
            } else {
                usernames += `\`${i + 1}\` ${user.username}\n`;
            }
            points += `${user.score}\n`;
        }
        embedMsg
            .addFields(
                { name: 'Users', value: usernames, inline: true },
                { name: 'Points', value: points, inline: true }
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embedMsg], ephemeral: true });
    }
}

