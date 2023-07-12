// import {
//     SlashCommandBuilder,
//     EmbedBuilder,
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonStyle
// } from "discord.js";

// export default {
//     data: new SlashCommandBuilder()
//         .setName("help")
//         .setDescription("This is the help command"),
//     async execute(interaction, client) {
//         const embed = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("Help Command Guide:")
//             .addFields(
//                 { name: "page 1", value: "Help & Resources (button1)" },
//                 { name: "page 2", value: "General Commands (button2)" },
//                 { name: "page 3", value: "Moderation Commands (button3)" },
//                 { name: "page 4", value: "QUT Commands (button4)" }
//             );

//         const embed2 = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("General Commands")
//             .addFields(
//                 {
//                     name: "/help",
//                     value: "Do /help for the commands list & support"
//                 },
//                 {
//                     name: "/info",
//                     value:
//                         "Do /info to get info on the bot's current version and github repo"
//                 },
//                 {
//                     name: "/weather",
//                     value: "Do /weather to get the current weather"
//                 }
//             )
//             .setFooter({text: "General Commands"})
//             .setTimestamp();

//         const embed3 = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("Moderation Commands")
//             .addFields(
//                 {
//                     name: "/configure",
//                     value:
//                         "Do /configure to configure a channel for user verification"
//                 },
//                 {
//                     name: "/purge",
//                     value: "Do /purge to clear a section of chat"
//                 },
//                 { name: "/timeout", value: "Do /timeout to timeout a user" }
//             )
//             .setFooter({text: "Moderation Commands"})
//             .setTimestamp();

//         const embed4 = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("QUT Commands")
//             .addFields(
//                 { name: "/hiq", value: "Do /hiq to get a quick link to HiQ" },
//                 {
//                     name: "/mopp",
//                     value: "Do /mopp to get a quick link to the student MOPP"
//                 },
//                 {
//                     name: "/unitinfo",
//                     value:
//                         "Do /unitinfo to find information about a QUT unit like prerequisites and the name"
//                 }
//             )
//             .setFooter({text: "QUT Commands"})
//             .setTimestamp();

//         const button = new ActionRowBuilder().addComponents(
//             new ButtonBuilder()
//                 .setCustomId(`page1`)
//                 .setLabel(`Page 1`)
//                 .setStyle(ButtonStyle.Success),
//             new ButtonBuilder()
//                 .setCustomId(`page2`)
//                 .setLabel(`Page 2`)
//                 .setStyle(ButtonStyle.Success),
//             new ButtonBuilder()
//                 .setCustomId(`page3`)
//                 .setLabel(`Page 3`)
//                 .setStyle(ButtonStyleimport {
//     SlashCommandBuilder,
//     EmbedBuilder,
//     ActionRowBuilder,
//     ButtonBuilder,
//     ButtonStyle
// } from "discord.js";

// export default {
//     data: new SlashCommandBuilder()
//         .setName("help")
//         .setDescription("This is the help command"),
//     async execute(interaction, client) {
//         const embed = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("Help Command Guide:")
//             .addFields(
//                 { name: "page 1", value: "Help & Resources (button1)" },
//                 { name: "page 2", value: "General Commands (button2)" },
//                 { name: "page 3", value: "Moderation Commands (button3)" },
//                 { name: "page 4", value: "QUT Commands (button4)" }
//             );

//         const embed2 = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("General Commands")
//             .addFields(
//                 {
//                     name: "/help",
//                     value: "Do /help for the commands list & support"
//                 },
//                 {
//                     name: "/info",
//                     value:
//                         "Do /info to get info on the bot's current version and github repo"
//                 },
//                 {
//                     name: "/weather",
//                     value: "Do /weather to get the current weather"
//                 }
//             )
//             .setFooter({text: "General Commands"})
//             .setTimestamp();

//         const embed3 = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("Moderation Commands")
//             .addFields(
//                 {
//                     name: "/configure",
//                     value:
//                         "Do /configure to configure a channel for user verification"
//                 },
//                 {
//                     name: "/purge",
//                     value: "Do /purge to clear a section of chat"
//                 },
//                 { name: "/timeout", value: "Do /timeout to timeout a user" }
//             )
//             .setFooter({text: "Moderation Commands"})
//             .setTimestamp();

//         const embed4 = new EmbedBuilder()
//             .setColor("Green")
//             .setTitle("Help Center")
//             .setDescription("QUT Commands")
//             .addFields(
//                 { name: "/hiq", value: "Do /hiq to get a quick link to HiQ" },
//                 {
//                     name: "/mopp",
//                     value: "Do /mopp to get a quick link to the student MOPP"
//                 },
//                 {
//                     name: "/unitinfo",
//                     value:
//                         "Do /unitinfo to find information about a QUT unit like prerequisites and the name"
//                 }
//             )
//             .setFooter({text: "QUT Commands"})
//             .setTimestamp();

//         const button = new ActionRowBu
//                 .setStyle(ButtonStyle.Success)
//         );

//         const message = await interaction.reply({ embeds: [embed], components: [button] });
//         const collector = await message.createMessageComponentCollector();

//         collector.on('collect', async i => {
//             if (i.setCustomId === 'page1') {
//                 if (i.user.id !== interaction.user.id) {
//                     return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
//                 }
//                 await i.editReply({ embeds: [embed], components: [button] })
//             }

//             if (i.setCustomId === 'page2') {
//                 if (i.user.id !== interaction.user.id) {
//                     return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
//                 }
//                 await i.editReply({ embeds: [embed2], components: [button] })
//             }

//             if (i.setCustomId === 'page3') {
//                 if (i.user.id !== interaction.user.id) {
//                     return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
//                 }
//                 await i.editReply({ embeds: [embed3], components: [button] })
//             }

//             if (i.setCustomId === 'page4') {
//                 if (i.user.id !== interaction.user.id) {
//                     return await i.edit({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
//                 }
//                 await i.editReply({ embeds: [embed4], components: [button] })
//             }
//         })
//     }
// };
