import fs from "fs";

const raw = fs.readFileSync("./cookies.txt", "utf-8");

// ★ ここで変換
const cookie = raw
  .split("\n")
  .filter(line => line && !line.startsWith("#"))
  .map(line => {
    const parts = line.split("\t");
    return `${parts[5]}=${parts[6]}`;
  })
  .join("; ");

await play.setToken({
  youtube: {
    cookie: cookie,
  },
});
