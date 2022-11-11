const { SlashCommandBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const { categoriesCollection, shuffle, buildButtons, disableButtons, addScore } = require('../utils/helperFunctions.js');
const entities = require('entities');
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Start a quiz game with your configuration.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category to play in. Type \'all\' to play in random categories.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of questions.')
                .setRequired(true)
                .addChoices(
                    { name: 'All', value: 'all' },
                    { name: 'Multiple choice', value: 'multiple' },
                    { name: 'True/false', value: 'boolean' }
                ))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('The difficulty levels.')
                .setRequired(true)
                .addChoices(
                    { name: 'All', value: 'all' },
                    { name: 'Easy', value: 'easy' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Hard', value: 'hard' }
                )),
    async execute(interaction) {
        // Deferring the reply to allow the application fetching all the requested data
        // otherwise the application will not respond in time
        await interaction.deferReply();
        const categories = await categoriesCollection();

        // Retrieve all the user option values
        const userCategoryOption = interaction.options.getString('category').toLowerCase();
        const userTypeOption = interaction.options.getString('type');
        const userDifficultyOption = interaction.options.getString('difficulty');
        let baseURL = 'https://opentdb.com/api.php?amount=5';

        // Get the category's ID in the collection based on the user category value
        let categoryID = categories.findKey(categoryName => categoryName.toLowerCase() === userCategoryOption);

        if (categoryID !== undefined) {
            baseURL += `&category=${categoryID}`;
        }

        if (userTypeOption != 'all') {
            baseURL += `&type=${userTypeOption}`;
        }

        if (userDifficultyOption != 'all') {
            baseURL += `&difficulty=${userDifficultyOption}`;
        }
        console.log(baseURL);

        // API call to get the questions data
        let data;
        try {
            data = await (await axios(baseURL)).data.results;
        } catch (error) {
            console.log(error);
            return await interaction.channel.send({ content: 'Something went wrong while trying to retrieve the questions... Please try again later!' });
        }

        for (let i = 0; i < data.length; i++) {
            const results = data[i];
            console.log(results);
            const question = entities.decodeHTML(results.question);
            const correctAnswer = entities.decodeHTML(results.correct_answer);
            const category = entities.decodeHTML(results.category);
            const difficulty = results.difficulty;
            const type = results.type;

            let choices = [];

            // Construct an embed with all the questions data
            const embedQuestion = new EmbedBuilder()
                .setTitle(`Question ${i + 1}:\n${question}`)
                .setFooter({ text: 'Category: ' + category + '\nYou have 10s to answer.' });

            if (type === 'boolean') {
                choices = ['True', 'False'];
            }
            else {
                choices = [correctAnswer];
                results.incorrect_answers.forEach(element => {
                    choices.push(entities.decodeHTML(element));
                });
                shuffle(choices);
                embedQuestion.setDescription(
                    '\n**Choices:**\n' +
                    '\n 🇦 ' + choices[0] +
                    '\n\n 🇧 ' + choices[1] +
                    '\n\n 🇨 ' + choices[2] +
                    '\n\n 🇩 ' + choices[3])
            }

            // Instantiate a new embed for the results that will be used later on
            const resultMsgEmbed = new EmbedBuilder();
            let scoreAmount;

            // Set the score amount and the color of the embeds based on the question's difficulty
            if (difficulty === 'easy') {
                scoreAmount = 5;
                embedQuestion.setColor('#66ff00')
                resultMsgEmbed.setColor('#66ff00')
            }
            else if (difficulty === 'medium') {
                scoreAmount = 10;
                embedQuestion.setColor('#df8830')
                resultMsgEmbed.setColor('#df8830')
            }
            else {
                scoreAmount = 20;
                embedQuestion.setColor('#e32636')
                resultMsgEmbed.setColor('#e32636')
            }

            // Variable to hold the answer and compare it with the user's answer later on
            let holdingAnswer = '';
            if (correctAnswer === choices[0]) {
                holdingAnswer = 'answer_A';
            }
            else if (correctAnswer === choices[1]) {
                holdingAnswer = 'answer_B';
            }
            else if (correctAnswer === choices[2]) {
                holdingAnswer = 'answer_C';
            }
            else {
                holdingAnswer = 'answer_D';
            }

            const buttons = buildButtons(choices);
            let message;

            if (!interaction.replied) {
                // Need to edit the reply after deferring otherwise the bot's message will be stuck
                message = await interaction.editReply({ embeds: [embedQuestion], components: buttons, fetchReply: true });
            } 
            else {
                message = await interaction.channel.send({ embeds: [embedQuestion], components: buttons, fetchReply: true });
            }

            // Add a createMessageComponentCollector to collect all the answers from the user
            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 });

            // Array holding all the users answering to the quiz
            let userAnswering = [];

            // Start to collect the answers
            collector.on('collect', async i => {
                // Check whether the userID property exists in the array or not and if the latter, then add it
                var index = userAnswering.findIndex(x => x.userID === i.user.id);

                if (index === -1) {
                    userAnswering.push({ userID: i.user.id, username: i.user.username, messageID: i.message.id, answerID: i.customId });
                } else {
                    // Allow to change the user's answer without modifying the whole object
                    let newArr = userAnswering.map(u => u.userID === i.user.id ? { ...u, answerID: i.customId } : u);
                    // Make a copy of newArr array using the SPREAD operator
                    userAnswering = [...newArr];
                }

                if (userAnswering.length > 1) {
                    await i.update(`${userAnswering.length} users answered!`);
                }
                else {
                    await i.update('Somebody answered!');
                }
            });

            const disabledButtons = disableButtons(buttons, correctAnswer);

            // Will be executed when the collector completes
            collector.on('end', async collected => {
                console.log(`Collected ${collected.size} interactions.`);
                // Slicing the string to get only the letter (A, B, C or D)
                const answerLetter = holdingAnswer.slice(7);
                // If no interactions collected, send the didn't answer embed message
                if (collected.size === 0) {
                    resultMsgEmbed.setDescription(`The good answer was ${answerLetter}: ${correctAnswer}`)
                    await message.edit({ content: 'Nobody answered!', embeds: [embedQuestion], components: disabledButtons, fetchReply: true })
                    return await interaction.channel.send({ embeds: [resultMsgEmbed] });
                }

                // String to hold all the usernames who answered correctly
                let usernames = '';
                for (let i = 0; i < userAnswering.length; i++) {
                    const element = userAnswering[i];
                    // If the last answer of the user correspond to the correct answer,
                    // concatenate the string with the username + amount of points gained and call the addScore function
                    if (element.answerID === holdingAnswer) {
                        usernames += `\n${element.username}: +${scoreAmount} points`;
                        addScore(element, scoreAmount);
                    }
                }
                usernames === '' ? usernames = '\nNobody had the correct answer!' : usernames;
                resultMsgEmbed.setDescription(`The good answer was ${answerLetter}: ${correctAnswer}\nUsers with the correct answer:${usernames}`)

                // Edit the message to replace it with disabled buttons and send the result embed
                await message.edit({ embeds: [embedQuestion], components: disabledButtons, fetchReply: true })
                return await interaction.channel.send({ embeds: [resultMsgEmbed] });
            });

            // Adding a delay of 15s to allow time in between questions, otherwise the for loop will
            // quickly fire all the questions at once
            await wait(15000);
        }

        // Little embed to announce the last round ended
        const endEmbed = new EmbedBuilder()
            .setDescription('It was the last round. You can check your score points with \`/score\` or display the leaderboard with \`/lb\`.')
            .setColor('#4f46e5 ');
        return await interaction.channel.send({ embeds: [endEmbed] });
    }
}