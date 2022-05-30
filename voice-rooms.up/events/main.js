const { Collection, ChannelType } = require("discord.js");

// globalThis.Underline.plugins.voiceRoom.rooms = new Collection();


module.exports = new Underline.Event({
  eventName: "voiceStateUpdate",
  async onEvent(oVc, nVc) {

    if (oVc.channelId == nVc.channelId) return;
    if (oVc.member?.user?.bot) return;

    if (nVc.channelId == Underline.config.other.mainRoomChannel) {
      let owner = nVc.member?.user || oVc.member?.user
      let owneredChannel = Underline.plugins.voiceRoom.rooms.find(x => x.ownerId == owner.id)
      if (owneredChannel) {
        nVc.setChannel(owneredChannel.channelId).catch(() => { });
        return;
      }

      let chData = (await Underline.plugins.mongooseDatabase.getModel("VcData").findOne({ userId: owner.id }).exec()) || {};
      let chName = chData.name || `🚀 | ${(nVc.member.nickname || nVc.member.user.username).slice(0, 30)}`;
      /** @type {import("discord.js").BaseGuildVoiceChannel} */
      let createChannel = nVc.client.channels.cache.get(Underline.config.other.mainRoomChannel);
      let chOptionData = {
        parent: createChannel.parentId,
        type: ChannelType.GuildVoice
      };
      if (chData.limit > 0) chOptionData.userLimit = chData.limit;
      let createdChannel = await nVc.guild.channels.create(chName, chOptionData).catch(console.error);
      if (!createdChannel) return;
      Underline.plugins.voiceRoom.rooms.set(createdChannel.id, { ownerId: owner.id, channelId: createdChannel.id })
      await createdChannel.permissionOverwrites.create(nVc.member, { ViewChannel: true, ManageChannels: true, Connect: true, MoveMembers: true }).catch(() => { });
      if (chData.lock) await createdChannel.permissionOverwrites.edit(nVc.guild.roles.everyone, { Connect: false }).catch(() => { });
      nVc?.setChannel?.(createdChannel).catch(() => {
        createdChannel.delete?.().catch(() => { });
        Underline.plugins.voiceRoom.rooms.delete?.(createdChannel.id);
      });
    }

    if (oVc.channel && Underline.plugins.voiceRoom.rooms.has(oVc.channelId) && oVc.channel.members.filter(x => !x.user.bot).size == 0) {
      Underline.plugins.voiceRoom.rooms.delete(oVc.channelId);
      oVc.channel.delete?.()?.catch?.(() => { });
    }



  }
});

setInterval(() => {

  Underline.plugins.voiceRoom.rooms.forEach(channelData => {

    let channel = Underline.client.channels.cache.get(channelData.channelId);
    if (!channel) return Underline.plugins.voiceRoom.rooms.delete(channelData.channelId);
    if (channel.members.size == 0) {
      Underline.plugins.voiceRoom.rooms.delete(channelData.channelId);
      channel.delete?.().catch(() => { });
    }

  })

}, 1000 * 60);