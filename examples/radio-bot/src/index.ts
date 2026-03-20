import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const CHANNEL_ID = "1480661292879581194";

// ★ YouTubeやめてMP3直
const STREAM_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

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

  // ★ ここが超重要（stream使わない）
  const resource = createAudioResource(STREAM_URL);

  player.play(resource);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log("再生中！");
  });

  player.on("error", (e) => {
    console.error("プレイヤーエラー:", e);
  });
});

client.login(process.env.DISCORD_TOKEN);
