const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (!member) return;

        // Grab the Visitor role object
        const role = await member.guild.roles.cache
            .find((role) => role.name === 'Visitor');

        if (!role) {
            console.log(`No role matching ${role} was found.`);
        }

        try {
            await member.roles.add(role, 'New user join');
        } catch (error) {
            console.log(error);
        }
    }
};
