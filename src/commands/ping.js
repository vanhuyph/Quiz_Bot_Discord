//TODO creer commande pour ping et voir si bot est online

const {SlashCommandBuilder} = require('discord.js');
//const { execute } = require('./play'); mit ça tout seul ?
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sends a Ping to know if the bot is online'),
    async execute(interaction){
        await interaction.reply('Pong! bot is online');
    }

}