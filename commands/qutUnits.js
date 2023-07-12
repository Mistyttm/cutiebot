import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import axios from "axios";
import * as cheerio from "cheerio";

const unitCommand = new SlashCommandBuilder()
    .setName("unitinfo")
    .setDescription("See info for a unit")
    .addStringOption(option =>
        option
            .setName("unit")
            .setDescription("The unit you would like information on")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

async function getUnit(unit) {
    const response = await fetch(
        `https://www.qut.edu.au/study/unit/unit-sorcery/courseloop-subject-offerings?unitCode=${unit}&years=2023`
    );

    // Storing data in form of JSON
    let result = await response.json();
    return result;
}

async function getUnitPage(unit) {
    const { data } = await axios.get(`/unit`, {
        baseURL: "https://www.qut.edu.au/study",
        params: {
            unitCode: unit
        }
    });

    const $ = cheerio.load(data);
    const extraInfo = [];

    $(
        "h1.hero__header__title > span, div.panel-content > dl.row"
    ).each((_idx, el) => {
        const info = $(el).text();
        extraInfo.push(info);
    });

    let newInfo = extraInfo[1].split("\n");
    let test = newInfo.join("");

    test = test.split("   ");

    for (let i = 0; i < test.length; i++) {
        test[i] = test[i].trim();
        if (test[i].includes("Unit code")) {
            test[i] = test[i].replace("Unit code ", "");
        } else if (test[i].includes("Faculty")) {
            test[i] = test[i].replace("Faculty ", "");
        } else if (test[i].includes("School/Discipline")) {
            test[i] = test[i].replace("School/Discipline ", "");
        } else if (test[i].includes("Study area")) {
            test[i] = test[i].replace("Study area ", "");
        } else if (test[i].includes("Credit points")) {
            test[i] = test[i].replace("Credit points ", "");
        }
    }

    const newExtraInfo = [];
    newExtraInfo.push(extraInfo[0]);
    newExtraInfo.push(test);

    let newNewInfo = extraInfo[3].split("\n");
    let test2 = newNewInfo.join("");

    test2 = test2.split("   ");
    test2 = test2.join("");
    test2 = test2.split("  ");
    test2 = test2.splice(1);
    if (test2.length !== 0) {
        if (test2[0].includes("Assumed")) {
            const index = 1;
            test2 = test2.join("");
            test2 = test2.split(/(?![0-9])\s(?=A)/);
            test2 = [...test2.slice(0, index), "", ...test2.slice(index)];
        }
    }

    for (let i = 0; i < test2.length; i++) {
        if (test2[i].includes("Prerequisites")) {
            test2[i] = test2[i].replace("Prerequisites ", "");
        } else if (test2[i].includes("Equivalents")) {
            test2[i] = test2[i].replace("Equivalents ", "");
        } else if (test2[i].includes("Assumed")) {
            test2[i] = test2[i].replace("Assumed knowledge ", "");
        }
    }

    newExtraInfo.push(test2);

    return newExtraInfo;
}

export default {
    data: unitCommand,
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const unit = interaction.options.getString("unit");
            const result = await getUnit(unit);
            const page = (await getUnitPage(unit)).flat();
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
            // Set the title now that we have access to the interaction
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
            } else if (!page[7] && page[6]) {
                unitEmbed.addFields(
                    {
                        name: "Prerequisites",
                        value: page[6]
                    },
                    { name: "\u200B", value: "\u200B" }
                );
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
            } else {
                unitEmbed.addFields({ name: "\u200B", value: "\u200B" });
            }

            await interaction.editReply({
                embeds: [unitEmbed]
            });
        } catch (err) {
            console.log(err);
            await interaction.editReply({
                content:
                    "That's not a unit code, please provide a proper QUT unit code",
                ephemeral: true
            });
        }
    }
};
