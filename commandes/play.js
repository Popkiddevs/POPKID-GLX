const { zokou } = require(__dirname + "/../framework/zokou");
const ytsearch = require("yt-search");
const fetch = require("node-fetch");

zokou(
  {
    nomCom: "play",
    categorie: "Download",
    reaction: "🎵",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    const query = arg.join(" ");

    try {
      if (!query) return repondre("🎶 Please provide a song name or YouTube link.");

      const yt = await ytsearch(query);
      if (!yt.videos.length) return repondre("🔍 No results found!");

      const song = yt.videos[0];
      const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

      const response = await fetch(apiUrl);
      const songRes = await response.json();

      if (!songRes?.result?.downloadUrl) return repondre("❌ Download failed. Try again later.");

      await zk.sendMessage(
        dest,
        {
          audio: { url: songRes.result.downloadUrl },
          mimetype: "audio/mpeg",
          fileName: `${song.title}.mp3`,
          contextInfo: {
            externalAdReply: {
              title: song.title.length > 25 ? song.title.substring(0, 22) + "..." : song.title,
              body: `📤 Uploaded by ${song.author.name}`,
              thumbnailUrl: song.thumbnail.replace("default.jpg", "hqdefault.jpg"),
              sourceUrl: "https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l",
              mediaUrl: "https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l",
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: true,
            },
          },
        },
        { quoted: ms }
      );
    } catch (error) {
      console.error("Error in play command:", error);
      repondre("❌ An error occurred. Please try again.");
    }
  }
);
