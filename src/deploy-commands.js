require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { commandFilesArray } = require('./utils/loadCommands.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
// For development and testing purposes
// const guildId = process.env.GUILD_ID;

const commands = commandFilesArray();

/***************************************************************************************
* Author: Official discord.js Guide
* Availability: https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
*
***************************************************************************************/
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();