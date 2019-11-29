const MSG = {
  SILENCE: Symbol("silence"),
  SOUND: Symbol("sound"),
  WORD: Symbol("word")
};

function setActive(message) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  const sound = message === MSG.SILENCE ? "🔇" : "🔊";
  const match = message === MSG.WORD ? "🎉 DETECTED 🎉" : "";

  process.stdout.write(`${sound}  ${match}`);
}
module.exports = {
  setActive,
  MSG
};
