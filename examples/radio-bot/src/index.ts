import { Client, GatewayIntentBits, VoiceChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import play from "play-dl";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const CHANNEL_ID = "1476966964088934400";
const STREAM_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

client.once("ready", async () => {

  console.log("Bot Ready");

  const channel = await client.channels.fetch(CHANNEL_ID) as VoiceChannel;

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  const stream = await play.stream(STREAM_URL);

  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  const player = createAudioPlayer();
  player.play(resource);

  connection.subscribe(player);

});

client.login(process.env.DISCORD_TOKEN);
