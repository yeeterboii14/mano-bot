const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
  } = require("discord.js");
  const Discord = require("discord.js");
  const axios = require("axios");
  const Trello = require("trello");
  const trello = new Trello(
    "api key",
    "api token"
  );
  const roblox = require("noblox.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ban-status")
      .setDescription("Confirms whether a user is listed as banned.")
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
  
      let banConfirmed = false;
      let cardUrl;
      let cardDescrip;
  
      await peopleOnList.forEach(async function (item) {
        let splitCardName = item.name.split(":");
        if (splitCardName[1] == id) {
          banConfirmed = true;
          cardDescrip = item.desc;
          cardUrl = item.url;
        }
      });
  
      await peopleOnList2.forEach(async function (item) {
        let splitCardName = item.name.split(":");
        if (splitCardName[1] == id) {
          banConfirmed = true;
          cardDescrip = item.desc;
          cardUrl = item.url;
        }
      });
  
      if (banConfirmed === true) {
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Card Link")
            .setURL(`${cardUrl}`)
            .setStyle(ButtonStyle.Link)
        );
  
        let sentEmbed = new EmbedBuilder()
          .setTitle(`Confirmed Ban For ${username}`)
          .setDescription(
            `I have found a user in the banlist matching your description.\n\n\`\`\`${cardDescrip}\`\`\``
          )
          .setFooter({
            text: "Mano County Automation",
            iconURL: process.env.image,
          })
          .setTimestamp();
  
        await interaction.editReply({
          embeds: [sentEmbed],
          components: [row2],
          content: "",
        });
      } else {
        await interaction.editReply({ content: `No results found` });
      }
    },
  };