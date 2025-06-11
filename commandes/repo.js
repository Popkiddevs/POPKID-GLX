const { zokou } = require(__dirname + "/../framework/zokou");

zokou(
  {
    nomCom: "repo",
    categorie: "General",
    reaction: "📦",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    try {
      const repoLink = "https://github.com/Popkiddevs/POPKID-GLX";
      const imageUrl = "https://telegra.ph/file/89c35b8df3a1a5c60f305.jpg"; // 👈 Replace this with your custom image if needed

      const caption = `
╭═〔 🧠 *POPKID-GLX REPOSITORY* 〕═╮

📁 *Bot Name:* POPKID-GLX
🌐 *GitHub:* [Click Here](${repoLink})
🛠️ *Developer:* @255767862457
🧰 *Type:* WhatsApp Multi-device Bot
⚙️ *Framework:* Baileys

🪄 Power your chat with style, speed & security.

╰═▃▃▃▃▃▃▃▃▃▃▃▃▃═╯
`;

      const sender = ms.key.participant || ms.key.remoteJid;

      await zk.sendMessage(
        dest,
        {
          image: { url: imageUrl },
          caption,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363290715861418@newsletter",
              newsletterName: "PopkidXtech",
              serverMessageId: 152,
            },
          },
        },
        { quoted: ms }
      );
    } catch (e) {
      console.error("Error in repo command:", e);
      repondre(`❌ Failed to load repo:\n${e.message}`);
    }
  }
);
