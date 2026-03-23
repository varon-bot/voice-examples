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
      password: "LAVALINK_SERVER_PASSWORD"
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

const CHANNEL_ID = "1480661292879581194";

client.once("ready", async () => {
  console.log("Bot Ready");

  if (!client.user) return;

  manager.init(client.user.id);

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

  console.log("再生開始");
});

client.on("raw", (d) => manager.updateVoiceState(d));

client.login(process.env.DISCORD_TOKEN);
