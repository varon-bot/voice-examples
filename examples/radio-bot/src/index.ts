const manager = new Manager({
  nodes: [
    {
      host: "ballast.proxy.rlwy.net",
      port: 43055,
      password: "youshallnotpass",
      secure: false
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});
