import { Client, GatewayIntentBits } from "discord.js";
import { Manager } from "erela.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ★ここにTCP Proxyの値を入れる
const manager = new Manager({
  nodes: [
    {
      host: "xxxxx.proxy.rlwy.net", // ← ★ここをあなたのTCP Proxyに変更
      port: 443,
      password: "youshallnotpass",
      secure: true
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// ログ
manager.on("nodeConnect", () => {
  console.log("✅ Lavalink接続成功");
});

manager.on("nodeError", (_, err) => {
  console.log("❌ Lavalink接続失敗", err);
});

// VC ID
const CHANNEL_ID = "1480661292879581194";

// ★Discord起動
client.once("ready", () => {
  console.log("Bot Ready");
  manager.init(client.user!.id);
});

// ★Lavalink接続後に処理
manager.on("nodeConnect", async () => {
  console.log("🎵 再生処理開始");

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("Guild取得失敗");
    return;
  }

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  player.connect();
  console.log("VC接続完了");

  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.tracks.length) {
    console.log("曲取得失敗");
    return;
  }

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("再生開始");
});

// ★これ必須
client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
