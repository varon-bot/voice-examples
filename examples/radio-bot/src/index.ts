import fs from "fs";
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

const CHANNEL_ID = "1480661292879581194";

// YouTube（軽いURL）
const STREAM_URL = "https://youtu.be/5qap5aO4i9A";

client.once("ready", async () => {
  console.log("Bot Ready");

  // ★ Cookie読み込み（ここが重要）
  await play.setToken({
    youtube: {
      cookie: fs.readFileSync("./cookies.txt", "utf-8"),
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

        const stream = await play.stream(STREAM_URL);

        const resource = createAudioResource(stream.stream, {
          inputType: stream.type,
        });

        player.play(resource);

      } catch (err) {
        console.error("再生エラー:", err);
      }
    };

    // 最初の再生
    await playStream();

    // ループ
    player.on(AudioPlayerStatus.Idle, async () => {
      console.log("ループ再生");
      await playStream();
    });

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("再生中！");
    });

    player.on("error", (e) => {
      console.error("プレイヤーエラー:", e);
    });

  } catch (err) {
    console.error("初期化エラー:", err);
  }
});

// 落ち防止
client.on("error", console.error);
process.on("uncaughtException", console.error);

client.login(process.env.DISCORD_TOKEN);
