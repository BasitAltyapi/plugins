

module.exports = new Underline.Plugin({
  name: "moderation",
  namespace: "moderation",
  version: "v0.0.1",
  requires: {
    plugins: ["mongooseDatabase"]
  },
  implements: {
    events: {
      onRuleAccept: "member: import(\"discord.js\").GuildMember",
    },
    properties: {}
  },
  onLoad(api) {
    Underline.plugins.mongooseDatabase.addModel("MemberBanTimeout", new Underline.plugins.mongooseDatabase.Schema({
      victimId: { type: String, required: true },
      lastDate: { type: Number, required: true },
      startDate: { type: Number, default: Date.now },
    }));
    Underline.plugins.mongooseDatabase.addModel("MemberMuteTimeout", new Underline.plugins.mongooseDatabase.Schema({
      victimId: { type: String, required: true },
      lastDate: { type: Number, required: true },
      startDate: { type: Number, default: Date.now },
    }));
    api.setPluginReady();
  }
})