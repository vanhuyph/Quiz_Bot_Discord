<h1 align="center">
  QuizoBot
</h1>
<p align="center">
  <a href="https://github.com/vanhuyph/QuizoBot_Discord">
    <img src="https://imgur.com/xkCtTxx.png" alt="quizobot_logo" width="170">
  </a>
</p>
<h4 align="center">
  A Discord trivia bot with over 4,000 questions and multiple commands available. Built with <a href="https://nodejs.org/en/">Node.js</a>.
</h4>

# Discord QuizoBot :robot:
QuizoBot is a Discord bot bringing to your server a fun multiplayer quiz game. You have the option of playing by yourself but you can also play with the other members of your Discord server and grind the ranks thanks to the leaderboard implemented by the bot.

With the help of [OpenTDB](https://opentdb.com/), QuizoBot provides you over 4,000 questions and 24 different categories for endless games.

The project is based on an event-driven architecture.

## Contents
* [How to install](#how-to-install-computer)
* [Commands availabe](#commands-available-game_die)
* [Reused code source links](#reused-code-source-links-sparkling_heart)
* [Contributors](#contributors-star2)

## How to install :computer:
**Creating a Discord bot account**
1. Log your Discord account on the [Discord developer portal](https://discord.com/developers/applications) and click on the "New Application" button.
2. Provide a name to your bot and click on the "Create" button.
3. On the left sidebar, click on "Bot" and then click on the "Add Bot" button on the right.
4. Now, you'll need your bot's password. Under "Token", press on the "Reset Token" button, copy your token and then keep it somewhere safe. Don't worry, if you lose your bot's token you'll still have the ability to reset your token again which will invalidate the previous one.
5. On the same page, under the "Privileged Gateway Intents" section, enable the "MESSAGE CONTENT INTENT" option. It'll be needed when running the bot.
6. Grab the link below and paste it into your browser while replacing "YOUR_CLIENT_ID_HERE" with yours. Your client ID is available in the sidebar OAuth2 -> General -> Client information. Finally, select the server where you want your bot to appear.

```sh
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID_HERE&permissions=0&scope=bot%20applications.commands
```
**Setting up the bot and installation**
1. Make sure to have [Node.js](https://nodejs.org/en/) 16.9.0 or newer. You can check your node's version in a prompt with 
```sh
node -v
```
2. Clone this repo
```sh
git clone https://github.com/vanhuyph/QuizoBot_Discord.git
```
3. Replace the values in the `.env.example` file with your bot's token and client ID from earlier and remove the `.example`
```sh
TOKEN='YOUR_BOT_TOKEN_HERE'
CLIENT_ID='YOUR_CLIENT_ID_HERE'
```
4. Install the dependencies
```sh
npm install
```
5. Initialize the local DB
```sh
npm run dbInit
```
6. Lastly, start the app
```sh
npm start
```
> **Note:**
> In case you want to reset the local DB use `npm run forceInitdb`.

## Commands available :game_die:
* `/category` Sends you the categories list available.
* `/change_score user_info <target> (admin only)` Displays the target score points.
* `/change_score user_points <target> <points> (admin only)` Changes the target score points.
* `/help` Displays a select menu listing out the QuizoBot's commands with their uses.
* `/lb` Shows the top 10 users with the most points in the server.
* `/play` Starts a multiple choice game with 5 rounds.
* `/setup <category> <type> <difficulty>` Starts a game with your provided configuration.
*  `/score` Displays your personnal score points.

## Reused code source links :sparkling_heart:
Path of the file where the reused code is located  | Author of the reused source code | URL where the reused code is available | Reason for the reuse of the code
------------- | ------------- | ------------- | -------------
`src/database/dbInit.js`  | renovate[bot]  | [Here](https://sequelize.org/docs/v6/getting-started/)  | Connect to the DB.
`src/deploy-commands.js`  | Official discord.js Guide  | [Here](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands)  | Register and update the slash commands for the bot application.
`src/events/handlers/interactionCreateHandler.js`  | Official discord.js Guide  | [Here](https://discordjs.guide/creating-your-bot/command-handling.html#executing-commands)  | Get the information of the matching command dynamically and call its execute method
`src/utils/helperFunctions.js`  | Jeff  | [Here](https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)  | Shuffle an array using the modern version of the Fisher–Yates algorithm.
`src/utils/loadCommands.js`  | Official discord.js Guide  | [Here](https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files)  | Retrieve command files dynamically in the commands folder, to load them on the bot startup.

## Contributors :star2:
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/vanhuyph">
        <img
          src="https://avatars.githubusercontent.com/u/73757636?v=4"
          width="100"
        />
        <br />
        <sub>
          <b>vanhuyph</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Chmouss">
        <img
          src="https://avatars.githubusercontent.com/u/61546233?v=4"
          width="100"
        />
        <br />
        <sub>
          <b>Chmouss</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AlexandrePronce">
        <img
          src="https://avatars.githubusercontent.com/u/72044480?v=4"
          width="100"
        />
        <br />
        <sub>
          <b>AlexandrePronce</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AbdenourDidi">
        <img
          src="https://avatars.githubusercontent.com/u/90783777?v=4"
          width="100"
        />
        <br />
        <sub>
          <b>AbdenourDidi</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
<p align="right"><a href="#contents">Back to top</a></p>