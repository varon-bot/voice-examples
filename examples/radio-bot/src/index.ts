import { Client, GatewayIntentBits } from "discord.js";
import { Manager } from "erela.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const manager = new Manager({
  nodes: [
    {
      // 🔴 ここだけ自分の値に変更
      host: "viaduct.proxy.rlwy.net",
      port: 12345, // ← 必ず数字
      password: "youshallnotpass",
      secure: true
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// Lavalink接続成功時
manager.on("nodeConnect", () => {
  console.log("✅ Lavalink接続成功");
  startPlayer();
});

// Lavalink接続失敗
manager.on("nodeError", (_, err) => {
  console.log("❌ Lavalink接続失敗", err);
});

async function startPlayer() {
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("❌ Guild取得失敗");
    return;
  }

  const CHANNEL_ID = "1480661292879581194";

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  player.connect();
  console.log("🔊 VC接続開始");

  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.tracks.length) {
    console.log("❌ 曲取得失敗");
    return;
  }

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("🎵 再生開始");
}

client.once("ready", () => {
  console.log("🤖 Bot Ready");
  manager.init(client.user!.id);
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
