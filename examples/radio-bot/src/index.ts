const manager = new Manager({
  nodes: [
    {
      host: "viaduct.proxy.rlwy.net",
      port: 12345,
      password: "youshallnotpass",
      secure: false // ← ここをfalseに！！
    }
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});
