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
      host: "ballast.proxy.rlwy.net",
      port: 43055,
      password: "youshallnotpass",
      secure: false
    }
  ],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

client.once("ready", async () => {
  console.log("🤖 Bot Ready");

  manager.init(client.user!.id);
});

manager.on("nodeConnect", async () => {
  console.log("✅ Lavalink接続成功");

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("❌ Guild取得失敗");
    return;
  }

  const player = manager.create({
    guild: guild.id,
    voiceChannel: "1480661292879581194",
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  player.connect();
  console.log("🔊 VC接続処理開始");

const res = await manager.search("lofi hip hop");

  if (!res.tracks.length) {
    console.log("❌ 曲取得失敗");
    return;
  }

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("🎵 再生開始");
});

manager.on("nodeError", (_, err) => {
  console.log("❌ Lavalink接続失敗", err);
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
