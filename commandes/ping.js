const os = require("os");
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");

zokou(
  {
    nomCom: "ping",
    categorie: "General",
    reaction: "🏓",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    try {
      const start = Date.now();
      const usedRAM = format(os.totalmem() - os.freemem());
      const totalRAM = format(os.totalmem());
      const uptime = process.uptime(); // in seconds

      moment.tz.setDefault("EAT");
      const time = moment().format("HH:mm:ss");

      const formattedUptime = () => {
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        return `${h}h ${m}m ${s}s`;
      };

      const end = Date.now();
      const pingTime = end - start;

      const responseText = `
╭═〔 🛰 *SYSTEM PING STATUS* 〕═╮
│
│ 📡 *Ping:* ${pingTime}ms
│ 🕰️ *Time:* ${time} (EAT)
│ ⚡ *Uptime:* ${formattedUptime()}
│ 🧠 *RAM:* ${usedRAM} / ${totalRAM}
│ 👨‍💻 *Dev:* @254111385747
│
╰═▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃═╯
`;

      const sender = ms.key.participant || ms.key.remoteJid;

      await zk.sendMessage(
        dest,
        {
          text: responseText,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363290715861418@newsletter",
              newsletterName: "PopkidXtech",
              serverMessageId: 145,
            },
          },
        },
        { quoted: ms }
      );
    } catch (e) {
      console.error("Error in ping command:", e);
      repondre(`An error occurred: ${e.message}`);
    }
  }
);
