const Node = require("./Node");
const constants = require("./constants");

class Microphone extends Node {
  constructor(ctx, model, idx, stream) {
    super(ctx, model, idx, constants.MICROPHONE, false);
    this.input = ctx.createMediaStreamSource(stream);
    this.gain = ctx.createGain();
    this.input.connect(this.gain);
  }

  connector() {
    return this.gain;
  }

  controls() {
    const that = this;
    return [
      {
        type: "val",
        label() {
          return "Gain";
        },
        set(val) {
          that.gainValue = val;
          that.gain.gain.setTargetAtTime(val, 0, 0);
        },
        get() {
          return that.gainValue;
        }
      }
    ];
  }

  destroy() {
    // do nothing
  }
}

module.exports = function (ctx, model, idx, stream) {
  return new Microphone(ctx, model, idx, stream);
};
