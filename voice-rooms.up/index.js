const { Collection } = require("discord.js");


module.exports = new Underline.Plugin({
  name: "voice-room",
  namespace: "voiceRoom",
  version: "v0.0.1",
  requires: {
    plugins: ["mongooseDatabase"]
  },
  implements: {
    events: {},
    properties: {
      rooms: "import(\"discord.js\").Collection<string, { ownerId: string, channelId: string }>",
    }
  },
  onLoad(api) {
    api.define("rooms", new Collection());
    Underline.plugins.mongooseDatabase.addModel("VcData", new Underline.plugins.mongooseDatabase.Schema({
      userId: { type: String, required: true, index: true },
      name: { type: String },
      limit: { type: Number },
      lock: { type: Boolean, default: false },
    }))
    api.setPluginReady();
  }
})