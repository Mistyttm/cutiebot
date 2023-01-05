import dotenv from 'dotenv';
import path from 'node:path';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { writeVerificationCodes } from './helpers/data.js';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

dotenv.config();
const { TOKEN } = process.env;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Load commands from files
client.commands = new Collection();
const commandsPath = pathToFileURL('commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
const commands = commandFiles.map(async (file) => {
    const filepath = path.join(commandsPath.href, file);
    const command = await import(filepath);

    if (command.default.data && command.default.execute) {
        client.commands.set(command.default.data.name, command);
        return command;
    } else if (!command.default.data || !command.default.execute) {
        console.log(`[WARNING] The command at ${filepath} is missing a 'data' or 'execute' property.`);
    } else {
        console.log(`[WARNING] Unknown error with command at ${filepath}.`);
    }
});

// Wait for all commands to be loaded
await Promise.all(commands);
console.log(`Successfully loaded ${client.commands.size}/${commandFiles.length} commands.`);

// Receive command interactions from events
const eventsPath = pathToFileURL('events');
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
const events = eventFiles.map(async (file) => {
    const filepath = path.join(eventsPath.href, file);
    const event = await import(filepath);

    if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
    } else {
        client.on(event.default.name, (...args) => event.default.execute(...args));
    }
    return event;
});

// Wait for all events to be loaded
await Promise.all(events);
console.log(`Successfully loaded ${events.length} events.`);

// Handle ctrl+c exit
process.on('SIGINT', () => {
    process.exit(0);
});

// Write verification codes on exit
process.on('exit', () => {
    writeVerificationCodes();
    console.log('Bye!');
});

client.login(TOKEN);
