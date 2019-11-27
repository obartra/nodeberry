const Wakeword = require("wakeword");
const express = require("express");
const app = express();
const port = 3000;

app.get("/word", (_, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Disable log output
Wakeword.logFile = "/dev/null";

Wakeword.listen(["hello", "goodbye"], 0.87, (data, word) => {
  console.log(word);

  if (word !== "goodbye") {
    Wakeword.resume();
  } else {
    Wakeword.stop();
  }
});
