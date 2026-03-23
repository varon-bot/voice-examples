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
      host: "lavalink", // ← ★ここだけ修正
      port: 2333,
      password: "youshallnotpass",
      secure: false
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// Lavalink接続ログ
manager.on("nodeConnect", () => {
  console.log("Lavalink接続成功");
});

manager.on("nodeError", (_, err) => {
  console.log("Lavalink接続失敗", err);
});

// VC ID
const CHANNEL_ID = "1480661292879581194";

client.once("ready", async () => {
  console.log("Bot Ready");

  // Lavalink初期化
  manager.init(client.user!.id);

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

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
