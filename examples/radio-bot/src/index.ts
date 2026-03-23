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
      // 🔴 ここを書き換える（TCP Proxyの値）
      host: "viaduct.proxy.rlwy.net",
      port: 12345,
      password: "youshallnotpass",
      secure: true
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// ✅ Lavalinkログ
manager.on("nodeConnect", () => {
  console.log("✅ Lavalink接続成功");
});

manager.on("nodeError", (_, err) => {
  console.log("❌ Lavalink接続失敗", err);
});

// 🔴 VCのチャンネルID（そのままでOK）
const CHANNEL_ID = "1480661292879581194";

client.once("ready", async () => {
  console.log("🤖 Bot Ready");

  // Lavalink初期化
  manager.init(client.user!.id);

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("❌ Guild取得失敗");
    return;
  }

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  // 🔥 接続
  player.connect();
  console.log("🔊 VC接続処理開始");

  // 🔥 曲検索
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
});

// Discord Voice用（必須）
client.on("raw", (d) => manager.updateVoiceState(d));

// 起動
client.login(process.env.DISCORD_TOKEN);
