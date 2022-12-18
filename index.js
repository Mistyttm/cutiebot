const { Client, GatewayIntentBits, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sendmail = require('sendmail')({
    logger: {
        debug: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    },
    dkim: { // Default: False
        privateKey: process.env.EMAILPASS,
        keySelector: 'mydomainkey'
    },
    silent: false,
    smtpPort: 465, // Default: 25
    smtpHost: 'smtp.mail.yahoo.com' // Default: -1 - extra smtp host after resolveMX
});

const activeCodes = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'register') {
        const modal = new ModalBuilder()
            .setCustomId('registerModal')
            .setTitle('Register');
        
        const studentNumberInput = new TextInputBuilder()
            .setCustomId('studentNumberInput')
            .setLabel('Please input your student number')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('n123456789')
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(studentNumberInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    var studentEmail = '';

    if (!interaction.isModalSubmit()) return;

    // Get the data entered by the user
    const studentNumber = interaction.fields.getTextInputValue('studentNumberInput');
    console.log({ studentNumber });

    if (!/[Nn]?[0-9]{6,12}/.test(studentNumber)){
        await interaction.reply({content: 'Invalid student number'});
        return;
    } else {
        if (studentNumber.charAt(0).toLowerCase() === 'n'){
            studentEmail = studentNumber + '@qut.edu.au';
        } else {
            studentEmail = 'n' + studentNumber + '@qut.edu.au';
        }
    }

    if (interaction.customId === 'registerModal') {
        const code = [];
        for (let i = 0; i < 4; i++){
            code.push(Math.floor(Math.random() * 10));
        }

        const codeString = code.join('');

        activeCodes.push(codeString);

        sendmail({
            from: process.env.EMAIL,
            to: studentEmail,
            subject: 'IT Crew Discord Server Verification Code',
            html: codeString,
        }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });

        await interaction.reply('You have been registered');
    }
});

client.login(process.env.TOKEN);
