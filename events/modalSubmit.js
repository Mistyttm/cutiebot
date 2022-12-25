require('dotenv').config();

const fs = require('fs');
const { Events } = require('discord.js');

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
                const studentIdRegex = /[Nn]?[0-9]{6,12}/;
                const staffIdRegex = /\w+\.\w+/;
                // Get the inputted id from the modal
                const userId = interaction.fields.getTextInputValue('idInput');

                if (staffIdRegex.test(userId) || studentIdRegex.test(userId)) {
                    console.log(userId);
                    generateCode(userId);
                    await interaction.reply('ID successfully submitted.');
                } else {
                    await interaction.reply('Invalid ID entered, please try again.');
                }
            }
        } catch (error) {
            console.error(error);
            // Issues here with followUp vs reply creating timeout issues
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
