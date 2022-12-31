import { pjson } from '../helpers/data.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const description = `This command is being used to remind you about the QUT MOPP.
It is the student code of conduct and provides useful information on things like collusion.

If you are seeing this you should probably take a look at this page:
                
**http://www.mopp.qut.edu.au/E/E_02_01.jsp**`

export default {
    data: new SlashCommandBuilder()
        .setName('mopp')
        .setDescription('MOPP info'),
    async execute(interaction) {
        try {
            const infoEmbed = new EmbedBuilder()
                .setColor(0x00008B)
                .setTitle(`${pjson.name} v${pjson.version}: MOPP | Student Code of conduct`)
                .setDescription(description)
                .setAuthor({
                    name: 'CutieBot',
                    iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32',
                })
                .setURL('http://www.mopp.qut.edu.au/E/E_02_01.jsp');

            await interaction.reply({ embeds: [ infoEmbed ] });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
