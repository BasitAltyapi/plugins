module.exports = new Underline.ChatInput({
  name: ["ses", "sınır"],
  description: "Ses kanalınızın sınırını değiştirin.",
  async onInteraction(inter, other) {
    let channelId = inter.member.voice?.channel?.id;
    if (!channelId) return inter.reply({
      content: "Mevcut bir ses kanalında bulunmuyorsun.",
      ephemeral: true,
    }).catch(() => { });

    let privChData = privateCreatedChannels.get(channelId);

    if (!privChData) return inter.reply({
      content: "Geçici bir odada bulunmuyorsunuz.",
      ephemeral: true,
    });

    if (privChData.ownerId != inter.user.id) return inter.reply({
      content: "Bu odanın sahibi siz değilsiniz.",
      ephemeral: true,
    });
    
    
    let limit = inter.options.getInteger("sınır");
    if (limit > 99 || limit < 0) return inter.reply({
      content: "Geçersiz limit girdiniz lütfen 0 ve 99 arasında bir limit giriniz.",
      ephemeral: true,
    });
    inter.reply({
      content: `Odanızın sınırı başarıyla ${limit} yapıldı.`,
    });
    inter.member.voice?.channel?.setUserLimit(limit).catch(() => { });
    Underline.plugins.mongooseDatabase.getModel("VcData").updateOne({ userId: inter.user.id }, { limit }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();
  },
  options: [
    {
      name: "sınır",
      description: "Kanalınızın yeni sınırı (0 = sınırsız)",
      type: "Integer",
      required: true,
    }
  ],
  guildOnly: true,
  coolDown: 5000,
});