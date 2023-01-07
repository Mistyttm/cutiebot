import dotenv from 'dotenv';
import { pjson } from '../helpers/data.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

dotenv.config();
const { WEATHER_API_KEY } = process.env;
const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Brisbane`;
const weatherEmbed = new EmbedBuilder()
    .setColor(0x00008B)
    .setTitle(`${pjson.versionName}: Weather at QUT`)
    .setAuthor(pjson.author);

const getWeatherData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    const modifiedData = {
        temperature: Math.round(data.current?.temp_c),
        description: data.current?.condition?.text,
        image: `https:${data.current?.condition?.icon}`,
    };
    return modifiedData;
};

export default {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('What\'s the weather at QUT?'),
    async execute(interaction) {
        try {
            const { temperature, description, image } = await getWeatherData();

            weatherEmbed.setImage(image)
                .setDescription(`The current temperature is ${temperature}°C.\n\n${description}.`);
            await interaction.reply({ embeds: [ weatherEmbed ] });
        } catch (err) {
            console.log(err);
            interaction.reply({ content: 'An error occurred, sorry!', ephemeral: true });
        }
    },
};
