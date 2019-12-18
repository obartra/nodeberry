const events = {
  dbClose: [],
  dbConnect: [],
  dbError: [],
  dbInsert: [],
  dbRead: [],
  httpActive: [],
  httpFetchLog: [],
  jarvisActive: [],
  jarvisInactive: [],
  mqttActive: [],
  mqttInactive: [],
  mqttOnMessage: [],
  onWater: []
};
/**
 * validateEventName is used before each event method to make sure only valid
 * event names are used.
 */
function validateEventName(name) {
  const eventNames = Object.keys(events);

  if (!eventNames.includes(name)) {
    throw new Error(
      `Invalid name ${name}, valid events are: ${eventNames.join(", ")}`
    );
  }
}

function triggerEvent(name, payload) {
  validateEventName(name);
  events[name].forEach(cb => cb(payload));
}

function addEventListener(name, callback) {
  validateEventName(name);

  events[name].push(callback);
}
function removeEventListener(name, callback) {
  validateEventName(name);

  const index = events[name].indexOf(callback);

  if (index !== -1) {
    events[name].splice(index, 1);
  }
}

module.exports = {
  triggerEvent,
  addEventListener,
  removeEventListener
};
