const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check to see if the bot is online."),
  async execute(interaction, client) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
      ephemeral: true,
    });

    const fetched = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(
        `Roundtrip latency: ${
          sent.createdTimestamp - interaction.createdTimestamp
        } ms\nAPI Latency: ${Math.round(client.ws.ping)} ms`
      )
      .setColor(0x0099ff)
      .setFooter({ text: "Mano County Automation", iconURL: process.env.image })
      .setTimestamp();

    await interaction.editReply({
      embeds: [fetched],
      ephemeral: true,
      content: "",
    });
  },
};