const record = require("node-record-lpcm16");
const { Detector, Models } = require("snowboy");
const { setActive, MSG } = require("./utils");

const models = new Models();

models.add({
  file: "jarvis.pmdl",
  sensitivity: "0.5",
  hotwords: "jarvis"
});

const detector = new Detector({
  resource: "common.res",
  models: models
});

detector.on("silence", () => setActive(MSG.SILENCE));
// <buffer> contains the last chunk of the audio that triggers the "sound"
// event. It could be written to a wav stream.
detector.on("sound", buffer => setActive(MSG.SOUND));

detector.on("error", () => console.log("error"));

// <buffer> contains the last chunk of the audio that triggers the "hotword"
// event. It could be written to a wav stream. You will have to use it
// together with the <buffer> in the "sound" event if you want to get audio
// data after the hotword.
detector.on("hotword", (index, hotword, buffer) => setActive(MSG.WORD));

const mic = record.record({
  threshold: 0,
  verbose: true
});

mic.stream().pipe(detector);
