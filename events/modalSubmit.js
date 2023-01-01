import { Events } from 'discord.js';
import { emailBody } from '../helpers/emailBody.js';
import sendEmail from '../helpers/email.js';
import { findUser, saveVerificationCode } from '../helpers/data.js';

// 'Verify' modal

// At least 6 integers, and optionally starts with an 'n'
const isStudentId = (id) => /[Nn]?[0-9]{6,}/.test(id);

// At least one word character (A-Za-z0-9), followed by a '.', then another word character
const isStaffId = (id) => /\w+\.\w+/.test(id);

/**
 * Checks id is either one of 'n000000' or 'name.name'
 * @param {string} id QUT ID to be checked
 * @returns {bool} True if valid, else false
 */
const isValidId = (id) => !!(isStaffId(id) || isStudentId(id));

// Add 'n' to start of student id if not present, otherwise return the id unchanged
const formatStudentId = (id) => id.startsWith('n') ? id : `n${id}`;

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
export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        try {
            // Specify which modal the following code is for - any other modals would need
            // another if statement.
            if (interaction.customId === 'idSubmitModal') {
                const userName = `${interaction.user.username}#${interaction.user.discriminator}`;
                
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
                    sendEmail({
                        to: `${userId}@qut.edu.au`, // Receiver address
                        subject: 'Discord Verification Code', // Subject line
                        text: `Your code is: ${code}`, // Plain text body
                        html: emailBody(interaction.guild.name, userName, code),
                    });
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
                    await interaction.reply({ content: 'You have been successfully verified!!', ephemeral: true });
                } else {
                    await interaction.reply({
                        content: 'This is not a valid code.\nPlease Try again.',
                        ephemeral: true,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            // Issues here with followUp vs reply creating timeout issues
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
