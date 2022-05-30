

module.exports = new Underline.Plugin({
  name: "joinRuleRole",
  namespace: "joinRuleRole",
  version: "v0.0.1",
  requires: {},
  implements: {
    events: {
      onRuleAccept: "member: import(\"discord.js\").GuildMember",
    },
    properties: {}
  },
  onLoad(api) {
    api.setPluginReady();
  }
})