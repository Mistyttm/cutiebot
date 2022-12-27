const { ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// Create modal
const modal = new ModalBuilder()
    .setCustomId('verificationModal')
    .setTitle('Verification');

// Create ID input box
const idInput = new TextInputBuilder()
    .setCustomId('idInput')
    .setLabel('Please enter your student number/staff ID:')
    .setStyle(TextInputStyle.Short)
    .setMinLength(3)
    .setMaxLength(4000)
    .setPlaceholder('e.g. n12345678, john.smith')
    .setRequired(true);

const firstActionRow = new ActionRowBuilder()
    .addComponents(idInput);

modal.addComponents(firstActionRow);

module.exports = {
    // Create slash command to show modal
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify you\'re a QUT student/staff member'),
    async execute(interaction) {
        // Show the modal - any logic after this is located in 'modalSubmit.js'
        await interaction.showModal(modal);
    }
};
