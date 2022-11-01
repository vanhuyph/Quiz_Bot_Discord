const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with all command'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Play command',
							description: 'All information about the play command',
							value: 'play',
							emoji: '❓'
						},
						{
							label: 'Setup command',
							description: 'All information about the setup command ',
							value: 'setup',
							emoji: '📝'
						},
						{
							label: 'Test command',
							description: 'All information about the test command',
							value: 'test',
							emoji: '🧪'
						},
						{
							label: 'Information command',
							description: 'All information about Set information command ',
							value: 'information',
							emoji: '📖'
						},
					]),
			);

		const playEmbed = new EmbedBuilder().setDescription('You can start a quiz game of 10 rounds with the /play command.');
		const setupEmbed = new EmbedBuilder().setDescription('You can customize the quiz with the /setup command.');	
		
		const message = await interaction.reply({ content: 'Select one option below to get information', components: [row], ephemeral: true });
		const collector = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu });
		collector.on('collect', async i => {
			const selected = i.values[0];
			await i.deferUpdate();
			if (selected === 'play') {
				await interaction.followUp({ embeds: [playEmbed], ephemeral: true });
			}
			if (selected === 'setup') {
				await interaction.followUp({ embeds: [setupEmbed], ephemeral: true });
			}
		});

		// collector.on('end', collected => {
		// 	console.log(`Collected ${collected.size} interactions.`);
		// });
	},
};