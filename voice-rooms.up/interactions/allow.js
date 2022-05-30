module.exports = new Underline.ChatInput({
  name: ["ses", "izinle"],
  description: "Ses kanalınız için birine izin verin.",
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


    let bannedUser;
    try { bannedUser = inter.options.getUser("kişi"); } catch { };

    if (!bannedUser) return inter.reply({
      content: "Belirttiğiniz kişi geçerli bir kullanıcı değil",
      ephemeral: true,
    });
    await inter.deferReply();
    inter.editReply({
      content: `<@${bannedUser.id}> odanızda başarıyla izinlendi.`,
    });
    
    let createChannel = inter.member.voice?.channel

    createChannel?.permissionOverwrites.create(bannedUser, { Connect: true }).catch(() => { });

  },
  options: [
    {
      name: "kişi",
      description: "Kanalınızda izin verilecek kişi",
      type: "User",
      required: true,
    }
  ],
  guildOnly: true,
  coolDown: 5000,
});