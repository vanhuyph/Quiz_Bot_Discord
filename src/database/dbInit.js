const Sequelize = require('sequelize');

/***************************************************************************************
* Author: renovate[bot]
* Availability: https://sequelize.org/docs/v6/getting-started/
*
***************************************************************************************/
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

require('../models/Users.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force');

sequelize.sync({ force }).then(async () => {
	console.log('Database is ready');
}).catch(console.error);