const { EmbedBuilder, ButtonBuilder } = require("discord.js");

module.exports = new Underline.ChatInput({
  name: ["ban"],
  description: "Birini banla.",
  async onInteraction(inter, other) {
    await inter.deferReply({
      ephemeral: true
    });
    let reason = inter.options.getString("sebep") || "Sebep belirtilmedi.";
    let userId = inter.options.data.find(x => x.name === "kişi").value;

    let member = await inter.guild.members.fetch(userId ?? "0").catch(() => { });
    //#region time
    /** @type {String} */
    let timeString = inter.options.getString("süre")?.trim();
    let lastDate = 0;
    if (timeString) {
      let time = 0;

      timeString.match(/[0-9]+(mo|m|h|y|s|w|d)/g)?.forEach((matched) => {
        let timeCoefficientSource = matched.match(/(mo|m|h|y|s|w|d)/)?.shift();
        if (!timeCoefficientSource) return;
        let baseTime = Number(matched.match(/[0-9]+/)?.shift());
        if (!baseTime) return;
        switch (timeCoefficientSource) {

          case "mo": {
            time += baseTime * 1000 * 60 * 60 * 24 * 30;
            break;
          }
          case "d": {
            time += baseTime * 1000 * 60 * 60 * 24;
            break;
          }
          case "w": {
            time += baseTime * 1000 * 60 * 60 * 24 * 7;
            break;
          }
          case "s": {
            time += baseTime * 1000;
            break;
          }
          case "y": {
            time += baseTime * 1000 * 60 * 60 * 24 * 365;
            break;
          }
          case "h": {
            time += baseTime * 1000 * 60 * 60;
            break;
          }
          case "m": {
            time += baseTime * 1000 * 60;
            break;
          }
        }
      });
      if (time > 0) lastDate = Date.now() + time;
    };
    //#endregion
    if (member) {

      if ((member.roles.highest.rawPosition >= inter.member.roles.highest.rawPosition || member.id == inter.guild.ownerId) && (inter.user.id != inter.guild.ownerId)) return inter.editReply({
        content: "Belirttiğiniz kişi sizden yüksek veya aynı yetkide.",
      });

      if ((member.roles.highest.rawPosition >= inter.guild.me.roles.highest.rawPosition || member.id == inter.guild.ownerId)) return inter.editReply({
        content: "Belirttiğiniz kişi benden yüksek veya aynı yetkide.",
      });

    }

    if (!inter.guild.me.permissions.has("BanMembers")) return inter.editReply({
      content: "Ban atma yetkim yok.",
      ephemeral: true,
    });


    try {
      await (async () => {
        let targetUser = await inter.client.users.fetch(userId ?? "0");
        let dm = await targetUser.createDM();
        await dm.send({
          content: `Sunucumuzdan yasaklandınız.\nSebep: \`${reason}\`${lastDate > 0 ? `\nBitiş: <t:${Math.floor(lastDate / 1000)}:R>` : ""}`,
        });
      })().catch(() => {});
    } catch { }

    inter.editReply({
      content: `<@${userId}> başarıyla yasaklandı.`,
    });
    
    inter.guild.bans.create(userId, { reason: `${inter.user.tag}: ${reason}`, deleteMessageDays: 1 }).then(() => {
      if (lastDate > 0) Underline.plugins.mongooseDatabase.getModel("MemberBanTimeout").updateOne({ victimId: userId }, { lastDate }, { upsert: true, setDefaultsOnInsert: true, new: true }).exec();
    }).catch(() => { });

  },
  options: [
    {
      name: "kişi",
      description: "Banlanacak kişi.",
      type: "User",
      required: true,
    },
    {
      name: "sebep",
      description: "Sebep",
      type: "String",
      required: false,
    },
    {
      name: "süre",
      description: "Süre (5m => 5 dakika, 3mo => 3 ay vb.)",
      type: "String",
      required: false,
    }
  ],
  guildOnly: true,
  onLoad(client) {
    setInterval(async () => {
      let banDb = Underline.plugins.mongooseDatabase.getModel("MemberBanTimeout");
      let finishedList = await banDb.find({ lastDate: { $lte: Date.now() } }).exec();
      for (let i = 0; i < finishedList.length; i++) {

        let userDb = finishedList[i];
        let userId = userDb.victimId;

        let guild = Underline.client.guilds.cache.get(Underline.config.other.guildId);

        guild.bans.remove(userId).catch(() => { });

        banDb.deleteOne({ victimId: userId }).exec();
      }
    }, 1000 * 60 * 1);
  }
});