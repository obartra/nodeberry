function log(message, { end } = {}) {
  if (end) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(message);
  } else {
    process.stdout.write(`${message}...`);
  }
}

function wait(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = {
  log,
  wait
};
