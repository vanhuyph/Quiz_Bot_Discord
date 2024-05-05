require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { commandFilesArray } = require("./utils/loadCommands.js");

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = commandFilesArray();

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(`Started deleting existing application (/) commands.`);
    const existingCommands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );
    for (const command of existingCommands) {
      await rest.delete(
        Routes.applicationGuildCommand(clientId, guildId, command.id)
      );
    }
    console.log(`Successfully deleted ${existingCommands.length} commands.`);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: commands,
      }
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
