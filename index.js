import dotenv from 'dotenv';
import path from 'node:path';
import { readdirSync } from 'node:fs';
import url from 'url';
import { writeVerificationCodes } from './helpers/data.js';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

dotenv.config();
const { TOKEN } = process.env;
const __filename = url.fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);

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
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
const commands = commandFiles.map((file) => path.join(commandsPath, file));

commands.forEach((command) => {
    import(command).then((command) => {
        command = command.default;
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command ${command.data.name} is missing a 'data' or 'execute' property.`);
        }
    });
});

// Receive command interactions from events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
const events = eventFiles.map((file) => path.join(eventsPath, file));

events.forEach((event) => {
    import(event).then((event) => {
        event = event.default;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
});

// Handle ctrl+c exit
process.on('SIGINT', () => {
    process.exit(0);
});

// Write verification codes on exit
process.on('exit', () => {
    writeVerificationCodes();
    console.log('bye!');
});

client.login(TOKEN);
