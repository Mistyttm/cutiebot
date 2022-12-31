import { pjson } from '../helpers/data.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hiq')
        .setDescription('Sends link to HiQ'),
    async execute(interaction) {
        try {
            const infoEmbed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle(`${pjson.name} v${pjson.version}: HiQ Link`)
                .setDescription('HiQ:\n\nhttps://qutvirtual4.qut.edu.au/group/student/home')
                .setAuthor({
                    name: 'CutieBot',
                    iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32',
                })
                .setURL('https://qutvirtual4.qut.edu.au/group/student/home');

            await interaction.reply({ embeds: [ infoEmbed ] });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
