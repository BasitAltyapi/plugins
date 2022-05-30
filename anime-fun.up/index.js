

module.exports = new Underline.Plugin({
  name: "animeImg",
  namespace: "animeImg",
  version: "v0.0.1",
  requires: {
    modules: {
      "anime-images-api": "2.0.0",
    }
  },
  implements: {
    properties: {
      api: "{ sfw: { hug: () => Promise<string>,kiss: () => Promise<string>,slap: () => Promise<string>,punch: () => Promise<string>,wink: () => Promise<string>,pat: () => Promise<string>,kill: () => Promise<string>,cuddle: () => Promise<string>,waifu: () => Promise<string> }, nsfw: { hentai: () => Promise<string>,boobs: () => Promise<string>,lesbian: () => Promise<string> } }",
    }
  },
  onLoad(api) {
    
    let pApi = new (require("anime-images-api"))();
    api.define("api", pApi);
    
    api.setPluginReady();
  }
})