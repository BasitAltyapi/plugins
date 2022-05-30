let textMap = {
  hug: "$1 $2'ye sarıldı.",
  kiss: "$1 $2'yi öptü.",
  slap: "$1 $2'ye tokat attı.",
  wink: "$1 $2'ye bakıyor.",
  pat: "$1 $2'yi okşadı.",
  kill: "$1 $2'yi öldürdü.",
  cuddle: "$1 $2'yi kucakladı.",
  waifu: "$1 $2'ye anime kızı dedi.",
}

module.exports = new Underline.ChatInput({
  name: ["tepki"],
  description: "...",
  options: [
    {
      name: "tepki",
      type: "String",
      required: true,
      description: "Verilecek tepki",
      choices: [
        {
          name: "Sarıl",
          value: "hug"
        },
        {
          name: "Öp",
          value: "kiss"
        },
        {
          name: "Tokatla",
          value: "slap"
        },
        {
          name: "Yumrukla",
          value: "punch"
        },
        {
          name: "Göz Kırp",
          value: "wink"
        },
        {
          name: "Kafasını Okşa",
          value: "pat"
        },
        {
          name: "Öldür",
          value: "kill"
        },
        {
          name: "Kucaklamak",
          value: "cuddle"
        },
        {
          name: "Anime Kızı",
          value: "waifu"
        },
      ]
    }
  ],
  async onInteraction(interaction, other) {
    let tepki = interaction.options.getString("tepki");
    interaction.reply({
      content: textMap[tepki],
      embeds: [
        {
          color: "Random",
          image: {
            url: await Underline.plugins.animeImg.api.sfw[tepki](),
          }
        }
      ]
    })
  },
});