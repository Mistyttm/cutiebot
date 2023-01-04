import dotenv from 'dotenv';
import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';

dotenv.config();
const { TOKEN, APP_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(TOKEN);
const commands = [];

// Grab all command files from the commands directory
const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = import(`./commands/${file}`);

    commands.push(command.default.data.toJSON());
}

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(APP_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.log(error);
    }
})();
