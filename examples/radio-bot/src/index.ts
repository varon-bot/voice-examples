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
    url: "ws://ballast.proxy.rlwy.net:43055",
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

  try {
    const player = await shoukaku.joinVoiceChannel({
      guildId: guild.id,
      channelId: "1480661292879581194",
      shardId: 0,
      deaf: true
    });

    console.log("🔊 VC接続成功");

    const result = await player.node.rest.resolve(
      "https://www.youtube.com/watch?v=jfKfPfyJRdk"
    );

    if (!result || !result.tracks || result.tracks.length === 0) {
      console.log("❌ 曲取得失敗");
      return;
    }

    player.playTrack({
      track: result.tracks[0].encoded
    });

    console.log("🎵 再生開始");

  } catch (err) {
    console.log("❌ エラー", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
