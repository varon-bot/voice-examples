import { Client, GatewayIntentBits } from "discord.js";
import { Shoukaku, Connectors } from "shoukaku";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const nodes = [
  {
    name: "Lavalink",
    url: "ballast.proxy.rlwy.net:43055",
    auth: "youshallnotpass"
  }
];

const shoukaku = new Shoukaku(
  new Connectors.DiscordJS(client),
  nodes
);

client.once("ready", () => {
  console.log("🤖 Bot Ready");
});

client.login(process.env.DISCORD_TOKEN);
