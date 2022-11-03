const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sends a Ping to know if the bot is online'),
    async execute(interaction){
        await interaction.reply('Pong! bot is online');
    }

}