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

    const playStream = async () => {
      try {
        console.log("再生開始");

        // ★ YouTubeから音声取得
        const stream = await play.stream(STREAM_URL);

        const resource = createAudioResource(stream.stream);

        player.play(resource);

        // ★ 再生開始検知
        player.once(AudioPlayerStatus.Playing, () => {
          console.log("再生中！");
        });

      } catch (err) {
        console.error("再生エラー:", err);
      }
    };

    // 最初の再生
    await playStream();

    // ループ再生
    player.on(AudioPlayerStatus.Idle, async () => {
      console.log("ループ再生");
      await playStream();
    });

  } catch (err) {
    console.error("初期化エラー:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
