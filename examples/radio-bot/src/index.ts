import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from "@discordjs/voice";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ★ 自分のボイスチャンネルID
const CHANNEL_ID = "1480661292879581194";

// ★ 安定するYouTubeライブ（lofi）

client.once("ready", async () => {
  console.log("Bot Ready");

  try {
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

    console.log("接続成功・再生準備OK");

  } catch (err) {
    console.error("初期化エラー:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
