const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [
    {
        type: 1,
        name: 'register',
        description: 'Register a user',
        // options: [ 
        //     {
        //         type: 3,
        //         name: 'studentnumber',
        //         description: 'Student number',
        //         required: true
        //     }
        // ],
    },
];

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const activeCodes = [];

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
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'register') {
        const modal = new ModalBuilder()
			.setCustomId('registerModal')
			.setTitle('Register');
        
		const studentNumberInput = new TextInputBuilder()
            .setCustomId('studentNumberInput')
            .setLabel("Please input your student number")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('n123456789')
            .setRequired(true);

		const firstActionRow = new ActionRowBuilder().addComponents(studentNumberInput);

		modal.addComponents(firstActionRow);

		await interaction.showModal(modal);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    var studentEmail = "";

	if (!interaction.isModalSubmit()) return;

    // Get the data entered by the user
	const studentNumber = interaction.fields.getTextInputValue('studentNumberInput');
	console.log({ studentNumber });

    if (!/[Nn]?[0-9]{6,12}/.test(studentNumber)){
        await interaction.reply({content: 'Invalid student number'});
        return;
    } else {
        if (studentNumber.charAt(0).toLowerCase() === 'n'){
            studentEmail = studentNumber + "@qut.edu.au";
        } else {
            studentEmail = "n" + studentNumber + "@qut.edu.au";
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