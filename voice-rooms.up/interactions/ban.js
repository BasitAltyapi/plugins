module.exports = new Underline.ChatInput({
  name: ["ses", "yasakla"],
  description: "Ses kanalınızdan birini yasaklayın.",
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
    })
    await inter.deferReply();
    inter.editReply({
      content: `<@${bannedUser.id}> odanızdan başarıyla yasaklandı.`,
    });

    let createChannel = inter.member.voice?.channel;

    createChannel?.permissionOverwrites.create(bannedUser, { Connect: false }).catch(() => { });
    let bannedVoiceMember = createChannel.members.find(x => x.id == bannedUser.id);
    if (bannedVoiceMember) bannedVoiceMember.voice?.disconnect().catch(() => { });

  },
  options: [
    {
      name: "kişi",
      description: "Kanalınızdan yasaklanacak kişi",
      type: "User",
      required: true,
    }
  ],
  guildOnly: true,
  coolDown: 5000,
});