const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true, // specifies that event should only be run once
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
