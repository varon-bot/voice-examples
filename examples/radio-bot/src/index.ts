import { Client, GatewayIntentBits } from "discord.js";
import { Manager } from "erela.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Lavalink設定
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

// VC ID
const CHANNEL_ID = "1480661292879581194";

client.once("ready", async () => {
  console.log("Bot Ready");

  // ★ null対策（重要）
  manager.init(client.user!.id);

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("Guild取得失敗");
    return;
  }

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: CHANNEL_ID, // ★確実にstringにする
    selfDeafen: true
  });

  player.connect();
  console.log("VC接続完了");

  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.tracks || res.tracks.length === 0) {
    console.log("曲取得失敗");
    return;
  }

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("再生開始");
});

// Lavalink連携（必須）
client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
