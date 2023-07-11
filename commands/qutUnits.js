import {
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

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
    // const webpage = await fetch(
    //     `https://www.qut.edu.au/study/unit?unitCode=${unit}`
    // );

    // Storing data in form of JSON
    let result = await response.json();
    return result;
}

export default {
    data: unitCommand,
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const unit = interaction.options.getString("unit");
            const result = await getUnit(unit);
            // Set the title now that we have access to the interaction
            unitEmbed
                .setTitle(``)
                .setDescription(`its here: ${result[0].display_name}`);
            await interaction.editReply({
                embeds: [unitEmbed]
            });
        } catch (err) {
            console.log(err);
            await interaction.editReply({
                content: "An error occurred, sorry!",
                ephemeral: true
            });
        }
    }
};
