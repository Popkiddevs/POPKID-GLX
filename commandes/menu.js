const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");

const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const s = require(__dirname + "/../set");

// Cyber-styled dividers
const topDivider = "▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃";
const categoryDivider = "━━━━━━━━━━━━━━";

function getBotInfo(mode) {
  moment.tz.setDefault("EAT");
  const currentTime = moment().format("HH:mm:ss");
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `
╭═〔 🚀 *POPKID-TECH BOT SYSTEM* 〕═╮
│
│ ⚙️ *Status:* ONLINE
│ 🔰 *Mode:* ${mode.toUpperCase()}
│ ⏱ *Time:* ${currentTime} (EAT)
│ 🧠 *Dev:* @254111385747
│ 🖥 *RAM:* ${usedRAM} / ${totalRAM}
│
╰═${topDivider}═╯
`;
}

function buildMenu(coms, prefixe) {
  let menu = `
🧾 *COMMAND INDEX*

🔎 Use: *${prefixe}help <command>* to get command info
${categoryDivider}
`;

  const categoryStyles = {
    General: "🌐",
    Group: "👥",
    Mods: "🛡️",
    Fun: "🎉",
    Search: "🔎",
    Logo: "🎨",
    Utilities: "🧰",
    Adult: "🔞",
    Download: "📥",
  };

  for (const cat in coms) {
    const icon = categoryStyles[cat] || "✨";
    menu += `\n${icon} *${cat.toUpperCase()}*\n`;

    coms[cat].forEach((cmd) => {
      menu += `┣ 🧩 *${prefixe}${cmd}*\n`;
    });

    menu += categoryDivider + "\n";
  }

  menu += `
👨‍💻 *DEVELOPERS*
 ┗ @254111385747 (Main Dev)
 ┗ @25473229794 (Popkid Team)

📡 Powered by *POPKID-GLX SYSTEM*
${topDivider}
`;

  return menu;
}

async function sendMenuMedia(zk, dest, ms, mediaUrl, caption, mentions) {
  if (mediaUrl.match(/\.(mp4|gif)$/i)) {
    await zk.sendMessage(
      dest,
      {
        video: { url: mediaUrl },
        caption,
        footer: "⚡ POPKID-XBOT ⚡",
        mentions,
        gifPlayback: true,
      },
      { quoted: ms }
    );
  } else if (mediaUrl.match(/\.(jpeg|jpg|png)$/i)) {
    await zk.sendMessage(
      dest,
      {
        image: { url: mediaUrl },
        caption,
        footer: "⚡ POPKID-XBOT ⚡",
        mentions,
      },
      { quoted: ms }
    );
  } else {
    await zk.sendMessage(
      dest,
      {
        text: caption,
        mentions,
      },
      { quoted: ms }
    );
  }
}

async function sendForwardedText(zk, dest, ms, text, sender) {
  await zk.sendMessage(
    dest,
    {
      text,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363290715861418@newsletter",
          newsletterName: "PopkidGlx",
          serverMessageId: 143,
        },
      },
    },
    { quoted: ms }
  );
}

async function sendRandomVoiceNote(zk, dest, ms, repondre) {
  const folder = path.join(__dirname, "../popkidd/");
  if (!fs.existsSync(folder)) {
    return repondre(`📁 Audio folder not found at:\n${folder}`);
  }

  const audioFiles = fs.readdirSync(folder).filter((f) => f.endsWith(".mp3"));
  if (!audioFiles.length) {
    return repondre(`⚠️ No audio files found in folder.`);
  }

  const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  const audioPath = path.join(folder, randomAudio);

  await zk.sendMessage(
    dest,
    {
      audio: { url: audioPath },
      mimetype: "audio/mpeg",
      ptt: true,
      fileName: `🗣 POPKID VOICE`,
    },
    { quoted: ms }
  );
}

zokou(
  {
    nomCom: "menu",
    categorie: "General",
    reaction: "⚡",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou");

    let coms = {};
    let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

    for (const com of cm) {
      if (!coms[com.categorie]) coms[com.categorie] = [];
      coms[com.categorie].push(com.nomCom);
    }

    try {
      const lien = await mybotpic();
      const infoText = getBotInfo(mode);
      const menuText = buildMenu(coms, prefixe);
      const finalText = infoText + menuText;
      const sender = ms.key.participant || ms.key.remoteJid;

      await sendForwardedText(zk, dest, ms, finalText, sender);
      await sendRandomVoiceNote(zk, dest, ms, repondre);
    } catch (err) {
      console.error(`[DEBUG menu error]: ${err}`);
      repondre(`❌ Failed to load menu:\n${err.message}`);
    }
  }
);
