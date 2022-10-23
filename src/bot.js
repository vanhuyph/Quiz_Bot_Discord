require('dotenv').config();
const { Client } = require('discord.js');

const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });
const token = process.env.TOKEN;

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in!`);
});


client.login(token);