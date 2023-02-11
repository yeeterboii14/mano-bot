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
    .setName("unban")
    .setDescription("Unbans a user.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("The ROBLOX user id of the individual")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason of the unban")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("/");
    }

    if (
      !interaction.member.roles.cache.some((role) =>
        [
          "Assistant Sheriff",
          "Undersheriff",
          "Sheriff",
          "Founding Directory",
        ].includes(role.name)
      )
    )
      return interaction.reply({
        content: `You don't have permission to run this command.`,
        ephemeral: true,
      });

    let id = interaction.options.getInteger("id");
    let reason = interaction.options.getString("reason");

    let username = "N/A";

    try {
      username = await roblox.getUsernameFromId(id);
    } catch (err) {
      // hi
    }

    let peopleOnList = await trello.getCardsOnList("61d524f0a5cf808970cb82bc");

    let targetCard;

    await peopleOnList.forEach(async function (item) {
      let splitCardName = item.name.split(":");
      if (splitCardName[1] == id) {
        targetCard = item;
      }
    });

    let cardPos = 0;

    cardPos = (await Math.random()) * (16512 - 16384 + 1) + 16384;

    if (!targetCard)
      return interaction.reply({
        content: `User is not banned.`,
        ephemeral: true,
      });

    const date = formatDate(new Date());

    await axios
      .put(
        `https://api.trello.com/1/cards/${targetCard.id}?key=apikey&token=apitoken&pos=${cardPos}&idList=61d52bee530bdb381ed43d76`,
        {}
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });

    await trello.addCommentToCard(
      targetCard.id,
      `User unbanned by ${interaction.member.displayName} on ${date}`
    );

    await interaction.reply({
      content: `User has been successfully unbanned.`,
      ephemeral: true,
    });

    let channelToSendTo = client.channels.cache.get("999481825938382900");

    let channelSendEmbed = new EmbedBuilder()
      .setTitle(`Unban Log For **${username}**`)
      .addFields(
        { name: "Username", value: `${username}`, inline: true },
        {
          name: "Profile Link",
          value: `[Roblox](https://roblox.com/users/${id})`,
          inline: true,
        },
        {
          name: "Moderator",
          value: `${interaction.user.toString()}`,
          inline: true,
        },
        { name: "Reason", value: `${reason}`, inline: true }
      )
      .setTimestamp()
      .setColor(0x0099ff)
      .setThumbnail(`${process.env.image}`)
      .setFooter({
        text: "Mano County Automation",
        iconURL: process.env.image,
      });

    await channelToSendTo.send({ embeds: [channelSendEmbed] });
  },
};