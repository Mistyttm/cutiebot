const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pjson = require('../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mopp')
        .setDescription('MOPP info'),
    async execute(interaction) {
        try {

            const infoEmbed = new EmbedBuilder()
                .setColor(0x00008B)
                .setTitle(`${pjson.name} v${pjson.version}: MOPP | Student Code of conduct`)
                .setDescription('This command is being used to remind you about the QUT MOPP.\n\nIt is the student code of conduct and provides useful information on things like collusion.\n\nIf you are seeing this you should probably take a look at this page\n\n\n\n**http://www.mopp.qut.edu.au/E/E_02_01.jsp**')
                .setAuthor({ name: 'CutieBot', iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32' })
                .setURL('http://www.mopp.qut.edu.au/E/E_02_01.jsp');
            await interaction.reply({
                embeds: [infoEmbed],
            });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    }
};
