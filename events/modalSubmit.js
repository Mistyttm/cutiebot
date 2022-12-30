const { Events } = require('discord.js');
const { saveVerificationCode, findUser } = require('../src/data.js');
const { sendVerificationEmail } = require('../src/email.js');

// 'Verify' modal

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

// TODO: Try changing interaction.reply to an initial deferred reply, then use 
// interaction.followUp for all subsequent messages to avoid issues
// with error catching
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        
        try {
            // Specify which modal the following code is for - any other modals would need
            // another if statement.
            if (interaction.customId === 'idSubmitModal') {
                // Get the inputted id from the modal
                let userId = interaction.fields.getTextInputValue('idInput').toLowerCase();

                // Check if the id is a valid QUT id
                if (isValidId(userId)) {
                    // If the ID is a student id then ensure it begins with an 'n'
                    if (isStudentId(userId)) {
                        userId = formatStudentId(userId);
                    }

                    const code = generateVerificationCode();
                    saveVerificationCode(userId, code, interaction.member.id);
                    sendVerificationEmail(userId, code, interaction);
                    await interaction.reply({ content: 'ID successfully submitted.', ephemeral: true });
                }
                else {
                    await interaction.reply({ content: 'Invalid ID entered, please try again.', ephemeral: true });
                }
            }
            
            // Submission of verification code
            if (interaction.customId === 'codeSubmitModal') {
                const code = interaction.fields.getTextInputValue('codeInput');
                const verifiedRole = interaction.guild.roles.cache.find((role) => role.name === 'Verified');
                const visitorRole = interaction.guild.roles.cache.find((role) => role.name === 'Visitor');
                const member = interaction.member;
                
                // If there is a verification code stored matching the person 
                // submitting the modal's Discord UUID, find it
                const user = findUser(member.id);
                // Try and match the verification code stored against the code
                // submitted, and make sure the user is not already verified
                if (user.verificationCode === code && !member.roles.cache.some((role) => role.name === 'Verified')) {
                    member.roles.add(verifiedRole);
                    member.roles.remove(visitorRole);
                    console.log(`removed ${member.id} from role ${visitorRole}, added role ${verifiedRole}`);
                    await interaction.reply({ content: `Matched ${interaction.user.username}#${interaction.user.discriminator} with ${member.id}: Added role ${verifiedRole}, removed ${visitorRole}`, ephemeral: true });
                } else {
                    await interaction.reply({ content: 'gtfo fake', ephemeral: true });
                }
            }
        } catch (error) {
            console.log(error);
            // Issues here with followUp vs reply creating timeout issues
            // await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
