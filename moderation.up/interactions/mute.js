const { EmbedBuilder, ButtonBuilder } = require("discord.js");

module.exports = new Underline.ChatInput({
  name: ["mute"],
  description: "Birini sustur.",
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
    let time = 0;
    if (timeString) {
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

      if (time == 0) return inter.editReply({
        content: `Geçerli bir zaman girin lütfen.`
      }).catch(() => {});

      if ((member.roles.highest.rawPosition >= inter.member.roles.highest.rawPosition || member.id == inter.guild.ownerId) && (inter.user.id != inter.guild.ownerId)) return inter.editReply({
        content: "Belirttiğiniz kişi sizden yüksek veya aynı yetkide.",
      });

      if ((member.roles.highest.rawPosition >= inter.guild.me.roles.highest.rawPosition || member.id == inter.guild.ownerId)) return inter.editReply({
        content: "Belirttiğiniz kişi benden yüksek veya aynı yetkide.",
      });

      try {
        await (async () => {
          let targetUser = await inter.client.users.fetch(userId ?? "0");
          let dm = await targetUser.createDM();
          await dm.send({
            content: `Sunucumuzdan susturuldunuz.\nSebep: \`${reason}\`${lastDate > 0 ? `\nBitiş: <t:${Math.floor(lastDate / 1000)}:R>` : ""}`,
          });
        })().catch(() => { });
      } catch { }

      inter.editReply({
        content: `<@${userId}> başarıyla yasaklandı.`,
      });

      member.timeout(time, reason).then(() => {
        if (lastDate > 0) Underline.plugins.mongooseDatabase.getModel("MemberMuteTimeout").updateOne({ victimId: userId }, { lastDate }, { upsert: true, setDefaultsOnInsert: true, new: true }).exec();
      }).catch(() => { });

    } else inter.editReply({
      content: `<@${userId}> adlı üye sunucumuzda bulunmamaktadır.`,
    }).catch(() => {});
  },
  options: [
    {
      name: "kişi",
      description: "Susturulacak kişi.",
      type: "User",
      required: true,
    },
    {
      name: "süre",
      description: "Süre (5m => 5 dakika, 3mo => 3 ay vb.)",
      type: "String",
      required: true,
    },
    {
      name: "sebep",
      description: "Sebep",
      type: "String",
      required: false,
    },
  ],
  guildOnly: true,
  perms: {
    bot: ["ModerateMembers"],
  }
});