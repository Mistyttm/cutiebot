const { Events } = require('discord.js');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// 'Verify' modal
const idSubmitModal = new ModalBuilder()
    .setCustomId('idSubmitModal')
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

const idSubmitActionRow = new ActionRowBuilder()
    .addComponents(idInput);

idSubmitModal.addComponents(idSubmitActionRow);

// 'Enter code' modal
const codeSubmitModal = new ModalBuilder()
    .setCustomId('codeSubmitModal')
    .setTitle('Verification');

const codeInput = new TextInputBuilder()
    .setCustomId('codeInput')
    .setLabel('Please enter the code sent to your QUT email:')
    .setStyle(TextInputStyle.Short)
    .setMinLength(4)
    .setMaxLength(4)
    .setPlaceholder('e.g. aaaa, AAAA, aA00')
    .setRequired(true);

const codeSubmitActionRow = new ActionRowBuilder()
    .addComponents(codeInput);

codeSubmitModal.addComponents(codeSubmitActionRow);

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Ensures only modal submission interactions are replied to
        if (!interaction.isButton()) return;
        
        try {
        // Specify which modal the following code is for - any other modals would need
        // another if statement.
            if (interaction.customId === 'idSubmitButton') {
                if (interaction.member.roles.cache.some((role) => role.name === 'Verified')) {
                    await interaction.reply({ content: 'User already verified.', ephemeral: true });
                } else {
                    await interaction.showModal(idSubmitModal);
                }
            }

            if (interaction.customId === 'codeSubmitButton') {
                await interaction.showModal(codeSubmitModal);
            }
        } catch (error) {
            console.log(error);
            // Issues here with followUp vs reply creating timeout issues
            // await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
