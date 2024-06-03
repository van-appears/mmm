const createOscillator = require("./nodes/create-oscillator");
const createFilter = require("./nodes/create-filter");
const createDelay = require("./nodes/create-delay");
const createEcho = require("./nodes/create-echo");
const createGain = require("./nodes/create-gain");

module.exports = function createModel(mediaStream) {
  const callbacks = [];
  const dispatch = (obj, prop, val) => {
    callbacks.forEach(callback => callback(obj, prop, val));
  };
  const handler = {
    set(obj, prop, val) {
      obj[prop] = val;
      dispatch(obj, prop, val);
      return true;
    }
  };

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const items = new Proxy(new Array(10), handler);
  const connections = new Array(10).fill(0).map(x => ({}));
  const types = {};
  const model = {
    audioCtx,
    mediaStream,
    items,
    types,
    connections,
    dispatch,
    register(callback) {
      callbacks.push(callback);
    }
  };

  types.oscillator = createOscillator(audioCtx, model);
  types.filter = createFilter(audioCtx, model);
  types.delay = createDelay(audioCtx, model);
  types.echo = createEcho(audioCtx, model);
  types.gain = createGain(audioCtx, model);

  // for diagnostics
  window.model = model;
  return model;
};
