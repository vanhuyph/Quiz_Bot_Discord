const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');

// Grab all the js command files from the commands directory
const commandsPath = path.join(__dirname, '../commands');
// Filter to ensure that only command js files are taken
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

let commandsCollection = new Collection();
let commandsArray = [];

/***************************************************************************************
* Author: Official discord.js Guide
* Availability: https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files
*
***************************************************************************************/
const commandFilesCollection = () => {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // For each file being loaded, check that it has at least the data and execute properties
        if ('data' in command && 'execute' in command) {
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            commandsCollection.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    return commandsCollection;
}

// Grab the SlashCommandBuilder to JSON output of each command's data for deployment
const commandFilesArray = () => {
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commandsArray.push(command.data.toJSON());
    }
    return commandsArray;
}

module.exports = { commandFilesCollection, commandFilesArray }