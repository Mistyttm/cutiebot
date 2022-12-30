const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pjson = require('../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info about the bot'),
    async execute(interaction) {
        try {

            const infoEmbed = new EmbedBuilder()
                .setColor(0x00008B)
                .setTitle(`${pjson.name} v${pjson.version}`)
                .setDescription('This bot was designed and developed by *Emmey Leo* and *Lillian King* for the IT Crew Discord server. It provides a system to verify that new members are QUT students. This project is completely open source and any and all people are allowed to contribute to the repo:\n\n**https://github.com/Mistyttm/cutiebot**')
                .setAuthor({ name: 'CutieBot', iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32' });
            await interaction.reply({
                embeds: [infoEmbed],
            });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    }
};
