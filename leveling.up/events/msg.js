module.exports = new Underline.Event({
  eventName: "messageCreate",
  async onEvent(msg) {
    if (!msg.author) return;
    if (!msg.guild) return;
    if (msg.author.bot) return;
    Underline.plugins.level.addXp(msg.member, Math.floor(Math.random() * 10) + 15)
  }
});