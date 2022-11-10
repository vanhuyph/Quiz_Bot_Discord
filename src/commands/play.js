const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const entities = require('entities');
const axios = require('axios');
const wait = require('node:timers/promises').setTimeout;
const { Users } = require('../database/dbObjects.js')

/**
 * Add score to the user or create the user if he's not present in the db
 * @param {*} userID the user's ID to add score
 * @param {*} scoreAmount amount of points to give
 * @returns the user with the score updated or a new user if 
 * he wasn't present in the db beforehand
 */
async function addScore(userObj, scoreAmount) {
    const user = await Users.findOne({ where: { user_id: userObj.userID } });

    if (user) {
        user.score += Number(scoreAmount);
        return user.save();
    }

    const newUser = await Users.create({ user_id: userObj.userID, username: userObj.username, score: scoreAmount });

    return newUser;
}

/***************************************************************************************
* Author: Jeff
* Availability: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
*
***************************************************************************************/
function shuffle(array) {
    var i, j, temporaryValue;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temporaryValue = array[i];
        array[i] = array[j];
        array[j] = temporaryValue;
    }
    return array;
}

/**
 * Function to help build the answer buttons
 * @param {*} answers the answers to build the buttons for 
 * @returns an array with the built buttons
 */
function buildButtons(answers) {
    let buttons = new ActionRowBuilder();
    const letters = ['A', 'B', 'C', 'D']
    for (let i = 0; i < answers.length; i++) {
        let style, text;
        text = `${letters[i]}: ${answers[i]}`;
        style = ButtonStyle.Secondary;

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId("answer_" + letters[i])
                .setLabel(text)
                .setStyle(style)
        );
    }
    return [buttons];
}

/**
 * Function to disable the answer buttons and 
 * set the color to the correct answer
 * @param {*} buttons the buttons to disable
 * @param {*} correctAnswer the answer to set the color
 * @returns an array with the disabled buttons
 */
function disableButtons(buttons, correctAnswer) {
    let disabledButtons = new ActionRowBuilder();
    const length = buttons[0].components.length;
    const letters = ['A', 'B', 'C', 'D']
    for (let i = 0; i < length; i++) {
        if (buttons[0].components[i].data.label === `${letters[i]}: ${correctAnswer}`) {
            buttons[0].components[i].setStyle(ButtonStyle.Success);
        }
        disabledButtons.addComponents(buttons[0].components[i].setDisabled(true));
    }
    return [disabledButtons]
}

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Start a standard multiple choice game of 5 rounds.'),
    async execute(interaction) {
        // API call to get the questions data
        let data;
        try {
            data = await (await axios('https://opentdb.com/api.php?amount=5&type=multiple')).data.results;
        } catch (error) {
            console.log(error);
            return await interaction.channel.send({ content: 'Something went wrong while trying to retrieve the questions. Try again!' });
        }
        for (let i = 0; i < data.length; i++) {
            // Results take the following form:
            // {
            //     category: 'Entertainment: Japanese Anime & Manga',
            //     type: 'multiple',
            //     difficulty: 'hard',
            //     question: 'In the first episode of Yu-Gi-Oh: Duel Monsters, what book is Seto Kaiba seen reading at Domino High School?',
            //     correct_answer: 'Thus Spoke Zarathustra',
            //     incorrect_answers: [ 'Beyond Good and Evil', 'The Republic', 'Meditations' ]
            //  }
            const results = data[i];
            console.log(results);
            const question = entities.decodeHTML(results.question);
            const correctAnswer = entities.decodeHTML(results.correct_answer);
            const category = entities.decodeHTML(results.category);
            const difficulty = results.difficulty;
            const choices = [correctAnswer];
            results.incorrect_answers.forEach(element => {
                choices.push(entities.decodeHTML(element));
            });
            shuffle(choices);
            console.log(correctAnswer);

            // Construct an embed with all the questions data
            const embedQuestion = new EmbedBuilder().setTitle(`Question ${i + 1}:\n${question}`)
                .setDescription(
                    '\n**Choices:**\n' +
                    '\n 🇦 ' + choices[0] +
                    '\n\n 🇧 ' + choices[1] +
                    '\n\n 🇨 ' + choices[2] +
                    '\n\n 🇩 ' + choices[3])
                .setFooter({ text: category + '\nYou have 10s to answer.' });

            // Set the score amount and the color of the embed based on the question's difficulty
            let scoreAmount;
            if (difficulty === 'easy') {
                scoreAmount = 5;
                embedQuestion.setColor('#66ff00')
            }
            else if (difficulty === 'medium') {
                scoreAmount = 10;
                embedQuestion.setColor('#df8830')
            }
            else {
                scoreAmount = 20;
                embedQuestion.setColor('#e32636')
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
                message = await interaction.reply({ embeds: [embedQuestion], components: buttons, fetchReply: true });
            } else {
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
                } else {
                    await i.update('Somebody answered!');
                }
            });

            // Instantiate a new embed for the results
            let resultMsgEmbed = new EmbedBuilder();
            if (difficulty === 'easy') {
                resultMsgEmbed.setColor('#66ff00')
            }
            else if (difficulty === 'medium') {
                resultMsgEmbed.setColor('#df8830')
            }
            else {
                resultMsgEmbed.setColor('#e32636')
            }

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
    }
}