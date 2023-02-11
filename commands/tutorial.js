const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder,
    EmbedBuilder,
    ComponentType,
    StringSelectMenuBuilder,
    MessageCollector,
  } = require("discord.js");
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
      .setName("tutorial")
      .setDescription("Views moderation history on a user.")
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("The way you will be searching.")
          .addChoices(
            { name: `Banning`, value: `banning` },
            { name: `Unbanning`, value: `unbanning` },
            { name: `Information Commands`, value: `information` }
          )
          .setRequired(true)
      ),
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
        
      let type = interaction.options.getString("type");
      let startTime = new Date();
  
      if (type === "banning") {
        const embed1 = new EmbedBuilder()
          .setTitle(`You are beginning the **Banning Tutorial**`)
          .setDescription(
            `You are about to begin the banning tutorial.\n\nThis takes an estimated 10-20 minutes, and requests will time out within 10-20 minutes if no response is recieved.`
          )
          .setColor(0x0099ff)
          .setFooter({
            text: "Mano County Automation",
            iconURL: process.env.image,
          })
          .setTimestamp();
  
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`continue-ban-1`)
            .setLabel("Continue")
            .setStyle(ButtonStyle.Primary)
        );
  
        const sentMessage = await interaction.reply({
          content: ``,
          components: [row1],
          embeds: [embed1],
          fetchReply: true,
        });
  
        const filter = async (i) => {
          await i.deferUpdate();
          return i.user.id === interaction.user.id;
        };
  
        const collector = await sentMessage.createMessageComponentCollector({
          filter,
          componentType: ComponentType.Button,
          time: 6000_000,
          max: 15,
          maxProcessed: 15,
        });
  
        await collector.on("collect", async (data) => {
          if (data.customId === "continue-ban-1") {
            const embed2 = new EmbedBuilder()
              .setTitle(`Required Command Elements`)
              .setDescription(
                `When running the \`ban\` command, a total of three required elements will show up:\n\n**1.** ID (the target's user id)\n**2.** Evidence\n**3.** End Date\n\nAs well as one field that is not required.\n\n**1.** Notes\n\nWe will go into more depth regarding these fields in a later step.`
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            const row2 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`continue-ban-2`)
                .setLabel("Continue")
                .setStyle(ButtonStyle.Primary)
            );
  
            await data.message.edit({ components: [row2], embeds: [embed2] });
          }
          if (data.customId === "continue-ban-2") {
            const embed3 = new EmbedBuilder()
              .setTitle(`Obtaining Roblox Identification Numbers (IDs)`)
              .setDescription(
                `There are three primary ways that we will go over for to get a Roblox Identification Number.\n\nAll ways work in the same fashion, but they won't work if any of the required information is incorrect, such as usernames.`
              )
              .setColor(0x0099ff);
  
            const embed4 = new EmbedBuilder()
              .setTitle(`Obtaining ID from Roblox Search Query`)
              .setDescription(
                `The primary way of recieving an individuals user id is through the Roblox search query.\n\nTo begin, navigate to the [Roblox Website](https://roblox.com)\n\nOnce you are there, navigate to the home page, and find the search box at the top-middle of the screen.\n\nThen, you may type in the username of the individual, and select the box stating \`{username} in People\`\n[Refrence Image](https://cdn.discordapp.com/attachments/1053096998108139540/1073025863861420052/Screenshot_2023-02-08_at_5.40.52_PM.png)\n\nAfter you have searched that, a new page will show up resulting in all search results for your user. You want to find the box that has \`@Username\`\n[Refrence Image](https://cdn.discordapp.com/attachments/1053096998108139540/1073027199143268382/Screenshot_2023-02-08_at_5.46.25_PM.png)\n\nWhen you found their profile box, click on it, and you will be brought to their profile information. After that, navigate to the website URL, and it will automatically highlight it for you. The format will be similiar to this:\n\nwww.roblox.com/users/**USER ID**/profile.\n\nThe information we want from here is the part bolded, stating User ID. Copy that, and you now have their user id.`
              )
              .setColor(0x0099ff);
  
            const embed5 = new EmbedBuilder()
              .setTitle(`Obtaining ID from Website URL`)
              .setDescription(
                `Another effective way of obtaining a users ID is through pasting a URL into the browser.\n\nAfter obtaining their username, you should open a new tab, and paste the following link into the search bar.\n\nwww.roblox.com/users/profile?username=**USERNAME**\n\nThis url will then bring you to their profile link. You must then, click on the website URL, and it will be highlighted for you. The format will be similiar to the following:\n\nwww.roblox.com/users/**USER ID**/profile\n\nYou want to copy the part that is bolded, and that is their user id.`
              )
              .setColor(0x0099ff);
  
            const embed6 = new EmbedBuilder()
              .setTitle(`Obtaining ID from Roblox API Call`)
              .setDescription(
                `The last way to obtain a user id will be from an API Call.\n\nTo begin, you will want to navigate to a new tab, and paste the following URL in (with the username part filled in):\n\n[https://api.roblox.com/users/get-by-username?username=UserName](https://api.roblox.com/users/get-by-username?username=UserName)\n\nThis will then bring up a JSON file from your request. You want to copy the number that says "ID". Then you have user id.\n[Refrence Image](https://cdn.discordapp.com/attachments/1053096998108139540/1073068612778205276/Screenshot_2023-02-08_at_6.00.32_PM.png)`
              )
              .setColor(0x0099ff);
  
            const possibleUsers = [
              "yeeterboii14",
              "lickty123",
              "superguy611",
              "Anthony3522",
              "WhiteSandIsCrazy",
              "ForgedProfit",
              "vaderdread",
              "SirCalebXVI",
              "fragmeta",
            ];
  
            const random = Math.floor(Math.random() * possibleUsers.length);
  
            const embed7 = new EmbedBuilder()
              .setTitle(`Do it yourself`)
              .setDescription(
                `After learning all this, use any of the following techniques to find the user id for the following user:\n\n- **${possibleUsers[random]}**\n\nWhen you are done, paste their user id in this channel.`
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            const row3 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`continue-ban-85`)
                .setLabel("Continue")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
            );
            
             const msgFilter = m => m.author.id === message.author.id
                  
            await data.message.edit({
              components: [row3],
              embeds: [embed3, embed4, embed5, embed6, embed7],
            })
            
            const filter2 = (message) => message.author.id === interaction.member.id
  
        const collectorBlurb = interaction.channel.createMessageCollector({
           time: 300_000,
        });
      
      await collectorBlurb.on("collect", async (m) => {			  
              let expectedUserId = await roblox.getIdFromUsername(
                possibleUsers[random]
              );
  
              const row4 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId(`continue-ban-3`)
                  .setLabel("Continue")
                  .setStyle(ButtonStyle.Primary)
              );
  
              if (expectedUserId == m.content) {
                interaction.followUp({ content: `You got it, you may now continue with the tutorial`, ephemeral: true})
                data.message.edit({ components: [row4] });
                await collectorBlurb.stop('done');
                await m.delete()
              } else {
                interaction.followUp({
                  content: `The user id you provided is not the same as expected. Please try again.`,
                  ephemeral: true,
                });
                await m.delete()
              }
            });  
          }
          if (data.customId === "continue-ban-3") {
            const embed8 = new EmbedBuilder()
              .setTitle(`Evidence Component`)
              .setDescription(
                `The evidence component is another required field inside the ban command. This field should be a place to put all evidence, only URLs are accepted.\n\nIf the image is an attachment, you may use services such as gyazo, lightshot, or whatever other screenshotting provider. There is a link validation so ensure that you are typing in a VALID url.`
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            const row4 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`continue-ban-4`)
                .setLabel("Continue")
                .setStyle(ButtonStyle.Primary)
            );
  
            await data.message.edit({ components: [row4], embeds: [embed8] });
          }
          if (data.customId === "continue-ban-4") {
            const embed9 = new EmbedBuilder()
              .setTitle(`End Date Component`)
              .setDescription(
                `The end date component is the last required component inside the ban command. If you are specifying an end date, the following formats may be used \`MM/DD/YYYY\` or \`DD/MM/YYYY\`. Dates area validated using Javascript's date system, and are set to end at 12:00am CST.\n\nIf you would like the ban to be permanent, you can either specify perm, or permanent, it is not case sensitive.`
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            const row5 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`continue-ban-5`)
                .setLabel("Continue")
                .setStyle(ButtonStyle.Primary)
            );
  
            await data.message.edit({ components: [row5], embeds: [embed9] });
          }
          if (data.customId === "continue-ban-5") {
            const embed10 = new EmbedBuilder()
              .setTitle(`Notes Component`)
              .setDescription(
                `The notes component is the only not required component inside the ban command. Per administration policy this should be the place to specify a description on the event that took place. This will default to N/A if no notes are provided.`
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            const row6 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`continue-ban-6`)
                .setLabel("Continue")
                .setStyle(ButtonStyle.Primary)
            );
  
            await data.message.edit({ components: [row6], embeds: [embed10] });
          }
          if (data.customId === "continue-ban-6") {
            const embed11 = new EmbedBuilder()
              .setTitle(`Completing the Ban`)
              .setDescription(
                `After you have ran the command, a request embed will be sent to the specified channel taking all information included, and allowing Assitant Sheriffs to either accpet or deny it.`
              )
              .setColor(0x0099ff);
  
            const embed12 = new EmbedBuilder()
              .setTitle(`Self-Diagnosing Errors`)
              .setDescription(
                `If there are any issues while running the command, the bot will most likely instruct you on how to fix it. If that does not happen, and further issues are provoked, the bot will automatically restart itself. You should then report this bug using either the \`/bug-report\` command, or sending a message to yeeterboii14#5954. (<@!725431849098412193>)`
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            const row7 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`continue-ban-7`)
                .setLabel("Finish the Tutorial")
                .setStyle(ButtonStyle.Primary)
            );
  
            await data.message.edit({
              components: [row7],
              embeds: [embed11, embed12],
            });
          }
          if (data.customId === "continue-ban-7") {
            var diff = Math.abs(new Date() - new Date(startTime));
  
            let totalMins = Math.floor(diff / 1000 / 60);
  
            const embed13 = new EmbedBuilder()
              .setTitle(`Ban Tutorial Completion Certificate`)
              .setDescription(
                `Congrats on completing the tutorial! Any further questions on banning should be directed to an Assistant Sheriff+ or the bot developer (<@!725431849098412193>)`
              )
              .addFields(
                { name: "Username", value: `${interaction.member.displayName}` },
                {
                  name: "Discord User",
                  value: `${interaction.member.toString()}`,
                },
                { name: "Tutorial", value: `Banning` },
                {
                  name: "Start Time",
                  value: `${startTime.toLocaleTimeString()}`,
                },
                { name: "End Time", value: `${new Date().toLocaleTimeString()}` },
                { name: "Elapsed Time", value: `${totalMins} minutes` }
              )
              .setColor(0x0099ff)
              .setFooter({
                text: "Mano County Automation",
                iconURL: process.env.image,
              })
              .setTimestamp();
  
            await data.message.edit({ components: [], embeds: [embed13] });
          }
        });
      }
    },
  };