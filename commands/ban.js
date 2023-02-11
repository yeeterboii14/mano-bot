const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder,
    EmbedBuilder,
    ComponentType,
    StringSelectMenuBuilder,
  } = require("discord.js");
  const Discord = require("discord.js");
  const fs = require("fs");
  const { url } = require("inspector");
  const roblox = require("noblox.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Submits a ban request.")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setDescription("The ROBLOX user id of the individual")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("evidence")
          .setDescription("All relevant evidence (URLS ONLY)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("date")
          .setDescription(
            "The date the individual will be unbanned. If permeanent state that."
          )
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("notes").setDescription("Any notes for any supervisor")
      )
      .setDMPermission(false),
    async execute(interaction, client) {
      if (
        !interaction.member.roles.cache.some((role) =>
          [
            "Administration",
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
      const hoursDate = new Date();
      const changedDate = `${hoursDate.getHours()}:${hoursDate.getMinutes()} UTC ${changedDate1}`;
  
      let id = interaction.options.getInteger("id");
      let evidence = interaction.options.getString("evidence");
      let date = interaction.options.getString("date");
      let notes = interaction.options.getString("notes");
      let perm = false;
  
      let d = new Date(date);
  
      if (date.toLowerCase() === "permanent" || date.toLowerCase() === "perm")
        perm = true;
  
      if (Object.prototype.toString.call(d) === "[object Date]") {
        if (isNaN(d.getTime()) && perm !== true) {
          // invalid date
          return interaction.reply({
            content:
              "Invalid start date.\n\nPlease use the following format: YYYY/MM/DD or state permanent.",
            ephemeral: true,
          });
        } else {
          // valid date
        }
      } else {
        // invalid object
        return interaction.reply({
          content:
            "Invalid start date object.\n\nPlease use the following format: YYYY/MM/DD or state permanent.",
          ephemeral: true,
        });
      }
  
      let username;
  
      try {
        username = await roblox.getUsernameFromId(Number(id));
      } catch (err) {
        return interaction.reply({
          content: "Invalid user id.",
          ephemeral: true,
        });
      }
  
      try {
        new URL(evidence);
      } catch (err) {
        return interaction.reply({
          content: `${evidence} is not a valid link.`,
          ephemeral: true,
        });
      }
  
      let reasonArray = new Array();
  
      const dropdownMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("reasons-1")
          .setPlaceholder("Select the reason(s)")
          .addOptions(
            { label: `Cop Baiting`, value: `1` },
            { label: `Failed Roleplay`, value: `2` },
            { label: `Interfering with Roleplay`, value: `3` },
            { label: `Abuse of Tools`, value: `4` },
            { label: `Immaturity on Duty`, value: `5` },
            { label: `RTAA/LTAA`, value: `6` },
            { label: `Radio Abuse`, value: `7` },
            { label: `Shooting Inside A Vehicle (FRP)`, value: `8` },
            { label: `Spawn Killing/RP in Spawn`, value: `9` },
            { label: `Flipping Abuse`, value: `10` },
            { label: `911 Abuse`, value: `11` },
            { label: `Random Death Match`, value: `12` },
            { label: `Boosted/Troll Music`, value: `13` },
            { label: `Cuff Sniping/Cuff Rushing`, value: `14` },
            { label: `Trolling`, value: `15` },
            { label: `Interfering with Staff Situation`, value: `16` },
            { label: `Disrespect`, value: `17` },
            { label: `Attempted Bypassing`, value: `18` },
            { label: `Alternative Account`, value: `19` },
            { label: `Abuse of in game mechanics`, value: `20` },
            { label: `Evading a Ban`, value: `21` },
            { label: `Evading a Suspension`, value: `22` },
            { label: `Leaving To Avoid Administrative Action`, value: `23` },
            { label: `Leaving to Avoid Suspension`, value: `24` },
            { label: `Advertising`, value: `25` }
          )
      );
  
      const dropdownMenu2 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("reasons-2")
          .setPlaceholder("Select the reason(s)")
          .addOptions(
            { label: `Bypassing`, value: `26` },
            { label: `Breaking Roblox TOS`, value: `27` },
            { label: `Forging a Command Signature`, value: `28` },
            { label: `Black Mail`, value: `29` },
            { label: `Admin Abuse`, value: `30` },
            { label: `Asset Theft`, value: `31` },
            { label: `Exploiting`, value: `32` },
            { label: `Scamming`, value: `33` },
            { label: `Threats`, value: `34` },
            { label: `Leaking Personal/Classified Information `, value: `35` },
            { label: `Falsifying or Tampering with Evidence`, value: `36` },
            { label: `Bullet Blockers`, value: `37` },
            { label: `New Life Rule`, value: `38` },
            { label: `Ramming a Vehicle`, value: `39` },
            { label: `Spawn Camping/RPing in Spawn`, value: `40` },
            { label: `Popping Tires Inside a Vehicle`, value: `41` },
            { label: `Failure to Comply with Moderation`, value: `42` },
            { label: `Protesting TOS Violation`, value: `43` },
            { label: `Repeated Offender`, value: `44` },
            { label: `Bypassed Audio`, value: `45` },
            { label: `DDOS Threats`, value: `46` },
            { label: `NSFW`, value: `47` }
          )
      );
  
      const reasonEmbed = new EmbedBuilder()
        .setTitle(`Please select all ban reasons`)
        .setDescription(
          `Select the reasons on the dropdown menu listed below. Once you are done please press the \`Continue\` button below.\n\nDon't see all the reasons? Click the \`Next\` button due to Discord API rate limitation.`
        )
        .setColor(0x0099ff)
        .addFields({ name: `Reasons Selected (0)`, value: `N/A` })
        .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
        .setTimestamp();
  
      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`next-ban`)
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("prev-ban")
          .setLabel("Previous")
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("done-ban")
          .setLabel("Finished")
          .setStyle(ButtonStyle.Primary)
      );
  
      const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`next-ban`)
          .setLabel("Next")
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("prev-ban")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("done-ban")
          .setLabel("Finished")
          .setStyle(ButtonStyle.Primary)
      );
  
      const sentMessage = await interaction.reply({
        content: ``,
        components: [dropdownMenu, row2],
        embeds: [reasonEmbed],
        fetchReply: true,
      });
  
      const filter = async (i) => {
        await i.deferUpdate();
        return i.user.id === interaction.user.id;
      };
  
      const collector = await sentMessage.createMessageComponentCollector({
        filter,
        componentType: ComponentType.StringSelect,
        time: 600_000,
        max: 15,
        maxProcessed: 15,
      });
  
      const collector2 = await sentMessage.createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
        time: 600_000,
        max: 10,
        maxProcessed: 10,
      });
  
      await collector.on("collect", async (data) => {
        const value = data.values[0];
  
        if (value === "1") reasonArray.push("Cop Baiting");
        if (value === "2") reasonArray.push("Failed Roleplay");
        if (value === "3") reasonArray.push("Interfering with Roleplay");
        if (value === "4") reasonArray.push("Abuse Of Tools");
        if (value === "5") reasonArray.push("Immaturity on Duty");
        if (value === "6") reasonArray.push("RTAA/LTAA");
        if (value === "7") reasonArray.push("Radio Abuse");
        if (value === "8") reasonArray.push("Shooting Inside A Vehicle (FRP)");
        if (value === "9") reasonArray.push("Spawn Killing/RP in Spawn");
        if (value === "10") reasonArray.push("Flipping Abuse");
        if (value === "11") reasonArray.push("911 Abuse");
        if (value === "12") reasonArray.push("Random Death Match");
        if (value === "13") reasonArray.push("Boosted/Troll Music");
        if (value === "14") reasonArray.push("Cuff Sniping/Cuff Rushing");
        if (value === "15") reasonArray.push("Trolling");
        if (value === "16") reasonArray.push("Interfering with Staff Situation");
        if (value === "17") reasonArray.push("Disrespect");
        if (value === "18") reasonArray.push("Attempted Bypassing");
        if (value === "19") reasonArray.push("Alternative Account");
        if (value === "20") reasonArray.push("Abuse of in game mechanics");
        if (value === "21") reasonArray.push("Evading a Ban");
        if (value === "22") reasonArray.push("Evading a Suspension");
        if (value === "23")
          reasonArray.push("Leaving To Avoid Administrative Action");
        if (value === "24") reasonArray.push("Leaving to Avoid Suspension");
        if (value === "25") reasonArray.push("Advertising");
        if (value === "26") reasonArray.push("Bypassing");
        if (value === "27") reasonArray.push("Breaking Roblox TOS");
        if (value === "28") reasonArray.push("Forging a Command Signature");
        if (value === "29") reasonArray.push("Black Mail");
        if (value === "30") reasonArray.push("Admin Abuse");
        if (value === "31") reasonArray.push("Asset Theft");
        if (value === "32") reasonArray.push("Exploiting");
        if (value === "33") reasonArray.push("Scamming");
        if (value === "34") reasonArray.push("Threats");
        if (value === "35")
          reasonArray.push("Leaking Personal/Classified Information");
        if (value === "36")
          reasonArray.push("Falsifying or Tampering with Evidence");
        if (value === "37") reasonArray.push("Bullet Blockers");
        if (value === "38") reasonArray.push("New Life Rule");
        if (value === "39") reasonArray.push("Ramming a Vehicle");
        if (value === "40") reasonArray.push("Spawn Camping/RPing in Spawn");
        if (value === "41") reasonArray.push("Popping Tires Inside a Vehicle");
        if (value === "42") reasonArray.push("Failure to Comply with Moderation");
        if (value === "43") reasonArray.push("Protesting TOS Violation");
        if (value === "44") reasonArray.push("Repeated Offender");
        if (value === "45") reasonArray.push("Bypassed Audio");
        if (value === "46") reasonArray.push("DDOS Threats");
        if (value === "47") reasonArray.push("NSFW");
  
        let reasonMap = reasonArray.map((x) => x).join("\n");
  
        const reasonEmbed2 = new EmbedBuilder()
          .setTitle(`Please select all ban reasons`)
          .setDescription(
            `Select the reasons on the dropdown menu listed below. Once you are done please press the \`Continue\` button below.\n\nDon't see all the reasons? Click the \`Next\` button due to Discord API rate limitation.`
          )
          .setColor(0x0099ff)
          .addFields({
            name: `Selected Reasons (${reasonArray.length})`,
            value: `${reasonMap}`,
          })
          .setFooter({
            text: "Mano County Automation",
            iconURL: process.env.image,
          })
          .setTimestamp();
  
        await data.message.edit({ embeds: [reasonEmbed2] });
      });
  
      await collector2.on("collect", async (data) => {
        if (data.customId === "next-ban")
          await data.message.edit({ components: [row3, dropdownMenu2] });
        if (data.customId === "prev-ban")
          await data.message.edit({ components: [row2, dropdownMenu] });
        if (data.customId === "done-ban") {
          if (reasonArray.length == 0)
            return interaction.followUp({
              content: `Please select a ban reason before finishing.`,
              ephemeral: true,
            });
  
          await data.message.delete();
  
          let thumbnail_default = await roblox.getPlayerThumbnail(
            id,
            420,
            "png",
            true,
            "Headshot"
          );
  
          const disName = interaction.member.displayName;
          const splitName = disName.split(" ");
          const userOnly = splitName[splitName.length - 1];
  
          const row = new ActionRowBuilder().addComponents(
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
              .setStyle(ButtonStyle.Secondary)
          );
  
          let embedDate;
  
          if (perm === false) {
            let diffTime = Math.abs(d - hoursDate);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            embedDate = diffDays + " days";
          } else {
            embedDate = "Permanent";
          }
  
          if (notes === null) notes = "N/A";
  
          let profImgUrl;
  
          for (var i = 0; i < thumbnail_default.length; i++) {
            profImgUrl = thumbnail_default[i].imageUrl;
          }
  
          let reasonMap = reasonArray.map((x) => x).join(", ");
  
          if (perm === true) date = "Permanent";
  
          let channelSendEmbed = new EmbedBuilder()
            .setTitle(`Ban Request for **${username}**`)
            .setAuthor({
              name: `${interaction.member.displayName}`,
              iconURL: interaction.user.avatarURL(),
            })
            .addFields(
              { name: "Username", value: `${username}` },
              {
                name: "Profile Link",
                value: `[Roblox](https://roblox.com/users/${id})`,
              },
              { name: "Reason(s)", value: `${reasonMap}` },
              { name: "Evidence", value: `${evidence}` },
              { name: "End Date", value: `${date}` },
              { name: "Duration", value: `${embedDate}` },
              { name: "Notes", value: `${notes}` }
            )
            .setTimestamp()
            .setColor(0x0099ff)
            .setThumbnail(`${profImgUrl}`)
            .setFooter({
              text: "Mano County Automation",
              iconURL: process.env.image,
            });
  
          let channelToSendTo = client.channels.cache.get("1001305750511026217");
  
          channelToSendTo.send({
            content: `Submitted at ${changedDate}`,
            components: [row],
            embeds: [channelSendEmbed],
          });
        }
      });
    },
  };