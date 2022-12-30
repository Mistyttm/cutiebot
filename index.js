require('dotenv').config();
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { writeVerificationCodes } = require('./src/data.js');
const { readdirSync } = require('node:fs');

const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [ 
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
]});

// Load commands from files
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command ${filePath} is missing a 'data' or 'execute' property.`);
    }
}

// Receive command interactions from events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Handle ctrl+c exit
process.on('SIGINT', () => {
    process.exit(0);
});

// Write verification codes on exit
process.on('exit', () => {
    writeVerificationCodes();
    console.log('bye!');
});

client.login(token);
