const constants = require("./constants");
const createMicrophone = require("./nodes/create-microphone");
const createOscillator = require("./nodes/create-oscillator");
const createFilter = require("./nodes/create-filter");
const createDelay = require("./nodes/create-delay");
const createEcho = require("./nodes/create-echo");
const createGain = require("./nodes/create-gain");
const Node = require("./nodes/Node");

module.exports = function createModel(stream) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const items = new Array(10);
  const connections = new Array(10).fill(0).map(x => ({}));
  const types = {};
  const model = {
    items,
    types,
    connections
  };
  types.oscillator = createOscillator(audioCtx, model);
  types.filter = createFilter(audioCtx, model);
  types.delay = createDelay(audioCtx, model);
  types.echo = createEcho(audioCtx, model);
  types.gain = createGain(audioCtx, model);

  items[0] = createMicrophone(audioCtx, model, 0, stream);
  for (let index = 1; index < 10; index++) {
    items[index] = new Node(audioCtx, model, index, constants.EMPTY, false);
  }

  // for diagnostics
  window.model = model;

  return model;
};
