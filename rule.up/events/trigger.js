module.exports = new Underline.Event({
  eventName: "guildMemberUpdate",
  onEvent(oMember, nMember, other) {
    if (oMember.pending != nMember.pending) other.pluginApi.emit("onRuleAccept", nMember);
  }
});