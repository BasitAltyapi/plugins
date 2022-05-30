let spamMap = new Map();

module.exports = new Underline.Event({
  eventName: "messageCreate",
  async onEvent(msg) {
    if (!msg.author) return;
    if (!msg.guild) return;
    if (msg.author.bot) return;
    if (msg.member.permissions.has("Administrator")) return;
    if (Underline.config.other.spamChannels.includes(msg.channelId)) return;
    let spamData = (spamMap.get(msg.author.id) + 1) || 1;
    setTimeout(() => spamMap.set(msg.author.id, (spamMap.get(msg.author.id) || 1) - 1), 3000);
    if (spamData >= 4) msg.delete?.().catch(() => {});
  }
});
setInterval(() => { spamMap.clear(); }, 1000 * 60 * 60 * 8);