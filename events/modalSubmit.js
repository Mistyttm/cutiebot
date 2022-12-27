const { Events } = require('discord.js');
const { saveVerificationCode } = require('../src/data.js');
const { sendVerificationEmail } = require('../src/email.js');

const isStudentId = (id) => {
    // At least 6 integers, and optionally starts with an 'n'
    return /[Nn]?[0-9]{6,}/.test(id);
};

const isStaffId = (id) => {
    // At least one word character (A-Za-z0-9), followed by a '.', then another word character
    return /\w+\.\w+/.test(id);
};

const isValidId = (id) => {
    if (isStaffId(id) || isStudentId(id)) {
        return true;
    }
    return false;
};

// Add 'n' to start of student id if not present, otherwise return the id unchanged
const formatStudentId = (id) => !id.startsWith('n') ? `n${id}` : id;

const generateRandomCharacter = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return possible.charAt(Math.floor(Math.random() * possible.length));
};

const generateVerificationCode = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += generateRandomCharacter();
    }
    return code;
};

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Ensures only modal submission interactions are replied to
        if (!interaction.isModalSubmit()) return;
        
        try {
            // Specify which modal the following code is for - any other modals would need
            // another if statement.
            if (interaction.customId === 'verificationModal') {
                // Get the inputted id from the modal
                let userId = interaction.fields.getTextInputValue('idInput').toLowerCase();

                // Check if the id is a valid QUT id
                if (isValidId(userId)) {
                    const code = generateVerificationCode();

                    // If the ID is a student id then ensure it begins with an 'n'
                    if (isStudentId(userId)) {
                        userId = formatStudentId(userId);
                    }

                    saveVerificationCode(userId, code, interaction.user.id);
                    sendVerificationEmail(userId, code, interaction);
                    await interaction.reply('ID successfully submitted.');
                } else {
                    await interaction.reply('Invalid ID entered, please try again.');
                }
            }
        } catch (error) {
            console.log(error);
            // Issues here with followUp vs reply creating timeout issues
            // await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};