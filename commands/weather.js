import dotenv from 'dotenv';
import { pjson } from '../helpers/data.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { AsyncWeather } from '@cicciosgamino/openweather-apis';

dotenv.config();
const { WEATHER_API_KEY } = process.env;

// Will not work without 'await', ignore hinting
const weather = await new AsyncWeather();

// configuring the weather api
weather.setLang('en');
weather.setCoordinates(27.4785, 153.0284);
weather.setUnits('metric');
weather.setApiKey(WEATHER_API_KEY);
const temperature = await weather.getTemperature((err, temp) => {
    if (err) console.log(err);
    console.log(temp, err);
    return temp;
});

const weatherDescription = await weather.getDescription((err, desc) => {
    if (err) console.log(err);
    console.log(desc, err);
    return desc;
});

export default {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('What\'s the weather at QUT?'),
    async execute(interaction) {
        try {
            const infoEmbed = new EmbedBuilder()
                .setColor(0x00008B)
                .setTitle(`${pjson.name} v${pjson.version}: Weather at QUT`)
                .setDescription(`The current temperature is ${Math.round(temperature)}°C\n\n${weatherDescription.charAt(0).toUpperCase().concat(weatherDescription.slice(1))}`)
                .setAuthor({
                    name: 'CutieBot',
                    iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32',
                });

            await interaction.reply({ embeds: [ infoEmbed ] });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
