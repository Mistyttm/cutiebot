import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';

const description = `To gain full access to our server you'll need to verify your status as a member of QUT. Simply select the 'Verify' button and enter your staff/student ID. You'll be sent an email containing your verification code — enter it using the 'Enter code' button below :)`;

const configureCommand = new SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure channel to be used for verification')
    .addChannelOption((option) =>
        option.setName('channel')
            .setDescription('which channel to use')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

const verificationEmbed = new EmbedBuilder()
    .setColor(0x00008B)
    .setDescription(description)
    .setAuthor({
        name: 'CutieBot',
        iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32',
    });

const idSubmitButton = new ButtonBuilder()
    .setCustomId('idSubmitButton')
    .setLabel('Verify')
    .setEmoji('✅')
    .setStyle(ButtonStyle.Primary);

const codeSubmitButton = new ButtonBuilder()
    .setCustomId('codeSubmitButton')
    .setLabel('Enter code')
    .setEmoji('📲')
    .setStyle(ButtonStyle.Success);

const actionRow = new ActionRowBuilder()
    .addComponents(idSubmitButton, codeSubmitButton);

export default {
    data: configureCommand,
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const channel = interaction.options.getChannel('channel');

            // Set the title now that we have access to the interaction
            verificationEmbed.setTitle(`Welcome to ${interaction.guild.name}!`);
            await channel.send({
                embeds: [ verificationEmbed ],
                components: [ actionRow ],
            });
            await interaction.followUp({ content: 'Verification message created!', ephemeral: true });
        } catch (err) {
            console.log(err);
            await interaction.followUp({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
