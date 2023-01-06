import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a server member')
        .addUserOption((option) =>
            option.setName('user')
                .setDescription('User to timeout')
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName('time')
                .setDescription('How long to time out the user (in minutes)')
                .setRequired(true))
        .addStringOption((option) =>
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        try {
            const guildMember = interaction.options.getMember('user');
            const amount = interaction.options.getInteger('time');
            const reason = interaction.options.getString('reason');
            const guildName = interaction.guild.name;
            const userName = `${interaction.user.username}#${interaction.user.discriminator}`;

            guildMember.timeout(amount / 60 / 1000, reason);
            console.log(
                `${userName} has timed out ${guildMember} for ${amount} minute(s) for: "${reason}" in ${guildName}`,
            );
            await interaction.reply({
                content: `${guildMember} has been timed out for ${amount} minute(s) for: ${reason}`,
                ephemeral: true,
            });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
