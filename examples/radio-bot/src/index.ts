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
      host: "lavalink",
      port: 2333,
      password: "youshallnotpass",
      secure: false
    }
  ],
  clientName: "my-bot", // ← これ追加
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// 🔥 ここ超重要
client.on("ready", () => {
  manager.init(client.user.id);
});

// デバッグ
manager.on("nodeConnect", () => {
  console.log("Lavalink接続成功");
});

manager.on("nodeError", (_, err) => {
  console.log("Lavalink接続失敗", err);
});

const CHANNEL_ID = "1480661292879581194";

client.once("ready", async () => {
  console.log("Bot Ready");

  const guild = client.guilds.cache.first();
  if (!guild) return;

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  player.connect();

  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.tracks.length) return;

  player.queue.add(res.tracks[0]);
  player.play();
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
