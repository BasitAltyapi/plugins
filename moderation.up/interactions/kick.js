const { EmbedBuilder } = require("discord.js");

module.exports = new Underline.ChatInput({
  name: ["kick"],
  description: "Birini at.",
  async onInteraction(inter, other) {
    let reason = inter.options.getString("sebep") || "Sebep belirtilmedi.";
    let userId = inter.options.data.find(x => x.name === "kişi").value;
    await inter.deferReply({
      ephemeral: true
    });
    let member = await inter.guild.members.fetch(userId ?? "0").catch(() => { });
    if (member) {

      if ((member.roles.highest.rawPosition >= inter.member.roles.highest.rawPosition || member.id == inter.guild.ownerId) && (inter.user.id != inter.guild.ownerId)) return inter.editReply({
        content: "Belirttiğiniz kişi sizden yüksek veya aynı yetkide.",
      });

      if ((member.roles.highest.rawPosition >= inter.guild.me.roles.highest.rawPosition || member.id == inter.guild.ownerId)) return inter.editReply({
        content: "Belirttiğiniz kişi benden yüksek veya aynı yetkide.",
      });
      
      if (!inter.guild.me.permissions.has("KickMembers")) return inter.editReply({
        content: "Kick atma yetkim yok.",
        ephemeral: true,
      });
  
  
        try {
          await (async () => {
            let targetUser = await inter.client.users.fetch(userId ?? "0");
            let dm = await targetUser.createDM();
            await dm.send({
              content: `Sunucumuzdan atıldınız.\nSebep: \`${reason}\``
            });
          })().catch(() => { });
        } catch {}
  
      inter.editReply({
        content: `<@${userId}> başarıyla atıldı.`,
      });
  
      member.kick(`${inter.user.tag}: ${reason}`).catch(() => { });

      //#region log
      // let embed = new EmbedBuilder()
      //   .setTitle("Atılma!")
      //   .setDescription(`<@${inter.user.id}> adlı yetkili, <@${userId}> kullanıcıyı \`${reason}\` sebebiyle attı.`)
      //   .setColor("DarkRed");

      // Underline.client.channels.cache.get("936802331478065182")?.send({
      //   embeds: [embed],
      // }).catch(() => { });
      //#endregion
    } else inter.editReply({
      content: `<@${userId}> adlı üye sunucumuzda bulunmamaktadır`,
    });


  },
  options: [
    {
      name: "kişi",
      description: "Atılacak kişi.",
      type: "User",
      required: true,
    },
    {
      name: "sebep",
      description: "Sebep",
      type: "String",
      required: false,
    }
  ],
  guildOnly: true
});