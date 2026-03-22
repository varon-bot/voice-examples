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

// ★ あなたのVC ID
const CHANNEL_ID = "1480661292879581194";

// ★ 安定する配信
const STREAM_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

client.once("ready", async () => {
  console.log("Bot Ready");

  // ★ これ追加（超重要）
  await play.setToken({
    youtube: {
      cookie: "",
    },
  });

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

        // ★ ここ変更（重要）
        const stream = await play.stream(STREAM_URL, {
          discordPlayerCompatibility: true
        });

        const resource = createAudioResource(stream.stream);

        player.play(resource);

      } catch (err) {
        console.error("再生エラー:", err);
      }
    };

    // ★ 再生状態ログ（ここに置くのが正しい）
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("再生中！");
    });

    // 最初の再生
    await playStream();

    // ループ
    player.on(AudioPlayerStatus.Idle, async () => {
      console.log("ループ再生");
      await playStream();
    });

  } catch (err) {
    console.error("初期化エラー:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
