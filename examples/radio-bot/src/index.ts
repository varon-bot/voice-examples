import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from "@discordjs/voice";
import play from "play-dl";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ★ 自分のボイスチャンネルIDにする
const CHANNEL_ID = "ここを自分のIDに変更";

// ★ 安定するYouTubeライブ
const STREAM_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

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

        const stream = await play.stream(STREAM_URL);

        const resource = createAudioResource(stream.stream);

        player.play(resource);

        // ★ これ追加（重要）
        player.on(AudioPlayerStatus.Playing, () => {
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
