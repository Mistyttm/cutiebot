require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pjson = require('../package.json');
const weather = require('openweather-apis');

const token = process.env.WEATHER_API_KEY;

// configuring the weather api
weather.setLang('en');
weather.setCoordinate(27.4785, 153.0284);
weather.setUnits('metric');
weather.setAPPID(token);
let temperature;
weather.getTemperature(function(err, temp){
    temperature = temp;
});
let weathDesc;
weather.getDescription(function(err, desc){
    weathDesc = desc;
});


module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('What\'s the weather at QUT?'),
    async execute(interaction) {
        try {

            const infoEmbed = new EmbedBuilder()
                .setColor(0x00008B)
                .setTitle(`${pjson.name} v${pjson.version}: Weather at QUT`)
                .setDescription(`the current temperature is ${temperature}°C\n\n${weathDesc}`)
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
