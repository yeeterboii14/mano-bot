const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const axios = require("axios");
const Trello = require("trello");
const trello = new Trello(
  "apikey",
  "apitoken"
);
const roblox = require("noblox.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("history")
    .setDescription("Views moderation history on a user.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The way you will be searching.")
        .addChoices(
          { name: `Username`, value: `username` },
          { name: `User ID`, value: `id` }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("The username/user id of the individual")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let target = interaction.options.getString("target");
    let type = interaction.options.getString("type");
    let id;

    if (type === "id") id = target;
    if (type === "username") {
      try {
        id = await roblox.getIdFromUsername(target);
      } catch (err) {
        interaction.reply({ content: `Invalid username`, ephemeral: true });
      }
    }

    let username = "N/A";

    try {
      username = await roblox.getUsernameFromId(id);
    } catch (err) {
      // hi
    }

    await interaction.reply({ content: "Searching..." });

    let peopleOnList = await trello.getCardsOnList("61d524f0a5cf808970cb82bc");
    let peopleOnList2 = await trello.getCardsOnList("61d7bd7248b24f7a1fd6d6e8");
    let peopleOnList3 = await trello.getCardsOnList("61d52bee530bdb381ed43d76");
    let peopleOnList4 = await trello.getCardsOnList("6205ab3ae253fc14086b170a");
    let peopleOnList5 = await trello.getCardsOnList("5febfbccd46887840f4a28b6");
    let peopleOnList6 = await trello.getCardsOnList("5febfbe2baee4336d9d9898e");

    let targetCard;

    let foundResults = new Array();
    let suspensionResults = new Array();

    await peopleOnList.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        foundResults.push(`[${item.name}](${item.url}) in list **Banlist**`);
      }
    });

    await peopleOnList2.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        foundResults.push(
          `[${item.name}](${item.url}) in list **Founder Banlist**`
        );
      }
    });

    await peopleOnList3.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        foundResults.push(
          `[${item.name}](${item.url}) in list **Completed Bans**`
        );
      }
    });

    await peopleOnList4.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        foundResults.push(`[${item.name}](${item.url}) in list **Archives**`);
      }
    });

    await peopleOnList5.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        suspensionResults.push(
          `[${item.name}](${item.url}) in list **Active Suspensions**`
        );
      }
    });

    await peopleOnList6.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        suspensionResults.push(
          `[${item.name}](${item.url}) in list **Completed Suspensions**`
        );
      }
    });

    if (foundResults.length == 0 && suspensionResults.length == 0) {
      return interaction.editReply({ content: `No results found` });
    } else {
      let resultMap = foundResults.map((x) => x).join("\n");
      let suspMap = suspensionResults.map((x) => x).join("\n");

      if (foundResults.length == 0) resultMap = "Nothing Found";
      if (suspensionResults.length == 0) suspMap = "Nothing Found";

      let sendEmbed = new EmbedBuilder()
        .setTitle(`Moderation History Results For ${username}`)
        .setDescription(
          `I have found ${
            foundResults.length + suspensionResults.length
          } result(s) for your specified user.\n\n **Bans:**\n${resultMap}\n\n**Suspensions:**\n${suspMap}`
        )
        .setFooter({
          text: "Mano County Automation",
          iconURL: process.env.image,
        })
        .setTimestamp();

      interaction.editReply({ embeds: [sendEmbed], content: "" });
    }
  },
};