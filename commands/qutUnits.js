import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import axios from "axios";
import * as cheerio from "cheerio";

// TODO: Add functionality to scroll through pages
//* Pricing and unit assessments (if available)

// create the slash command
const unitCommand = new SlashCommandBuilder()
    .setName("unitinfo")
    .setDescription("See info for a unit")
    .addStringOption(option =>
        option
            .setName("unit")
            .setDescription("The unit you would like information on")
            .setRequired(true)
            .setMaxLength(8)
            .setMinLength(6)
    );

// Calls the QUT API to get some basic description information
async function getUnit(unit) {
    const response = await fetch(
        `https://www.qut.edu.au/study/unit/unit-sorcery/courseloop-subject-offerings?unitCode=${unit}&years=2023`
    );

    // Storing data in form of JSON
    let result = await response.json();
    return result;
}

// Scrape the QUT webpage for info about the requested unit
async function getUnitPage(unit) {
    const { data } = await axios.get(`/unit`, {
        baseURL: "https://www.qut.edu.au/study",
        params: {
            unitCode: unit
        }
    });

    const $ = cheerio.load(data);
    const extraInfo = [];

    // use cheerio to grab all the elements under these CSS classes
    $(
        "h1.hero__header__title > span, div.panel-content > dl.row"
    ).each((_idx, el) => {
        const info = $(el).text();
        extraInfo.push(info);
    });

    // reformats the data to be usable in the embed by removing useless data
    let newInfo = extraInfo[1].split("\n").join("").split("   ");
    for (let i = 0; i < newInfo.length; i++) {
        newInfo[i] = newInfo[i]
            .trim()
            .replace(
                /^(Unit code|Faculty|School\/Discipline|Study area|Credit points) /,
                ""
            );
    }

    const newExtraInfo = [extraInfo[0], newInfo];

    // Add the unit requiste information to a new array to format
    let newNewInfo = extraInfo[3]
        .split("\n")
        .join("")
        .split("   ")
        .join("")
        .split("  ")
        .splice(1);
    if (newNewInfo.length !== 0) {
        // if the assumed knowledge section exists, add empty data at index 1 for organisation
        if (newNewInfo[0].includes("Assumed")) {
            const index = 1;
            newNewInfo = newNewInfo.join("");
            newNewInfo = newNewInfo.split(/(?![0-9])\s(?=A)/);
            newNewInfo = [
                ...newNewInfo.slice(0, index),
                "",
                ...newNewInfo.slice(index)
            ];
        }
    }

    // Replace all section headers with an empty string
    for (let i = 0; i < newNewInfo.length; i++) {
        if (newNewInfo[i].includes("Prerequisites")) {
            newNewInfo[i] = newNewInfo[i].replace("Prerequisites ", "");
        } else if (newNewInfo[i].includes("Equivalents")) {
            newNewInfo[i] = newNewInfo[i].replace("Equivalents ", "");
        } else if (newNewInfo[i].includes("Assumed")) {
            newNewInfo[i] = newNewInfo[i].replace("Assumed knowledge ", "");
        }
    }

    newExtraInfo.push(newNewInfo);

    return newExtraInfo;
}

export default {
    data: unitCommand,
    async execute(interaction) {
        // Defer the reply until the api calls have finished
        await interaction.deferReply();
        const unit = interaction.options.getString("unit");

        try {
            const result = await getUnit(unit);
            const page = (await getUnitPage(unit)).flat();
            // create the embed in here to avoid duplicate fields
            const unitEmbed = new EmbedBuilder()
                .setColor(0x00008b)
                .setAuthor({
                    name: "CutieBot",
                    iconURL:
                        "https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32"
                })
                .setTitle(`${page[0]}`)
                .setURL(
                    `https://www.qut.edu.au/study/unit/unit-sorcery/courseloop-subject-offerings?unitCode=${unit}&years=2023`
                )
                .setDescription(
                    `**${result[0]
                        .display_name}**\n\n${result[0].overview.replace(
                        /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g,
                        ""
                    )}\n\n`
                )
                .setThumbnail(
                    "https://www.qut.edu.au/__data/assets/image/0007/909781/qut-logo-og-1200.jpg"
                )
                .setTimestamp()
                .setFooter({
                    text: page[0],
                    iconURL:
                        "https://www.qut.edu.au/__data/assets/image/0007/909781/qut-logo-og-1200.jpg"
                })
                .addFields(
                    { name: "\u200B", value: "\u200B" },
                    {
                        name: "Faculty",
                        value: page[2],
                        inline: true
                    },
                    {
                        name: "School/Discipline",
                        value: page[3],
                        inline: true
                    },
                    {
                        name: "Study Area",
                        value: page[4],
                        inline: true
                    },
                    {
                        name: "Credit Points",
                        value: page[5],
                        inline: true
                    }
                );
            // Check whether the assumed knowledge section exists
            if (page[8]) {
                unitEmbed.addFields(
                    {
                        name: "Prerequisites",
                        value: page[6]
                    },
                    {
                        name: "Assumed Knowledge",
                        value: page[8]
                    },
                    { name: "\u200B", value: "\u200B" }
                );
                // check whether the prerequisites page and not equivalents exists
            } else if (!page[7] && page[6]) {
                unitEmbed.addFields(
                    {
                        name: "Prerequisites",
                        value: page[6]
                    },
                    { name: "\u200B", value: "\u200B" }
                );
                // check if both prerequisites and equivalents exists
            } else if (page[6] && page[7]) {
                unitEmbed.addFields(
                    {
                        name: "Prerequisites",
                        value: page[6]
                    },
                    {
                        name: "Equivalents",
                        value: page[7]
                    },
                    { name: "\u200B", value: "\u200B" }
                );
                // if unit has none of the above sections, add a breaker field for spacing
            } else {
                unitEmbed.addFields({ name: "\u200B", value: "\u200B" });
            }

            await interaction.editReply({
                embeds: [unitEmbed]
            });
        } catch (err) {
            // Error response
            console.log(err);
            await interaction.editReply({
                content:
                    "That's not a unit code, please provide a proper QUT unit code",
                ephemeral: true
            });
        }
    }
};
