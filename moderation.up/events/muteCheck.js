module.exports = new Underline.Event({
  eventName: "guildMemberAdd",
  async onEvent(member) {
    let timeOutData = await Underline.plugins.mongooseDatabase.getModel("MemberMuteTimeout").findOne({ victimId: member.user.id, lastDate: { $gte: Date.now() } }).exec();
    if (timeOutData) {
      member.timeout(timeOutData - Date.now(), "Çık Gir.").catch(() => {});
    }
  }
});