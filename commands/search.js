const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const roblox = require("noblox.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search an individual for any flags.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The roblox username of the user you want to search")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    if (
      !interaction.member.roles.cache.some((role) =>
        ["Department Head"].includes(role.name)
      )
    )
      return interaction.reply({
        content: `You must be a head of department to run this command.`,
        ephemeral: true,
      });

    interaction.deferReply({ ephemeral: true });

    let primaryMessage = await interaction.channel.send({
      content: `Checking if user is valid **0/3**.`,
    });

    const username = interaction.options.getString("username");

    const invalidUserEmb = new EmbedBuilder()
      .setTitle("Invalid Username")
      .setDescription(
        `It appears ${username} is not a valid username. Please ensure their name is spelled correctly. `
      )
      .setColor(0x50c878)
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    let id;
    try {
      id = await roblox.getIdFromUsername(username);
    } catch {
      primaryMessage.delete();
      return interaction.channel.send({
        content: "",
        embeds: [invalidUserEmb],
      });
    }

    primaryMessage.edit({ content: `Performing profile scan **1/3**` });

    await wait(2000);

    let inventory = "Opened";

    let playerInfo = await roblox.getPlayerInfo(id);

    let badgeCount;

    try {
      badgeCount = await roblox.getPlayerBadges(id, 100, "Asc");
    } catch {
      badgeCount = new Array();
      inventory = "Closed";
    }

    if (badgeCount.length == "100") {
      badgeCount = "100+";
    } else {
      badgeCount = `${badgeCount.length}`;
    }

    let collectiblesCount;

    try {
      collectiblesCount = await roblox.getCollectibles({
        userId: id,
        sortOrder: "Asc",
        limit: 25,
      });
    } catch {
      collectiblesCount = new Array();
      inventory = "Closed";
    }

    if (collectiblesCount.length == "25") {
      collectiblesCount = "25+";
    } else {
      collectiblesCount = `${collectiblesCount.length}`;
    }

    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("/");
    }

    let formatedJoinDate = formatDate(new Date(playerInfo.joinDate));

    let thumbnail_default = await roblox.getPlayerThumbnail(
      id,
      420,
      "png",
      true,
      "Headshot"
    );

    let profImgUrl;

    for (var i = 0; i < thumbnail_default.length; i++) {
      profImgUrl = thumbnail_default[i].imageUrl;
    }

    const profileEmbed = new EmbedBuilder()
      .setTitle(`Profile Scan For **${username}**`)
      .setDescription(`\`\`\`${playerInfo.blurb}\`\`\``)
      .setThumbnail(`${profImgUrl}`)
      .addFields(
        { name: "User ID", value: `${id}`, inline: true },
        {
          name: "Display Name",
          value: `${playerInfo.displayName}`,
          inline: true,
        },
        {
          name: "Old Names",
          value: `${playerInfo.oldNames.length}`,
          inline: true,
        },
        {
          name: "Friend Count",
          value: `${playerInfo.friendCount}`,
          inline: true,
        },
        {
          name: "Following",
          value: `${playerInfo.followingCount}`,
          inline: true,
        },
        {
          name: "Followers",
          value: `${playerInfo.followerCount}`,
          inline: true,
        },
        {
          name: "Account Age",
          value: `${playerInfo.age} days (${formatedJoinDate})`,
          inline: true,
        },
        { name: "Badges", value: `${badgeCount}`, inline: true },
        { name: "Collectibles", value: `${collectiblesCount}`, inline: true },
        { name: "Inventory", value: `${inventory}`, inline: true },
        {
          name: "Profile Link",
          value: `[Roblox](https://roblox.com/users/${id})`,
          inline: true,
        }
      )
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    await wait(15000); // just giving it time to like chill out

    await primaryMessage.edit({ content: `Performing inventory scan **2/3**` });

    await primaryMessage.edit({ content: `Performing group scan **3/3**` });

    await wait(45000);

    const groups = await roblox.getGroups(id);

    const flaggedGroups = new Array();
    const manuallyFlaggedGroups = new Array();

    for (var i = 0; i < groups.length; i++) {
      const groupFound = await roblox.getGroup(groups[i].Id);

      if (
        groupFound.name.includes("Mano") ||
        groupFound.name.includes("Pennsylvania") ||
        groupFound.name.includes("PA") ||
        groupFound.name.includes("MCSO") ||
        groupFound.name.includes("MCRS") ||
        groupFound.name.includes("PSP") ||
        groupFound.name.includes("PNG") ||
        groupFound.name.includes("MCFR") ||
        groupFound.name.includes("MCFD") ||
        groupFound.name.includes("CTPD") ||
        groupFound.name.includes("MPD") ||
        groupFound.name.includes("MBPD") ||
        groupFound.name.includes("Magnolia") ||
        groupFound.name.includes("Clearcreek") ||
        groupFound.name.includes("CMPD")
      ) {
        if (
          groupFound.owner.username === "Mano_South" ||
          groupFound.owner.username === "MCSOManager" ||
          groupFound.owner.username === "MCSO_Management" ||
          groupFound.owner.username === "superguy611"
        ) {
        } else {
          flaggedGroups.push(
            `[${groupFound.name}](https://roblox.com/groups/${groupFound.id}) owned by [${groupFound.owner.username}](https://roblox.com/users/${groupFound.owner.userId}) with ${groupFound.memberCount} members`
          );
        }
      }
    }

    await wait(5000);

    let mappedUsers = flaggedGroups.map((x) => x).join("\n");
    let mappedUsers2 = manuallyFlaggedGroups.map((x) => x).join("\n");

    const groupScan = new EmbedBuilder()
      .setTitle("Group Scan")
      .setDescription(
        `Automatic Group Flags (${flaggedGroups.length}):\n\n${mappedUsers}\n\nManually Flagged Groups (${manuallyFlaggedGroups.length}):\n\n${mappedUsers2}`
      )
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    let embedContent = `<@!${interaction.member.id}>`;

    primaryMessage.delete();
    interaction.channel.send({
      content: `${embedContent}`,
      embeds: [profileEmbed, groupScan],
    });
  },
};