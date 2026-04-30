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

  const voiceChannelId = "1480661292879581194"; // ←自分のVCに変更
  const channel = guild.channels.cache.get(voiceChannelId);

  if (!channel || !channel.isVoiceBased()) {
    console.log("❌ VC取得失敗");
    return;
  }

  const player = await shoukaku.joinVoiceChannel({
    guildId: guild.id,
    channelId: channel.id,
    shardId: 0,
    deaf: true
  });

  console.log("🔊 VC接続成功");

  const result = await shoukaku.rest.resolve(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!result || !result.tracks.length) {
    console.log("❌ 曲取得失敗");
    return;
  }

  const track = result.tracks[0].encoded;
  await player.playTrack({ track });

  console.log("🎵 再生開始");
});

client.login(process.env.DISCORD_TOKEN);
