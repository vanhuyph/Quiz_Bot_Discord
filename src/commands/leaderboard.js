const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');
const { getAllUsers } = require('../utils/helperFunctions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('Display the top 10 users with the most points in the server.'),
    async execute(interaction) {
        const usersFromDB = await getAllUsers();
        let members = [];

        const embedMsg = new EmbedBuilder().setTitle('🏆 Top 10 leaderboard 🏆').setColor('#FF47CA');
        if (usersFromDB.length === 0) {
            embedMsg.setDescription('Nobody is ranked yet... Be the first one to score points!');
            return await interaction.reply({ embeds: [embedMsg], ephemeral: true });
        }

        for (let obj of usersFromDB) {
            // If we find a user with the same ID in the discord server cache as the one in the DB,
            // add it to the members array
            if (interaction.guild.members.cache.map((member) => member.id).includes(obj.user_id)) {
                members.push(obj);
            }
        }

        // Sorting the members by their scores DESC
        members = members.sort(function (a, b) {
            return b.score - a.score;
        })

        let pos = 1;
        for (let obj of members) {
            if (obj.user_id === interaction.user.id) {
                embedMsg.setFooter({ text: `You're ranked #${pos} in the leaderboard.` });
            }
            pos++;
        }

        // Limiting the length of members array because we only want the top 10 users
        members.slice(0, 10);

        // Variables to concatenate users + points
        let usernames = '';
        let userPoints = '';

        for (let i = 0; i < members.length; i++) {
            // Getting the user object that has been cached in the server by his ID
            let user = interaction.client.users.cache.get(members[i].user_id);
            // Mentioning the @user
            let mentionUser = userMention(user.id);

            if (!user) {
                return;
            }
            if (i + 1 === 1) {
                usernames += `🥇 ${mentionUser}\n`;
            }
            else if (i + 1 === 2) {
                usernames += `🥈 ${mentionUser}\n`;
            }
            else if (i + 1 === 3) {
                usernames += `🥉 ${mentionUser}\n`;
            }
            else {
                usernames += `\`${i + 1}\` ${mentionUser}\n`;
            }
            userPoints += `\n${members[i].score}`;
        }

        embedMsg
            .addFields(
                { name: 'Users', value: usernames, inline: true },
                { name: 'Points', value: userPoints, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embedMsg], ephemeral: true });
    }
}