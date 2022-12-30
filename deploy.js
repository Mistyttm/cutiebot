require('dotenv').config();
const { readdirSync } = require('node:fs');
const { REST, Routes } = require('discord.js');

const token = process.env.TOKEN;
const applicationId = process.env.APP_ID;

const rest = new REST({ version: '10' }).setToken(token);

const commands = [];

// Grab all command files from the commands directory
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(applicationId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.log(error);
    }
})();
