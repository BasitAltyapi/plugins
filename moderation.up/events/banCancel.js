module.exports = new Underline.Event({
  eventName: "guildBanRemove",
  async onEvent(ban) {
    if (ban.user?.id) Underline.plugins.mongooseDatabase.getModel("MemberBanTimeout").deleteOne({ victimId: ban.user.id }).exec();
  }
});