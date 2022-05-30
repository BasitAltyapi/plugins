module.exports = new Underline.Plugin({
  name: "Vault",
  namespace: "vault",
  version: "v0.0.1",
  requires: {
    plugins: ["mongooseDatabase"]
  },
  implements: {
    events: {},
    properties: {
      incCash: "(member: import('discord.js').GuildMember, cash: number) => Promise<{ userId: string, cash: number }>",
      setCash: "(member: import('discord.js').GuildMember, cash: number) => Promise<{ userId: string, cash: number }>",
      getCash: "(member: import('discord.js').GuildMember) => Promise<{ userId: string, cash: number }>",
    }
  },
  onLoad(api) {

    Underline.plugins.mongooseDatabase.addModel("Vault", new Underline.plugins.mongooseDatabase.Schema({
      userId: { type: String, required: true, index: true },
      cash: { type: Number, default: 0 },
    }));

    async function incCash(member, cash) {
      let data = await Underline.plugins.mongooseDatabase.getModel("Vault").findOneAndUpdate({ userId: member.user?.id || member.id }, { $inc: { cash } }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();
      return data;
    }

    async function setCash(member, cash) {
      let data = await Underline.plugins.mongooseDatabase.getModel("Vault").findOneAndUpdate({ userId: member.user?.id || member.id }, { cash }, { setDefaultsOnInsert: true, new: true, upsert: true }).exec();
      return data;
    }

    async function getCash(member) {
      let data = await Underline.plugins.mongooseDatabase.getModel("Vault").findOne({ userId: member.user?.id || member.id }).exec();
      return data;
    }

    api.define("incCash", incCash);
    api.define("setCash", setCash);
    api.define("getCash", getCash);

    api.setPluginReady();
  }
})