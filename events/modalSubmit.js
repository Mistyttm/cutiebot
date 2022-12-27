require('dotenv').config();

const fs = require('fs');
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

const emailToken = process.env.SECURITYTOKEN;
const email = process.env.EMAIL;

function sendEmail(recipient, code){
    Email.send({
        SecureToken : emailToken,
        To : recipient,
        From : email + "@qut.edu.au",
        Subject : "Discord Verification Code",
        Body : "Here is your verification code for the <i>IT Crew</i> Discord Server:\n\n<h1>" + code + "</h1>\n\nPlease enter this code into the Discord server to verify your account.\n\n<b>If you did not request this code, please ignore this email.</b>"
    })//.then(
    //     message => alert(message)
    // );
}

function generateCode(user) {
    let code = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 4; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    

    let codeString = user+"-"+code;

    const stream = fs.createWriteStream('../active-codes.txt', { flags: 'a' });
    stream.write(codeString + ",");

    return code;
}

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

<<<<<<< HEAD
                // Check if the id is a valid QUT id
                if (isValidId(userId)) {
                    const code = generateVerificationCode();

                    // If the ID is a student id then ensure it begins with an 'n'
                    if (isStudentId(userId)) {
                        userId = formatStudentId(userId);
                    }

                    saveVerificationCode(userId, code, interaction.user.id);
                    sendVerificationEmail(userId, code, interaction);
=======
                if (staffIdRegex.test(userId) || studentIdRegex.test(userId)) {
                    console.log(userId);
                    generateCode(userId);
>>>>>>> 0457244f50027beee821ec6360c58b09296dcee0
                    await interaction.reply('ID successfully submitted.');
                } else {
                    await interaction.reply('Invalid ID entered, please try again.');
                }
            }
        } catch (error) {
            console.log(error);
            // Issues here with followUp vs reply creating timeout issues
<<<<<<< HEAD
            // await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
=======
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
>>>>>>> 0457244f50027beee821ec6360c58b09296dcee0
        }
    }
};
