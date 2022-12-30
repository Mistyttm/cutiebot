const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes Multiple messages at once')
        .addIntegerOption((option) =>
            option.setName('amount')
                .setDescription('amount of messages to delete')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        try {
            const amount = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Deleted ${amount} messages`, ephemeral: true });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    }
};
