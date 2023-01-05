import dotenv from 'dotenv';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';

dotenv.config();
const { TOKEN, APP_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(TOKEN);
const commandData = [];

// Grab all command files from the commands directory
const commandsPath = pathToFileURL('commands');
const commandFiles = readdirSync(pathToFileURL('commands'))
    .filter((file) => file.endsWith('.js'));
const commands = commandFiles.map((file) => path.join(commandsPath.href, file));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commands) {
    const command = await import(file);

    commandData.push(command.default.data.toJSON());
};

(async () => {
    try {
        console.log(`Started refreshing ${commandData.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(APP_ID),
            { body: commandData },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.log(error);
    }
})();
