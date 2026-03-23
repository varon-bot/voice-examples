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

const CHANNEL_ID = "1480661292879581194";

// ★ ここが重要
let lavalinkReady = false;

manager.on("nodeConnect", () => {
  console.log("Lavalink接続成功");
  lavalinkReady = true;
});

manager.on("nodeError", (node, error) => {
  console.error("Lavalinkエラー:", error);
});

client.once("ready", async () => {
  console.log("Bot Ready");

  manager.init(client.user!.id);

  // ★ 接続待ち（最大10秒）
  let wait = 0;
  while (!lavalinkReady && wait < 20) {
    await new Promise(r => setTimeout(r, 500));
    wait++;
  }

  if (!lavalinkReady) {
    console.log("Lavalink接続失敗");
    return;
  }

  const guild = client.guilds.cache.first();
  if (!guild) return;

  const player = manager.create({
    guild: guild.id,
    voiceChannel: CHANNEL_ID,
    textChannel: CHANNEL_ID,
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
