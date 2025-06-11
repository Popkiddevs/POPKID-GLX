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
      const imageUrl = "https://telegra.ph/file/e08c1803aa2e18d0de3d1.jpg"; // ✅ WORKING fallback image

      const caption = `
╭═〔 🧠 *POPKID-GLX REPOSITORY* 〕═╮

📁 *Bot Name:* POPKID-GLX  
🌐 *GitHub:* ${repoLink}  
🛠️ *Developer:* @255767862457  
⚙️ *Framework:* Baileys  
✨ *Fast, Clean & Reliable*

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
