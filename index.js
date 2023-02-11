const wait = require("node:timers/promises").setTimeout;
const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ButtonStyle,
} = require("discord.js");
const Discord = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const Trello = require("trello");
const trello = new Trello(
  "api key",
  "api token"
);
require("dotenv").config();
const noblox = require("noblox.js");
const roblox = require("noblox.js");
const fetch = require("axios");
const axios = require("axios");
const cron = require("node-cron")
      let developerUserIds = ["725431849098412193"];

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once(Events.ClientReady, async () => {
  console.log("Bot Started\n-----");

  require(`./deploy-commands.js`);

  const status = {
    activities: [
      {
        name: `Mano County Administration`,
        type: Discord.ActivityType.Watching,
      },
    ],
    status: "online",
  };

  client.user.setPresence(status);
});

// slash handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.isStringSelectMenu()) console.log(interaction);

  if (interaction.customId === "accept") {
    if (
      !interaction.member.roles.cache.some((role) =>
        [
          "Assistant Sheriff",
          "Undersheriff",
          "Sheriff",
          "Founding Directory",
        ].includes(role.name)
      )
    ) {
      return interaction.reply({
        content: "You are not authorized to approve ban requests.",
        ephemeral: true,
      });
    }

    let username;
    let reasons;
    let evidence;
    let duration;
    let notes;
    let endDate;
    let profLink;
    let mjr;

    interaction.message.embeds.forEach(async (embed) => {
      embed.fields.forEach((field) => {
        if (field.name === "Username") {
          username = field.value;
        }

        if (field.name === "Reason(s)") {
          reasons = field.value;
        }

        if (field.name === "Evidence") {
          evidence = field.value;
        }

        if (field.name === "Duration") {
          duration = field.value;
        }

        if (field.name === "Duration") {
          duration = field.value;
        }

        if (field.name === "Notes") {
          notes = field.value;
        }

        if (field.name === "End Date") {
          endDate = field.value;
        }

        if (field.name === "Profile Link") {
          profLink = field.value;
        }
      });

      mjr = embed.author.name;
    });

    let foundUser;
    try {
      foundUser = await interaction.guild.members.cache.find(
        (member) => member.displayName.toLowerCase() === username.toLowerCase()
      );
    } catch (err) {
      console.log(err);
    }

    let reasonsArray = reasons.split(",");

    let startDate = new Date();
    let endDate1;

    if (endDate === "Permanent") {
      // do nothing
    } else {
      endDate1 = new Date(endDate);
    }

    let userId = await noblox.getIdFromUsername(username);
    let targetCard;

    let cardPos = 0;

    if (endDate === "Permanent") {
      cardPos =
        Math.random() * (1283.4569244384766 - 1219.104396820068 + 1) +
        1219.104396820068;
    } else {
      cardPos =
        Math.random() * (1219.104396820068 - 1154.75186920166 + 1) +
        1026.046813964844;
    }

    let cardDescrip = `##Mano County Automation Ban Submission\n\n---\n\n**Profile Link:** ${profLink}\n**Reason(s):** ${reasons}\n**Duration:** ${duration}\n**Evidence:** ${evidence}\n**Notes:** ${notes}\n\n---\n**Approved by ${interaction.member.displayName}**`;
    let cardUsername = `${username}:${userId}`;

    await trello.addCard(
      cardUsername,
      cardDescrip,
      "61d524f0a5cf808970cb82bc",
      function (error, trelloCard) {
        if (error) {
          console.log("Could not add card:", error);
        } else {
          targetCard = trelloCard;
        }
      }
    );

    await wait(2000);

    let labelArray = new Array();

    const durationSplitArgs = duration.split(" ");
    const numberDurationArgs = durationSplitArgs[0];

    if (Number(numberDurationArgs) >= 1 && Number(numberDurationArgs) <= 3)
      labelArray.push(`5f158e9ca3858d5856c7eacb`);
    if (Number(numberDurationArgs) > 3 && Number(numberDurationArgs) <= 5)
      labelArray.push(`6169e54605acf849b87584d8`);
    if (Number(numberDurationArgs) > 5 && Number(numberDurationArgs) <= 10)
      labelArray.push(`5f4c67470b59dc80b3d66216`);
    if (Number(numberDurationArgs) >= 11 && Number(numberDurationArgs) <= 20)
      labelArray.push(`5f4c6771cbd5662b14eb139d`);
    if (Number(numberDurationArgs) > 20 && Number(numberDurationArgs) <= 30)
      labelArray.push(`5f4c677b5f45736686bef76f`);
    if (Number(numberDurationArgs) > 31)
      labelArray.push(`61d5253cad7e474c4c4b3d10`);
    if (endDate === "Permanent") labelArray.push(`5c4d461b67f5a4240085b0e0`);

    labelArray.push(`5e18c53fad68fc38542bf3ac`);

    for (var i = 0; i < reasonsArray.length; i++) {
      if (reasonsArray[i].includes("Cop Baiting"))
        labelArray.push(`604929b55650b18619fcddf9`);
      if (reasonsArray[i].includes("Interfering with Roleplay"))
        labelArray.push(`5ffb91f5db210c8db0a9c49d`);
      if (reasonsArray[i].includes("Failed Roleplay"))
        labelArray.push(`5eb4a168d784f37e3e83010b`);
      if (reasonsArray[i].includes("Abuse of Tools"))
        labelArray.push(`607c19eeb5ca2311439c2627`);
      if (reasonsArray[i].includes("Immaturity on Duty"))
        labelArray.push(`5eb4a18219f8f0812af8fb97`);
      if (reasonsArray[i].includes("RTAA/LTAA"))
        labelArray.push(`5c4d461b67f5a4240085b0cf`);
      if (reasonsArray[i].includes("Radio Abuse"))
        labelArray.push(`5eb4a1d73f439d31da71e65a`);
      if (reasonsArray[i].includes("Shooting Inside A Vehicle (FRP)"))
        labelArray.push(`5eb4a1ed86fa0c33c94773d0`);
      if (reasonsArray[i].includes("Spawn Killing/RP in Spawn"))
        labelArray.push(`5eb4a21e5077164145ad28f3`);
      if (reasonsArray[i].includes("Flipping Abuse"))
        labelArray.push(`5eb4a22ce24d462314171c8e`);
      if (reasonsArray[i].includes("911 Abuse"))
        labelArray.push(`5f158e892d34b058ff5a5ba2`);
      if (reasonsArray[i].includes("Random Death Match"))
        labelArray.push(`61d524a9ffca1f891ac3227e`);
      if (reasonsArray[i].includes("Boosted/Troll Music"))
        labelArray.push(`5eb4a24f9772140d9f65ebe3`);
      if (reasonsArray[i].includes("Cuff Sniping/Cuff Rushing"))
        labelArray.push(`5eb4a2839f0b75731c224031`);
      if (reasonsArray[i].includes("Trolling"))
        labelArray.push(`5eb4a2b9aa5cfe1e649736f6`);
      if (reasonsArray[i].includes("Interfering with Staff Situation"))
        labelArray.push(`5ffb922d4ca19a584fff1de5`);
      if (reasonsArray[i].includes("Disrespect"))
        labelArray.push(`5eb4a294137fe634a97ebab1`);
      if (reasonsArray[i].includes("Attempted Bypassing"))
        labelArray.push(`5eb4a2e1dbf0eb064761743b`);
      if (reasonsArray[i].includes("Alternative Account"))
        labelArray.push(`5eb4a2f491f8a51015615905`);
      if (reasonsArray[i].includes("Abuse of in game mechanics"))
        labelArray.push(`620a74f758172e317f29b31a`);
      if (reasonsArray[i].includes("Evading a Ban"))
        labelArray.push(`5eb4a31dc08d1c0c925146e9`);
      if (reasonsArray[i].includes("Evading a Suspension"))
        labelArray.push(`63cd83d1027ce70018ce8362`);
      if (reasonsArray[i].includes("Leaving To Avoid Administrative Action"))
        labelArray.push(`5eb4a3416e4d360556855755`);
      if (reasonsArray[i].includes("Leaving to Avoid Suspension"))
        labelArray.push(`61d524aaffca1f891ac323d3`);
      if (reasonsArray[i].includes("Advertising"))
        labelArray.push(`5eb59e4b9d383e8a1821cc09`);
      if (reasonsArray[i].includes("Bypassing"))
        labelArray.push(`5eae1599f1ddd508e85454f1`);
      if (reasonsArray[i].includes("Breaking Roblox TOS"))
        labelArray.push(`5f1600091ebfe28364a55647`);
      if (reasonsArray[i].includes("Forging a Command Signature"))
        labelArray.push(`6009001ed100198c492df26c`);
      if (reasonsArray[i].includes("Black Mail"))
        labelArray.push(`5c4d461b67f5a4240085b0df`);
      if (reasonsArray[i].includes("Admin Abuse"))
        labelArray.push(`5c4d461b67f5a4240085b0d3`);
      if (reasonsArray[i].includes("Asset Theft"))
        labelArray.push(`5eb4a35374c51c5a0d02fa0f`);
      if (reasonsArray[i].includes("Exploiting"))
        labelArray.push(`5eae18e9fff68d24725882c9`);
      if (reasonsArray[i].includes("Scamming"))
        labelArray.push(`5eae190a2552a935bb39770b`);
      if (reasonsArray[i].includes("Threats"))
        labelArray.push(`5eae192e62a1b02938aa3883`);
      if (reasonsArray[i].includes("Leaking Personal/Classified Information"))
        labelArray.push(`6092e42f0f263381e0a62736`);
      if (reasonsArray[i].includes("Falsifying or Tampering with Evidence"))
        labelArray.push(`620bb482ed0d7c0d7633d935`);
      if (reasonsArray[i].includes("Bullet Blockers"))
        labelArray.push(`60dcca6b119d6f0e3f596944`);
      if (reasonsArray[i].includes("New Life Rule"))
        labelArray.push(`60c1222dabbfa94ec9cc7531`);
      if (reasonsArray[i].includes("Ramming a Vehicle"))
        labelArray.push(`60fad371916a083a2960b1dd`);
      if (reasonsArray[i].includes("Spawn Camping/RPing in Spawn"))
        labelArray.push(`5fa04a0294b0af44d5de96fe`);
      if (reasonsArray[i].includes("Popping Tires Inside a Vehicle"))
        labelArray.push(`61d526b2af976d109468fa61`);
      if (reasonsArray[i].includes("Failure to Comply with Moderation"))
        labelArray.push(`60cfdc36199236728dd460de`);
      if (reasonsArray[i].includes("Protesting TOS Violation"))
        labelArray.push(`5ee6a1ddfe090587fa6bdfcd`);
      if (reasonsArray[i].includes("Repeated Offender"))
        labelArray.push(`60a4634301020f3e94e3513d`);
      if (reasonsArray[i].includes("Bypassed Audio"))
        labelArray.push(`5eae1599f1ddd508e85454f1`);
      if (reasonsArray[i].includes("DDOS Threats"))
        labelArray.push(`63110a719f4bcd01d4057104`);
      if (reasonsArray[i].includes("NSFW"))
        labelArray.push(`60973ee4820ec07632221b52`);
    }

    if (endDate === "Permanent") {
      await axios
        .put(
          `https://api.trello.com/1/cards/${targetCard.id}?key=apikey&token=apitoken&pos=${cardPos}&idLabels=${labelArray}`,
          {}
        )
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    } else {
      await axios
        .put(
          `https://api.trello.com/1/cards/${targetCard.id}?key=apikey&token=apitoken&start=${startDate}&due=${endDate1}&pos=${cardPos}&idLabels=${labelArray}`,
          {}
        )
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
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

    const changedDate1 = formatDate(new Date());

    let durationMessage;

    if (endDate === "Permanent") {
      durationMessage = "indefinitely";
    } else {
      durationMessage = `for ${duration}`;
    }

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Card Link")
        .setURL(`${targetCard.url}`)
        .setStyle(ButtonStyle.Link)
    );

    let msgContent = `\`${changedDate1}\`\n<:mcsoa:916895633053483068> | **Mano County Administration Notice of Moderation Action**\n\nHello, ${username}. We'd link to inform you that action has been taken on your Roblox account.\n\nYou have been banned ${durationMessage} for the following reason(s):\n > ${reasons}.\n\nLooking to appeal this ban? You can do so by sending a message to <@!575252669443211264> and continuing with their prompts to create a support ticket.\n\nRegards,\n**Mano County Administration**`;

    let notified = "No";

    try {
      foundUser.send({ content: `${msgContent}`, components: [row2] });
      notified = "Yes";
    } catch (err) {
      console.log(err);
    }

    let channelSendEmbed = new EmbedBuilder()
      .setTitle(`Ban Log For **${username}**`)
      .addFields(
        { name: "Username", value: `${username}`, inline: true },
        {
          name: "Profile Link",
          value: `${profLink}`,
          inline: true,
        },
        { name: "Reason(s)", value: `${reasons}`, inline: true },
        { name: "Evidence", value: `${evidence}`, inline: true },
        { name: "End Date", value: `${endDate}`, inline: true },
        { name: "Duration", value: `${duration}`, inline: true },
        { name: "Major", value: `${mjr}`, inline: true },
        {
          name: "Supervising Signature",
          value: `${interaction.user.toString()}`,
          inline: true,
        },
        { name: "Notified", value: `${notified}`, inline: true }
      )
      .setTimestamp()
      .setColor(0x50c878)
      .setThumbnail(`${process.env.image}`)
      .setFooter({
        text: "Mano County Automation",
        iconURL: process.env.image,
      });

    let channelToSendTo = client.channels.cache.get("999481825938382900");

    channelToSendTo.send({ embeds: [channelSendEmbed] });

    await interaction.message.delete();
  }
  if (interaction.customId === "deny") {
    if (
      !interaction.member.roles.cache.some((role) =>
        [
          "Assistant Sheriff",
          "Undersheriff",
          "Sheriff",
          "Founding Directory",
        ].includes(role.name)
      )
    ) {
      return interaction.reply({
        content: "You are not authorized to deny ban requests.",
        ephemeral: true,
      });
    }

    let username;
    let reasons;
    let evidence;
    let duration;
    let notes;
    let endDate;
    let profLink;
    let mjr;

    interaction.message.embeds.forEach(async (embed) => {
      embed.fields.forEach((field) => {
        if (field.name === "Username") {
          username = field.value;
        }

        if (field.name === "Reason(s)") {
          reasons = field.value;
        }

        if (field.name === "Evidence") {
          evidence = field.value;
        }

        if (field.name === "Duration") {
          duration = field.value;
        }

        if (field.name === "Duration") {
          duration = field.value;
        }

        if (field.name === "Notes") {
          notes = field.value;
        }

        if (field.name === "End Date") {
          endDate = field.value;
        }

        if (field.name === "Profile Link") {
          profLink = field.value;
        }
      });

      mjr = embed.author.name;
    });

    const dropdownMenu2 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("reasons-4")
        .setPlaceholder("Select the reason you declined the ban")
        .addOptions(
          { label: `Invalid Evidence`, value: `1` },
          { label: `Unfounded Accusations`, value: `2` },
          { label: `Excessive Ban Time`, value: `3` },
          { label: `Other`, value: `4` }
        )
    );

    const reasonEmbed = new EmbedBuilder()
      .setTitle(`Please select the reason you denied the ban`)
      .setDescription(`Select the reasons on the dropdown menu listed below.`)
      .setColor(0x0099ff)
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    const sentMessage = await interaction.reply({
      content: ``,
      components: [dropdownMenu2],
      embeds: [reasonEmbed],
      fetchReply: true,
      ephemeral: true,
    });

    const filter = async (i) => {
      await i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    const collector = await sentMessage.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: 600_000,
      max: 1,
      maxProcessed: 1,
    });

    let reason;
    let typeRequired = false;

    collector.on("collect", async function (data) {
      const value = data.values[0];

      if (value === "1") reason = "Invalid Evidence";
      if (value === "2") reason = "Unfounded Accusations";
      if (value === "3") reason = "Excessive Ban Time";
      if (value === "4") reason = "Other";

      let channelSendEmbed5 = new EmbedBuilder()
        .setTitle(`Denied Ban Log For **${username}**`)
        .addFields(
          { name: "Username", value: `${username}`, inline: true },
          {
            name: "Profile Link",
            value: `${profLink}`,
            inline: true,
          },
          { name: "Reason(s)", value: `${reasons}`, inline: true },
          { name: "Evidence", value: `${evidence}`, inline: true },
          { name: "End Date", value: `${endDate}`, inline: true },
          { name: "Duration", value: `${duration}`, inline: true },
          { name: "Major", value: `${mjr}`, inline: true },
          {
            name: "Supervising Signature",
            value: `${interaction.user.toString()}`,
            inline: true,
          },
          { name: "Denied Reason", value: `${reason}`, inline: true }
        )
        .setTimestamp()
        .setColor(0xee4b2b)
        .setThumbnail(`${process.env.image}`)
        .setFooter({
          text: "Mano County Automation",
          iconURL: process.env.image,
        });

      let channelToSendTo = client.channels.cache.get("999481825938382900");

      channelToSendTo.send({ embeds: [channelSendEmbed5] });

      await interaction.message.delete();
    });
  }
  if (interaction.customId === "stats") {
    if (
      !interaction.member.roles.cache.some((role) =>
        [
          "Assistant Sheriff",
          "Undersheriff",
          "Sheriff",
          "Founding Directory",
        ].includes(role.name)
      )
    ) {
      return interaction.reply({
        content: "You are not authorized to use this.",
        ephemeral: true,
      });
    }

    let username;

    interaction.message.embeds.forEach(async (embed) => {
      embed.fields.forEach((field) => {
        if (field.name === "Username") {
          username = field.value;
        }
      });
    });

    let id = await roblox.getIdFromUsername(username);

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

    await interaction.reply({ embeds: [profileEmbed] });

    const row59 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept`)
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("deny")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("stats")
        .setLabel("User Information")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.message.edit({ components: [row59] });
  }
});

client.on("shardError", (error) => {
  console.log("shardError", error);
});

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection`, error);
});

