import dotenv from 'dotenv';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';

dotenv.config();
const { TOKEN, APP_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(TOKEN);

// Grab all command files from the commands directory
const commandsPath = pathToFileURL('commands');
const commandFiles = readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

// Start grabbing the SlashCommandBuilder#toJSON() output of each command's data for deployment
const commandPromise = commandFiles.map(async (file) => {
    const filePath = path.join(commandsPath.href, file);
    const command = await import(filePath);
    return command.default.data.toJSON();
});

// Wait for all the command data to be fully loaded (no unresolved promises)
// Source: https://zellwk.com/blog/async-await-in-loops/
const commands = await Promise.all(commandPromise);

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
