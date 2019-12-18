const { startDetector } = require("./detector");
const { addEventListener } = require("./events");
const { startMQTT } = require("./mqtt");
const { startDB, insertLog } = require("./db");
const { startServer } = require("./express");

const {
  EXPRESS_PORT = 3001,
  MQTT_ADDRESS = "http://raspberry.local",
  MQTT_CHANNEL = "water",
  MONGO_URL = "mongodb://localhost:27017"
} = process.env;

function staticLog(msg) {
  return () => console.log(msg);
}
function logWithParams(msg) {
  return (...args) =>
    console.log(msg, ...args.filter(val => val !== undefined));
}

function onWater() {
  insertLog("water");
  console.log("trigger:water");
}

function mqttOnMessage(message) {
  console.log("mqtt:", message);
}

function mqttActive(client) {
  console.log("mqtt:on");
  client.publish(channel, "mqtt:on");
}

addEventListener("onWater", onWater);
addEventListener("jarvisActive", staticLog("jarvis:on"));
addEventListener("jarvisInactive", staticLog("jarvis:off"));

addEventListener("mqttActive", mqttActive);
addEventListener("mqttInactive", staticLog("mqtt:off"));
addEventListener("mqttOnMessage", mqttOnMessage);

addEventListener("dbInsert", staticLog("db:insert"));
addEventListener("dbError", logWithParams("db:error"));
addEventListener("dbRead", staticLog("db:read"));
addEventListener("dbConnect", staticLog("db:on"));
addEventListener("dbClose", staticLog("db:off"));

addEventListener("httpActive", logWithParams("http:on port"));
addEventListener("httpFetchLog", staticLog("http:fetch"));

startMQTT(MQTT_ADDRESS, MQTT_CHANNEL);
startDetector();
startServer(EXPRESS_PORT);
startDB(MONGO_URL);
