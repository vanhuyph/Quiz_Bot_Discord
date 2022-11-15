const { Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { Users } = require('../database/dbObjects.js');

/**
 * Retrieve the category data from the API and put it in a collection
 * @returns the collection with the data
 */
const categoriesCollection = async () => {
    const collection = new Collection();
    let data;
    try {
        data = await (await axios('https://opentdb.com/api_category.php')).data.trivia_categories;
    } catch (error) {
        console.log(error);
    }

    for (let obj of data) {
        collection.set(obj.id, obj.name);
    }

    return collection;
}

/**
 * Add score to the user or create the user if he's not present in the db
 * @param {*} userObj the user object containing the id and username
 * @param {*} scoreAmount amount of points to give
 * @returns the user with the score updated or a new user if
 * he wasn't present in the db beforehand
 */
async function addScore(userObj, scoreAmount) {
    const user = await Users.findOne({ where: { user_id: userObj.id } });

    if (user) {
        user.score += Number(scoreAmount);
        if (user.score < 0) {
            user.score = 0;
        }
        return user.save();
    }

    const newUser = await Users.build({ user_id: userObj.id, username: userObj.username, score: scoreAmount });

    if (newUser.score < 0) {
        newUser.score = 0;
    }

    return newUser.save();
}

/**
 * Retrieve all users from the DB
 * @returns all users found
 */
async function getAllUsers() {
    const users = await Users.findAll();

    return users;
}

/**
 * Display the points of the user
 * @param {*} userID the user's ID to display points
 * @returns the points of the user or 0
 */
async function displayScore(userID) {
    const user = await Users.findOne({ where: { user_id: userID } });

    if (user) {
        return user.score;
    }

    return 0;
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
 * (works in both cases multiple choice and true/false)
 * @param {*} choices the choices with which we build the buttons 
 * @returns an array with the built buttons
 */
function buildButtons(choices) {
    let buttons = new ActionRowBuilder();
    const letters = ['A', 'B', 'C', 'D']
    for (let i = 0; i < choices.length; i++) {
        let style, text;
        text = `${letters[i]}: ${choices[i]}`;
        style = ButtonStyle.Secondary;

        buttons.addComponents(
            new ButtonBuilder()
                .setCustomId('answer_' + letters[i])
                .setLabel(text)
                .setStyle(style)
        );
    }

    return [buttons];
}

/**
 * Function to disable the answer buttons and 
 * set the color to the correct answer
 * (works in both cases multiple choice and true/false)
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

module.exports = { categoriesCollection, addScore, getAllUsers, displayScore, shuffle, buildButtons, disableButtons } 