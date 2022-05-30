module.exports = new Underline.ChatInput({
  name: ["ses", "kilitle"],
  description: "Ses kanalınızın kilidini değiştirin.",
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


    let locked = inter.options.getBoolean("kilit");
    inter.reply({
      content: locked ? "Odanız başarıyla kilitlendi." : "Odanızın kilidi başarıyla açıldı.",
    });
    let createChannel = inter.member.voice?.channel
    Underline.plugins.mongooseDatabase.getModel("VcData").updateOne({ userId: inter.user.id }, { lock: locked }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();

    if (locked) {
      createChannel.permissionOverwrites.edit(inter.guild.roles.everyone, { Connect: false }).catch(() => { });
    } else {
      createChannel.permissionOverwrites.edit(inter.guild.roles.everyone, { Connect: true }).catch(() => { });
    }
  },
  options: [
    {
      name: "kilit",
      description: "Kanalınızın kilit durumu",
      type: "Boolean",
      required: true,
    }
  ],
  guildOnly: true,
  coolDown: 5000,
});