const os = require("os");
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");

zokou(
  {
    nomCom: "uptime",
    categorie: "General",
    reaction: "⏳",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    try {
      const uptime = process.uptime(); // in seconds
      const usedRAM = format(os.totalmem() - os.freemem());
      const totalRAM = format(os.totalmem());
      moment.tz.setDefault("EAT");
      const now = moment().format("dddd, HH:mm:ss");

      const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}h ${m}m ${s}s`;
      };

      const uptimeText = `
╭═〔 🧭 *POPKID BOT UPTIME REPORT* 〕═╮
│
│ 🔋 *Online Since:* ${formatTime(uptime)}
│ ⏰ *Current Time:* ${now} (EAT)
│ 💾 *RAM Used:* ${usedRAM} / ${totalRAM}
│ 👨‍💻 *Dev:* @254111385747
│
╰════════════════════════╯
`;

      const sender = ms.key.participant || ms.key.remoteJid;

      await zk.sendMessage(
        dest,
        {
          text: uptimeText,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363290715861418@newsletter",
              newsletterName: "PopkidXtech",
              serverMessageId: 147,
            },
          },
        },
        { quoted: ms }
      );
    } catch (err) {
      console.error("Error in uptime command:", err);
      repondre(`❌ Failed to get uptime:\n${err.message}`);
    }
  }
);
