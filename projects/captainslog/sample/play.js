const player = require("play-sound")({});
const { join, resolve } = require("path");
const { existsSync, mkdirSync, writeFileSync } = require("fs");

const outputPath = join(__dirname, "output");

/**
 * Create a folder where we'll stsore temporary files generated from the
 * text-to-speech conversion
 */
if (!existsSync(outputPath)) {
  mkdirSync(outputPath);
}

function playSound(fileName) {
  return player.play(resolve(__dirname, `../sounds/${fileName}.mp3`));
}

function playOutput(fileName) {
  return player.play(resolve(outputPath, `${fileName}.mp3`));
}

function saveOutput(fileName, content) {
  const name = join(outputPath, `${fileName}.mp3`);
  writeFileSync(name, content, "binary");
}

module.exports = {
  playSound,
  playOutput,
  saveOutput
};
