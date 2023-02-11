const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Responds with how long the bot has been up."),
  async execute(interaction, client) {
    let time = ms(client.uptime, { long: true });

    const fetched = new EmbedBuilder()
      .setTitle("Uptime")
      .setDescription(`I have been online for ${time}.`)
      .setColor(0x0099ff)
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    await interaction.reply({ embeds: [fetched], ephemeral: true });
  },
};