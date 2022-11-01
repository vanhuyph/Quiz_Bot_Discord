const { SlashCommandBuilder , ActionRowBuilder, Events, SelectMenuBuilder } = require('discord.js');
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
					.addOptions(
						{
							label: ' ❓ Quizz command',
							description: 'all informations about quizz command',
							value: 'quizz',
						},
						{
							label: ' 📝 Set up command',
							description: 'all informations about set up command ',
							value: 'set_up',
						},
                        {
							label: ' 🧪 Test command',
							description: 'all information about test command',
							value: 'test',
						},
                        {
							label: ' 📖 Information command',
							description: 'all information about Set information command ',
							value: 'information',
						},
					),
			);

	        await interaction.reply({ content: 'help', components: [row] });
           
          
		//await interaction.reply('tests!');
	},
    
};