import dotenv from 'dotenv';
import { pjson } from '../helpers/data.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

dotenv.config();
const { WEATHER_API_KEY } = process.env;

// Create the base embed
const weatherEmbed = new EmbedBuilder()
    .setColor(0x00008B)
    .setAuthor({
        name: 'CutieBot',
        iconURL: 'https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32',
    });

/**
 * Creates url to get the current weather information from https://weatherapi.com/.
 * @param {String} apiKey API key for weatherapi.com
 * @param {String} location location to search for — supports city name, ip address,
 * US/UK/CA postcode, IATA airport code, or co-ordinates as `lat,long`
 *
 * `default` co-ordinates for QUT
 * @returns API url
 */
const buildUrl = (apiKey, location) =>
    `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location ?? '-27.4785213,153.0261705'}`;

// Fetch data from the API
const getWeatherData = async (locationOption) => {
    const res = await fetch(buildUrl(WEATHER_API_KEY, locationOption));

    if (!res.ok) {
        throw new Error('WEATHER: Sorry, an error occurred whilst fetching data.');
    }
    const data = await res.json();

    // Check for error response from API (e.g. when invalid data is supplied)
    // Currently doesn't do anything because API now responds with 400 instead of 200 for invalid data
    if (data.error) {
        throw new Error(`WEATHER: Sorry, ${data.error?.message.toLowerCase()}`);
    }
    // Format the data and return it as an object
    const weatherData = {
        location: `${data.location?.name}, ${localiseResults(data.location)}`,
        temperature: Math.round(data.current?.temp_c),
        description: data.current?.condition?.text,
        image: `https:${data.current?.condition?.icon}`,
    };
    return weatherData;
};

// Check if the location for the data from the API is in Australia so that the result can be modified to include the
// state instead of the country — helps with differentiating duplicate place names.
// e.g. without this, 'Manly, QLD' and 'Manly, NSW' would both show up as 'Manly, Australia'
const localiseResults = (locationData) => {
    const states = {
        'Australian Capital Territory': 'ACT',
        'New South Wales': 'NSW',
        'Northern Territory': 'NT',
        'South Australia': 'SA',
        'Tasmania': 'TAS',
        'Queensland': 'QLD',
        'Victoria': 'VIC',
        'Western Australia': 'WA',
    };
    return locationData.country === 'Australia' ? states[locationData.region] : locationData.country;
};

// Generate the title for the embed response ('cutiebot v1.1.0: Weather...')
const buildTitle = (location) => {
    const locationStub = `${pjson.name} v${pjson.version}: Weather`;
    // If the resolved location is South Brisbane then make the title 'QUT' (hack for default location)
    return location === 'South Brisbane, QLD'
        ? `${locationStub} at QUT` // 'cutiebot v1.1.0: Weather at QUT'
        : `${locationStub} in ${location}`; // 'cutiebot v1.1.0: Weather in Place, Country'
};

export default {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('What\'s the weather?')
        .addStringOption((option) =>
            option.setName('location')
                .setDescription('Location to get the weather for (default: QUT). Supports city name, co-ordinates, or IP address.')),

    async execute(interaction) {
        // Defer the reply in case the API call takes a while
        await interaction.deferReply();

        try {
            // Get the location provided by user or, if no option is supplied, set the location to undefined.
            // This is necessary due to discord.js returning null if no option is provided, which will not
            // cause the default parameters in getWeatherData() to be used.
            const locationOption = await interaction.options.getString('location');
            const { location, temperature, description, image } = await getWeatherData(locationOption);

            weatherEmbed.setImage(image)
                .setTitle(buildTitle(location))
                .setDescription(`The current temperature is ${temperature}°C.\n\n${description}.`);
            await interaction.followUp({ embeds: [ weatherEmbed ] });
        }
        catch (err) {
            console.log(err);
            // Hack for letting the user know if they've submitted an invalid location :skull:
            // Currently doesn't do much because the API no longer responds with 200 for an invalid location
            if (err.message.startsWith('WEATHER:')) {
                await interaction.followUp({ content: `${err.message}`, ephemeral: true });
            } else {
                await interaction.followUp({ content: 'An error occurred, sorry!', ephemeral: true });
            }
        }
    },
};
