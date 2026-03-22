import { Client, GatewayIntentBits } from "discord.js";
import { Manager } from "erela.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Lavalink接続設定
const manager = new Manager({
  nodes: [
    {
      host: "lavalink.railway.internal",
      port: 2333,
      password: "youshallnotpass"
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// ★ 自分のボイスチャンネルID
const CHANNEL_ID = "1480661292879581194";

client.once("ready", () => {
  console.log("Bot Ready");
  manager.init(client.user.id);
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.on("ready", async () => {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: guild.systemChannelId,
    selfDeafen: true
  });

  player.connect();

  console.log("接続成功");

  // YouTube再生（Lavalink経由）
  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (res.tracks.length === 0) {
    console.log("曲が見つからない");
    return;
  }

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("再生開始");
});

client.login(process.env.DISCORD_TOKEN);
