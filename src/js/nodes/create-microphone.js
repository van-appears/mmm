const Node = require("./Node");
const constants = require("../constants");

class Microphone extends Node {
  constructor(ctx, model, idx, stream) {
    super(ctx, model, idx, constants.MICROPHONE, true);
    this.input = ctx.createMediaStreamSource(stream);
    this.gain = ctx.createGain();
    this.input.connect(this.gain);

    this._controls = this.initControls();
    this._controls[0].set(1);
  }

  connector() {
    return this.gain;
  }

  initControls() {
    const that = this;
    return [
      {
        type: "val",
        short: "g",
        label: "Gain",
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

  controls() {
    return this._controls;
  }

  destroy() {
    // do nothing
  }
}

module.exports = function (ctx, model, idx, stream) {
  return new Microphone(ctx, model, idx, stream);
};