process.on("uncaughtExceptionMonitor", (error) => {
  console.log("uncaughtExceptionMonitor", error);
});

process.on("customError", (error) => {
  console.log("customError", error);
});

cron.schedule('00 00 * * * *', () => {
  
  console.log('started?');
  
      async function Test() {
      let peopleOnList = await trello.getCardsOnList(
        "61d524f0a5cf808970cb82bc"
      );

      let itemArray = new Array();

      await peopleOnList.forEach(async function (item) {
        var date1 = item.due;
        var date4 = new Date("1970-01-01T00:00:00.000Z"); // Reason is because cards that have no due date go back to this date so I have to exclude it.
        var date2 = new Date(date1);
        var date3 = new Date();

        if (date2.getTime() != date4.getTime()) {
          // Checking to see if a card has a due date
          if (date2.getTime() <= date3.getTime()) {
            // Checking for over due's
            itemArray.push(item);
          }
        }
      });

      for (var i = 0; i < itemArray.length; i++) {
        const item = itemArray[i];

        let cardPos = 0;

        cardPos = (await Math.random()) * (16512 - 16384 + 1) + 16384;

        try {
          await axios
            .put(
              `https://api.trello.com/1/cards/${item.id}?key=apikey&token=apitoken&pos=${cardPos}&idList=61d52bee530bdb381ed43d76&dueComplete=true`,
              {}
            )
            .then((response) => {})
            .catch((error) => {
              console.log(error);
            });
        } catch (err) {
          console.log(err);
        }

        trello.addCommentToCard(
          item.id,
          `Automatically unbanned by Mano County Automation due to due date being overdue.`
        );

        let channelToSendTo = client.channels.cache.get("999481825938382900");

        let username1 = item.name.split(":");
        let username = username1[0];

        let channelSendEmbed = new EmbedBuilder()
          .setTitle(`Automatic Unban Log For **${username}**`)
          .addFields(
            { name: "Username", value: `${username}`, inline: true },
            {
              name: "Profile Link",
              value: `[Roblox](https://www.roblox.com/users/profile?username=${username})`,
              inline: true,
            },
            {
              name: "Moderator",
              value: `Mano County Automation`,
              inline: true,
            },
            { name: "Reason", value: `Overdue Card`, inline: true },
            { name: "Card Link", value: `[Trello](${item.url})`, inline: true }
          )
          .setTimestamp()
          .setColor(0x0099ff)
          .setThumbnail(`${process.env.image}`)
          .setFooter({
            text: "Mano County Automation",
            iconURL: process.env.image,
          });

        await channelToSendTo.send({ embeds: [channelSendEmbed] });
      }
    }

    Test();
    
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });

client.login(process.env.token);