import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import play from "play-dl";

// ★ Cookie設定（ここ超重要）
await play.setToken({
  youtube: {
    cookie: process.env.YOUTUBE_COOKIE,
  },
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const CHANNEL_ID = "1480661292879581194";
const STREAM_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

client.once("ready", async () => {
  console.log("Bot Ready");

  const channel = await client.channels.fetch(CHANNEL_ID);

  if (!channel || channel.type !== ChannelType.GuildVoice) {
    console.log("チャンネル取得失敗");
    return;
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  const player = createAudioPlayer();
  connection.subscribe(player);

  console.log("再生開始");

  try {
    const stream = await play.stream(STREAM_URL);

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    player.play(resource);

  } catch (e) {
    console.error("再生エラー:", e);
  }

  player.on(AudioPlayerStatus.Playing, () => {
    console.log("再生中！");
  });

  player.on("error", (e) => {
    console.error("プレイヤーエラー:", e);
  });
});

client.login(process.env.DISCORD_TOKEN);
