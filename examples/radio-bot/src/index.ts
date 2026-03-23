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
      host: "ここにTCPのhost",
      port: ここにport,
      password: "youshallnotpass",
      secure: true
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

// 👇 ここで再生処理をやる
async function startPlayer() {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const CHANNEL_ID = "1480661292879581194";

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  player.connect();
  console.log("VC接続開始");

  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.tracks.length) return;

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("再生開始");
}

// ✅ Lavalink接続成功時だけ実行
manager.on("nodeConnect", () => {
  console.log("✅ Lavalink接続成功");
  startPlayer(); // ←ここが重要
});

manager.on("nodeError", (_, err) => {
  console.log("❌ Lavalink接続失敗", err);
});

client.once("ready", () => {
  console.log("🤖 Bot Ready");
  manager.init(client.user!.id);
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
