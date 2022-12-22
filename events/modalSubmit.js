const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Ensures only modal submission interactions are replied to
        if (!interaction.isModalSubmit()) return;

        try {
            // Specify which modal the following code is for - any other modals would need
            // another if statement.
            if (interaction.customId === 'verificationModal') {
                const studentIdRegex = /[Nn]?[0-9]{6,12}/;
                const staffIdRegex = /\w+\.\w+/;
                // Get the inputted id from the modal
                const userId = interaction.fields.getTextInputValue('idInput');

                if (staffIdRegex.test(userId) || studentIdRegex.test(userId)) {
                    console.log(userId);
                    await interaction.reply('ID successfully submitted.');
                } else {
                    await interaction.reply('Invalid ID entered, please try again.');
                }
            }
        } catch (error) {
            console.error(error);
            // Issues here with followUp vs reply creating timeout issues
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
