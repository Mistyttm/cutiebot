const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
    .setColor(0xB9FBC0)
    .setDescription('Verify yourself.')
    .setAuthor({ name: 'Verifier Sam', iconURL: 'https://www.shropshirestar.com/resizer/Q_ixmNLsvyunnWqu94LyXHZJRG0=/1200x0/cloudfront-us-east-1.images.arcpublishing.com/mna/KDZEY4VNWRGY3F5DDRKTJINN2I.jpg' });

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

module.exports = {
    data: configureCommand,
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const channel = interaction.options.getChannel('channel');

            // Set the title now that we have access to the interaction
            verificationEmbed.setTitle(`Welcome to ${interaction.guild.name}!`);
            
            await channel.send({
                embeds: [verificationEmbed],
                components: [actionRow]
            });

            await interaction.followUp({ content: 'Verification message created!', ephemeral: true });
        } catch (err) {
            console.log(err);
            await interaction.followUp({ content: 'An error occurred, sorry!', ephemeral: true });
        }
        
    }
};
