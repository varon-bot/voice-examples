const manager = new Manager({
  nodes: [
    {
      host: "lavalink",
      port: 2333,
      password: "youshallnotpass",
      secure: false
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});
