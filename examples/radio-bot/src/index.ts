import { Client, GatewayIntentBits } from "discord.js";
import { Shoukaku, Connectors } from "shoukaku";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const nodes = [
  {
    name: "Lavalink",
    url: "ballast.proxy.rlwy.net:43055",
    auth: "youshallnotpass",
    secure: false
  }
];

const shoukaku = new Shoukaku(
  new Connectors.DiscordJS(client),
  nodes
);

client.once("ready", async () => {
  console.log("🤖 Bot Ready");

  const guild = client.guilds.cache.first();

  if (!guild) {
    console.log("❌ Guild取得失敗");
    return;
  }

  const channel = guild.channels.cache.get("1480661292879581194");

  if (!channel || !channel.isVoiceBased()) {
    console.log("❌ VC取得失敗");
    return;
  }

  console.log("🔊 VC接続開始");

  const player = await shoukaku.joinVoiceChannel({
    guildId: guild.id,
    channelId: channel.id,
    shardId: 0,
    deaf: true
  });

  console.log("✅ VC接続成功");

  const res = await shoukaku.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.data || !res.data.length) {
    console.log("❌ 曲取得失敗");
    return;
  }

  player.playTrack({ track: res.data[0].encoded });

  console.log("🎵 再生開始");
});

client.login(process.env.DISCORD_TOKEN);
