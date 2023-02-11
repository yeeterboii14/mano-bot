const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bug-report")
    .setDescription("Submit a bug report to the bot developers.")
    .addStringOption((option) =>
      option
        .setName("bug")
        .setDescription("The bug/issue you would like to report")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("steps")
        .setDescription("Steps to reproduce the bug")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("evidence")
        .setDescription("Any evidence pertaining to the bug")
    ),
  async execute(interaction, client) {
    let blacklistedUsers = [];
    let blacklisted = false;

    for (var i = 0; i < blacklistedUsers.length; i++) {
      if (interaction.user.id === blacklistedUsers[i]) blacklisted = true;
    }

    if (blacklisted === true)
      return await interaction.reply({
        content: `You are blacklisted from using this command`,
        ephemeral: true,
      });

    let bug = interaction.options.getString("bug");
    let steps = interaction.options.getString("steps");
    let evidence = interaction.options.getString("evidence");
    let developerUserIds = ["725431849098412193"];

    for (var i = 0; i < developerUserIds.length; i++) {
      let foundUser = await interaction.guild.members.fetch(
        developerUserIds[i]
      );
      if (evidence === null) evidence = "N/A";

      let msgContent = `*Bug Reported Submitted by <@!${interaction.user.id}>*\n\n**Bug:**\n> ${bug}\n\n**Reproduction Steps:**\n> ${steps}\n\n**Evidence:**\n> ${evidence}`;
      await foundUser.send({ content: `${msgContent}` });
    }

    await interaction.reply({
      content: `Bug Submitted to Bot Developers`,
      ephemeral: true,
    });
  },
};