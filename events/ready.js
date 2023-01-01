import { Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true, // specifies that event should only be run once
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        //client.user.setPresence({ activities: [{ name: 'with discord.js' }], status: 'idle' });
    },
};
