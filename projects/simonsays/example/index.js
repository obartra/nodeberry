const { resolve } = require("path");
const { record, play } = require("./recorder");
const { wait, log } = require("./utils");

const files = {
  temp: resolve(__dirname, "rawAudio.raw"),
  end: resolve(__dirname, "../../../assets/gameover.mp3")
};

const duration = 5000;

async function main() {
  log("🎙️  Recording");
  const ai = record(files.temp);
  await wait(duration);
  ai.stop();

  log("🎙️  Recorded", { end: true });

  log("🔊 Playing");
  await play(files.temp);

  log("🔇 Playing done", { end: true });
  log("🎵 Music");

  await play(files.end);
  log("🎵 Music", { end: true });
}

main()
  .then(() => log("", { end: true }))
  .catch(e => console.error(e));
