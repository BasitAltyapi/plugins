module.exports = new Underline.ChatInput({
  name: ["ses", "isim"],
  description: "Ses kanalınızın adını değiştirin.",
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
    let name = inter.options.getString("isim");
    await inter.reply({
      content: `Odanın ismi başarıyla \`${name.slice(0, 50)}\` olarak değiştirildi.`,
    })
    inter.member.voice?.channel?.setName(name.slice(0, 50)).catch(() => { });
    Underline.plugins.mongooseDatabase.getModel("VcData").updateOne({ userId: inter.user.id }, { name }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();
  },
  options: [
    {
      name: "isim",
      description: "Kanalınızın yeni ismi",
      type: "String",
      required: true,
    }
  ],
  guildOnly: true,
  coolDown: 5000,
});