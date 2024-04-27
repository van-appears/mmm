const constants = require("./constants");
const createMicrophone = require("./create-microphone");
const createOscillator = require("./create-oscillator");
const createFilter = require("./create-filter");
const Node = require("./Node");

module.exports = function createModel(stream) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const items = new Array(10);
  const types = {};
  const model = {
    items,
    types
  };
  types.oscillator = createOscillator(audioCtx, model);
  types.filter = createFilter(audioCtx, model);

  items[0] = createMicrophone(audioCtx, model, 0, stream);
  for (let index = 1; index < 10; index++) {
    items[index] = new Node(audioCtx, model, index, constants.EMPTY, false);
  }

  return model;
};
