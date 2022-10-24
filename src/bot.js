require('dotenv').config();
const { Client } = require('discord.js');
const intentOptions = require('./configs/intentOptions.js');

const client = new Client({ intents: intentOptions });
const token = process.env.TOKEN;

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in!`);
});

client.login(token);