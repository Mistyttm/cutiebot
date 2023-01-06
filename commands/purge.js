import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes multiple messages at once')
        .addIntegerOption((option) =>
            option.setName('amount')
                .setDescription('Amount of messages to delete')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        interaction.deferReply();
        try {
            const amount = interaction.options.getInteger('amount');

            await interaction.channel.bulkDelete(amount, true);
            await interaction.followUp({ content: `Deleted ${amount} messages`, ephemeral: true });
        } catch (err) {
            console.log(err);
            interaction.followUp({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
