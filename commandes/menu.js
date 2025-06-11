const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");

const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const s = require(__dirname + "/../set");

const cyberDivider = "╬═╬═╬═╬═╬═╬═╬═╬═╬═╬";
const fancyEnd = "⟬⟭⟬⟭⟬⟭⟬⟭⟬⟭⟬⟭⟬⟭⟬⟭⟬⟭";

// Styled bot info
function getBotInfo(mode) {
  moment.tz.setDefault("EAT");
  const currentTime = moment().format("HH:mm:ss");
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `
╭═════[ 🤖 *POPKID-TECH BOT* ]═════╮

🧠 *Developer*: @254111385747
📡 *Mode*: ${mode.toUpperCase()}
⏰ *Time*: ${currentTime} (EAT)
💾 *RAM*: ${usedRAM} / ${totalRAM}

╰═════${cyberDivider}═════╯
`;
}

// Styled command menu
function buildMenu(coms, prefixe) {
  let menu = `
╔═[ ⚙️ *COMMAND MENU* ⚙️ ]═╗

💡 Use *${prefixe}menu <command>* for more info\n`;

  const categoryStyles = {
    General: { icon: "🌐" },
    Group: { icon: "👥" },
    Mods: { icon: "🛡️" },
    Fun: { icon: "🎉" },
    Search: { icon: "🔎" },
    Logo: { icon: "🎨" },
    Utilities: { icon: "🧰" },
    Adult: { icon: "🔞" },
    Download: { icon: "📥" },
  };

  for (const cat in coms) {
    const icon = categoryStyles[cat]?.icon || "✨";
    menu += `\n╭──── ${icon} *${cat.toUpperCase()}* ────╮\n`;

    coms[cat].forEach((cmd) => {
      menu += `│ ✦ ${prefixe}${cmd}\n`;
    });

    menu += `╰────────────────────╯\n`;
  }

  menu += `
👨‍💻 *Developers*:
➤ @254111385747 (Main Dev)
➤ @25473229794 (Popkid Team)

${fancyEnd}
`;

  return menu;
}

// Send media (image/video/gif fallback)
async function sendMenuMedia(zk, dest, ms, mediaUrl, caption, mentions) {
  if (mediaUrl.match(/\.(mp4|gif)$/i)) {
    await zk.sendMessage(
      dest,
      {
        video: { url: mediaUrl },
        caption,
        gifPlayback: true,
        footer: "⚡ POPKID-XBOT ⚡",
        mentions,
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

// Send stylish text with forwarded channel look
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
          newsletterName: "PopkidXtech",
          serverMessageId: 143,
        },
      },
    },
    { quoted: ms }
  );
}

// Send random hacker-style voice
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

// Main zokou command
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

      // Send stylish text as forwarded-from-channel
      await sendForwardedText(zk, dest, ms, finalText, ms.key.participant || ms.key.remoteJid);

      // Optional: Send audio as extra effect
      await sendRandomVoiceNote(zk, dest, ms, repondre);
    } catch (err) {
      console.error(`[DEBUG menu error]: ${err}`);
      repondre(`❌ Failed to load menu:\n${err.message}`);
    }
  }
);
