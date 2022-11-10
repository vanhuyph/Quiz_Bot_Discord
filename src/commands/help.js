const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display a select menu about Quizobot\'s commands.'),
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
							description: 'All information about the setup command',
							value: 'setup',
							emoji: '⚙️'
						},
						{
							label: 'Category command',
							description: 'All information about the category command',
							value: 'category',
							emoji: '📃'
						},
						{
							label: 'Score command',
							description: 'All information about the score command',
							value: 'score',
							emoji: '🎮'
						},
						{
							label: 'Leaderboard command',
							description: 'All information about the leaderboard command',
							value: 'leaderboard',
							emoji: '🏆'
						},
					]),
			);

		const msgEmbed = new EmbedBuilder().setColor('#55ddcc');

		const message = await interaction.reply({ content: 'Select one option below to get its information', components: [row], ephemeral: true });
		const collector = message.createMessageComponentCollector({ componentType: ComponentType.SelectMenu });
		collector.on('collect', async i => {
			const selected = i.values[0];

			// Deferring the update so we don't get interaction failed
			await i.deferUpdate();
			switch (selected) {
				case 'play':
					msgEmbed.setDescription('You can start a multiple choice quiz game of 5 rounds with \`/play\`.');
					await interaction.followUp({ embeds: [msgEmbed], ephemeral: true });
					break;
				case 'setup':
					msgEmbed.setDescription('You can customize a game with \`/setup\`.\nThe config options are: \n▫Category\n▫️Type\n ▫️Difficulty');
					await interaction.followUp({ embeds: [msgEmbed], ephemeral: true });
					break;
				case 'category':
					msgEmbed.setDescription('Show the quiz categories list with \`/categories\`.');
					await interaction.followUp({ embeds: [msgEmbed], ephemeral: true });
					break;
				case 'score':
					msgEmbed.setDescription('Display your score points with \`/score\`.');
					await interaction.followUp({ embeds: [msgEmbed], ephemeral: true });
					break;
				case 'leaderboard':
					msgEmbed.setDescription('Display the leaderboard with \`/lb\`.');
					await interaction.followUp({ embeds: [msgEmbed], ephemeral: true });
					break;
				default:
					break;
			}
		});
	},
};