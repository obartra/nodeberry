const { triggerEvent } = require("../events");

const duration = 4000;
function getJarvis() {
  let active = false;
  let timer;

  return {
    get active() {
      return active;
    },
    cancel: () => {
      if (active) {
        triggerEvent("jarvisInactive");
      }
      active = false;
      clearTimeout(timer);
    },
    trigger: () => {
      clearTimeout(timer);
      if (!active) {
        triggerEvent("jarvisActive");
      }
      active = true;
      timer = setTimeout(() => {
        if (active) {
          triggerEvent("jarvisInactive");
        }
        active = false;
      }, duration);
    }
  };
}

module.exports = { getJarvis };
