const { commandFilesCollection } = require('../../utils/loadCommands.js');
const commands = commandFilesCollection();

/***************************************************************************************
* Author: Official discord.js Guide
* Availability: https://discordjs.guide/creating-your-bot/command-handling.html#executing-commands
*
***************************************************************************************/
module.exports = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    // Get the matching command from the commands Collection based on the interaction.commandName 
    const command = commands.get(interaction.commandName);

    // Ignore the event if no matching command was found
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        // Call the command's execute method
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
} 