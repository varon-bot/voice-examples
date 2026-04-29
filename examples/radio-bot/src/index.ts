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
  if (!guild) return;

  const connection = await shoukaku.joinVoiceChannel({
    guildId: guild.id,
    channelId: "1480661292879581194",
    shardId: 0
  });

  console.log("🔊 VC接続成功");

  const player = connection;

  const result = await player.node.rest.resolve(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!result || !result.tracks.length) {
    console.log("❌ 曲取得失敗");
    return;
  }

  player.playTrack({ track: result.tracks[0].encoded });

  console.log("🎵 再生開始");
});

client.login(process.env.DISCORD_TOKEN);
