const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('configure channel to be used for verification')
        .addChannelOption((option) => 
            option.setName('channel')
                .setDescription('which channel to use')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const channel = interaction.options.getChannel('channel');
            const verificationEmbed = new EmbedBuilder()
                .setColor(0xB9FBC0)
                .setTitle(`Welcome to ${interaction.guild.name}!`)
                .setDescription('Verify yourself.')
                .setAuthor({ name: 'Verifier Sam', iconURL: 'https://www.shropshirestar.com/resizer/Q_ixmNLsvyunnWqu94LyXHZJRG0=/1200x0/cloudfront-us-east-1.images.arcpublishing.com/mna/KDZEY4VNWRGY3F5DDRKTJINN2I.jpg' });

            await channel.send({
                embeds: [verificationEmbed],
                components: [actionRow]
            });

            await interaction.followUp('Verification message created!');
        } catch (err) {
            console.log(err);
            interaction.followUp('An error occurred, sorry!');
        }
        
    }
};
