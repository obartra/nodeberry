const mqtt = require("mqtt");
const { triggerEvent } = require("../events");

function startMQTT(address, channel) {
  const client = mqtt.connect(address);

  client.on("connect", () => {
    client.subscribe(channel, err => {
      if (!err) {
        triggerEvent("mqttActive", client);
      }
    });
  });

  client.on("disconnect", () => {
    triggerEvent("mqttInactive");
    client.connect(address);
  });

  client.on("message", (_topic, message) => {
    triggerEvent("mqttOnMessage", message.toString());
  });
}

module.exports = {
  startMQTT
};
