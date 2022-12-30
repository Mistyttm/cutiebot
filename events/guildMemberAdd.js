const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (!member) return;

        // Grab the Visitor role object
        const visitorRole = await member.guild.roles.cache
            .find((role) => role.name === 'Visitor');

        if (!visitorRole) {
            console.log(`No role matching ${visitorRole} was found.`);
        }

        try {
            // If the user already has the Visitor role then do nothing
            // (prevents fighting with Dyno autoroles)
            if (member.roles.resolve(visitorRole.id)) return;
            await member.roles.add(visitorRole, 'New user join');
        } catch (error) {
            console.log(error);
        }
    }
};
