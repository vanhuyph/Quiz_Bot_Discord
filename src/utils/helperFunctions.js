const { Collection } = require('discord.js');
const axios = require("axios");

const collection = new Collection();

/**
 * Retrieve the categories data and put it in a collection
 * @returns the collection with the data
 */
const categoriesCollection = async () => {
    let data;
    try {
        data = await (await axios("https://opentdb.com/api_category.php")).data.trivia_categories;
    } catch (error) {
        console.log(error);
    }

    for (let obj of data) {
        collection.set(obj.id, obj.name);
    }
    
    return collection;
}

module.exports = { categoriesCollection } 

