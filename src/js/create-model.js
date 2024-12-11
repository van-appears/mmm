import createOscillator from "./nodes/create-oscillator";
import createFilter from "./nodes/create-filter";
import createDelay from "./nodes/create-delay";
import createEcho from "./nodes/create-echo";
import createGain from "./nodes/create-gain";
import Sequencer from "./nodes/Sequencer";

export default function createModel(mediaStream) {
  const callbacks = [];
  function dispatch(obj, prop, val) {
    callbacks.forEach(callback => callback(obj, prop, val));
  }
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
    currentGraphIdx: 0,
    currentSeqIdx: 0,
    audioCtx,
    mediaStream,
    items,
    types,
    connections,
    dispatch,
    update(prop, val) {
      this[prop] = val;
      this.dispatch(this, prop, val);
    },
    register(callback) {
      callbacks.push(callback);
    }
  };

  model.sequences = new Array(10)
    .fill(0)
    .map((x, idx) => new Sequencer(model, idx));

  types.oscillator = createOscillator(audioCtx, model);
  types.filter = createFilter(audioCtx, model);
  types.delay = createDelay(audioCtx, model);
  types.echo = createEcho(audioCtx, model);
  types.gain = createGain(audioCtx, model);

  // for diagnostics
  window.model = model;
  return model;
}
