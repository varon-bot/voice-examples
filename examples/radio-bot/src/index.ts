client.once("ready", async () => {
  console.log("🤖 Bot Ready");

  manager.init(client.user!.id);
});

// ↓ここ追加
manager.on("nodeConnect", async () => {
  console.log("✅ Lavalink接続成功");

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.log("❌ Guild取得失敗");
    return;
  }

  const player = manager.create({
    guild: guild.id,
    voiceChannel: "1480661292879581194",
    textChannel: guild.systemChannelId ?? undefined,
    selfDeafen: true
  });

  player.connect();
  console.log("🔊 VC接続処理開始");

  const res = await manager.search(
    "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  );

  if (!res.tracks.length) {
    console.log("❌ 曲取得失敗");
    return;
  }

  player.queue.add(res.tracks[0]);
  player.play();

  console.log("🎵 再生開始");
});
