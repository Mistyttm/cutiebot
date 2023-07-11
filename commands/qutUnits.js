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

const unitEmbed = new EmbedBuilder().setColor(0x00008b).setAuthor({
    name: "CutieBot",
    iconURL:
        "https://cdn.discordapp.com/avatars/1055472048899641365/4d6ff8bb2f760373dd8a41e77300e73a.webp?size=32"
});

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

    $("h1.hero__header__title > span").each((_idx, el) => {
        const info = $(el).text();
        extraInfo.push(info);
    });

    $("div.panel-content > dl.row  ").each((_idx, el) => {
        const info = $(el).text();
        extraInfo.push(info);
    });

    let newInfo = extraInfo[1].split("\n");
    let test = newInfo.join("");

    test = test.split("   ");

    for (let i = 0; i < test.length; i++) {
        test[i] = test[i].trim();
        if (test[i].includes("Unit code")) {
            test[i] = test[i].replace("Unit code", "**Unit Code:**");
        } else if (test[i].includes("Faculty")) {
            test[i] = test[i].replace("Faculty", "**Faculty:**");
        } else if (test[i].includes("School/Discipline")) {
            test[i] = test[i].replace(
                "School/Discipline",
                "**School/Discipline:**"
            );
        } else if (test[i].includes("Study area")) {
            test[i] = test[i].replace("Study area", "**Study Area:**");
        } else if (test[i].includes("Credit points")) {
            test[i] = test[i].replace("Credit points", "**Credit Points:**");
        }
    }

    const newExtraInfo = [];
    newExtraInfo.push(extraInfo[0]);
    newExtraInfo.push(test);

    return newExtraInfo;
}

export default {
    data: unitCommand,
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const unit = interaction.options.getString("unit");
            const result = await getUnit(unit);
            const page = await getUnitPage(unit);
            // Set the title now that we have access to the interaction
            unitEmbed
                .setTitle(`${page.flat()[0]}`)
                .setDescription(
                    `
            **${result[0].display_name}**\n\n${result[0].overview.replace(
                        /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g,
                        ""
                    )}\n\n - ${page.flat()[1]}\n - ${page.flat()[2]}\n - ${page.flat()[3]}\n - ${page.flat()[4]}\n - ${page.flat()[5]}`
                )
                .setThumbnail(
                    "https://www.qut.edu.au/__data/assets/image/0007/909781/qut-logo-og-1200.jpg"
                );
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
