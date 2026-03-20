import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import play from "play-dl";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const CHANNEL_ID = "1480661292879581194";
const STREAM_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

client.once("ready", async () => {
  console.log("Bot Ready");

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    // ボイスチャンネルか確認
    if (!channel || channel.type !== ChannelType.GuildVoice) {
      console.error("ボイスチャンネルが見つかりません");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();

    connection.subscribe(player);

    // 再生関数
    const playStream = async () => {
      try {
        console.log("再生開始");

        const stream = await play.stream(STREAM_URL);

const resource = createAudioResource(stream.stream, {
  inputType: stream.type,
  inlineVolume: true,
});

resource.volume?.setVolume(0.5);

        player.play(resource);

      } catch (err) {
        console.error("再生エラー:", err);
      }
    };

    // 最初の再生
    await playStream();

    // 再生が終わったら自動再接続
    player.on(AudioPlayerStatus.Idle, async () => {
      console.log("再接続（ループ）");
      await playStream();
    });

    // プレイヤーエラー
    player.on("error", error => {
      console.error("Player error:", error);
    });

  } catch (err) {
    console.error("初期化エラー:", err);
  }
});

// プロセスが落ちないようにする
client.on("error", console.error);
process.on("uncaughtException", console.error);

client.login(process.env.DISCORD_TOKEN);
