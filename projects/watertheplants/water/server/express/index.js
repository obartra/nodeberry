const express = require("express");
const { readLogs } = require("../db");
const { triggerEvent } = require("../events");

const app = express();

app.get("/logs", (_, response) => {
  triggerEvent(`httpFetchLog`);
  readLogs(list => {
    response.send(list);
    response.end();
  });
});

function startServer(port) {
  app.listen(port, () => triggerEvent(`httpActive`, port));
}

module.exports = {
  startServer
};
