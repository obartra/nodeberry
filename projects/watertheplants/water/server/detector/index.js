const record = require("node-record-lpcm16");
const { Detector, Models } = require("snowboy");
const { join, resolve } = require("path");
const { triggerEvent } = require("../events");
const { getJarvis } = require("./jarvis");

const assets = join(__dirname, "../../assets");
const jarvis = getJarvis();
const models = new Models();

models.add({
  file: resolve(assets, "jarvis.pmdl"),
  sensitivity: "0.5",
  hotwords: "jarvis"
});

models.add({
  file: resolve(assets, "water.pmdl"),
  sensitivity: "0.5",
  hotwords: "water"
});

const detector = new Detector({
  resource: resolve(assets, "common.res"),
  models: models
});

detector.on("error", error => console.error(error));

detector.on("hotword", (_index, hotword) => {
  if (hotword === "jarvis") {
    jarvis.trigger();
  } else if (jarvis.active && hotword === "water") {
    triggerEvent("onWater");
    jarvis.cancel();
  }
});

function startDetector() {
  const mic = record.record({
    threshold: 0,
    verbose: true
  });

  mic.stream().pipe(detector);
}

module.exports = {
  startDetector
};
