const { resolve } = require("path");
const recorder = require("node-record-lpcm16");
const { Detector, Models } = require("snowboy");

function getAudioStream() {
  return recorder
    .record({
      sampleRateHertz: 16000,
      threshold: 0.1, //silence threshold
      silence: "3.0" //seconds of silence before ending
    })
    .stream();
}

function wakeWord(onData) {
  const models = new Models();

  models.add({
    file: resolve(__dirname, "jarvis.pmdl"),
    sensitivity: "0.5",
    hotwords: "jarvis"
  });

  const detector = new Detector({
    resource: resolve(__dirname, "common.res"),
    models: models
  });

  const audio = getAudioStream();

  detector.on("hotword", () => onData(audio));

  audio.pipe(detector);
}

module.exports = {
  wakeWord
};
