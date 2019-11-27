const fs = require("fs");
const recorder = require("node-record-lpcm16");
const player = require("play-sound")({});

function record(filename) {
  const file = fs.createWriteStream(filename, { encoding: "binary" });
  const recording = recorder.record({ sampleRate: 44100 });

  recording.stream().pipe(file);

  return recording;
}

function play(filename) {
  return new Promise((resolve, reject) => {
    player.play(filename, err => {
      if (err) {
        reject(new Error("Failed to play audio"));
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  record,
  play
};
