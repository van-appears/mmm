const createMicrophone = require("./create-microphone");
const createOscillator = require("./create-oscillator");
const createFilter = require("./create-filter");

module.exports = function (ctx, items, stream) {
  return {
    createOscillator() {
      return createOscillator(ctx, items);
    }
  };
};
