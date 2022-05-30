const { Collection } = require("discord.js");


module.exports = new Underline.Plugin({
  name: "Leveling",
  namespace: "level",
  version: "v0.0.1",
  requires: {
    plugins: ["mongooseDatabase"]
  },
  implements: {
    events: {
      onLevelUp: "member: import('discord.js').GuildMember, oldLevel: number, newLevel: number"
    },
    properties: {
      addXp: "(member: import('discord.js').GuildMember, xp: number) => Promise<{ userId: string, xp: number }>",
      setXp: "(member: import('discord.js').GuildMember, xp: number) => Promise<{ userId: string, xp: number }>",
      getData: "(member: import('discord.js').GuildMember) => Promise<{ xp: number, level: number, nextLevel: number, needXp: number, nextLevelXp: number, currentLevelXp: number }>",
    }
  },
  onLoad(api) {

    Underline.plugins.mongooseDatabase.addModel("XpData", new Underline.plugins.mongooseDatabase.Schema({
      userId: { type: String, required: true, index: true },
      xp: { type: Number, default: 0 },
    }));

    function getLevel(xp) {
      return Math.floor(0.1 * Math.sqrt(xp))
    }

    function getXp(lvl) {
      return lvl * lvl * 100;
    }


    async function addXp(member, xp) {
      let data = await Underline.plugins.mongooseDatabase.getModel("XpData").findOneAndUpdate({ userId: member.user?.id || member.id }, { $inc: { xp } }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();
      let newXp = data.xp;
      let oldXp = newXp - xp;
      let oldLevel = getLevel(oldXp);
      let newLevel = getLevel(newXp);
      if (oldLevel != newLevel) api.emit("onLevelUp", member, oldLevel, newLevel);
      return data;
    }

    async function setXp(member, xp) {
      let data = await Underline.plugins.mongooseDatabase.getModel("XpData").findOneAndUpdate({ userId: member.user?.id || member.id }, { xp }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();
      return data;
    }
    async function parseData(data) {
      let level = getLevel(data.xp);
      return { xp: data.xp, level, nextLevel: level + 1, needXp: getXp(level + 1) - data.xp, nextLevelXp: getXp(level + 1), currentLevelXp: getXp(level) }
    }
    async function getData(member) {
      let data = parseData((await Underline.plugins.mongooseDatabase.getModel("XpData").findOne({ userId: member.user?.id || member.id }).exec()) || { xp: 0, userId: member.user.id || member.id });
      return data;
    }
    api.define("addXp", addXp);
    api.define("setXp", setXp);
    api.define("getData", getData);

    api.setPluginReady();
  }
})