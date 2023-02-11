const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("View the bots privacy policy."),
  async execute(interaction, client) {

    const fetched = new EmbedBuilder()
      .setTitle("Privacy Policy")
      .setDescription(
        `You can view the bots privacy policy [here](https://gist.github.com/yeeterboii14/253618c38546460b70a768b2d78a640f).`
      )
      .setColor(0x0099ff)
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    await interaction.reply({
      embeds: [fetched],
      ephemeral: true,
      content: "",
    });
  },
};