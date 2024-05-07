const Node = require("./Node");
const constants = require("../constants");

class Gain extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.GAIN, true);
    this.gain = ctx.createGain();

    this._controls = this.initControls();
    this._controls[0].set(1);
  }

  connector() {
    return this.gain;
  }

  controls() {
    return this._controls;
  }

  initControls() {
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
      },
      {
        type: "in",
        label() {
          return "Gain Mod";
        },
        set(val) {
          that.replaceOtherOnParam(
            that.gainConnectValue,
            val,
            that.gain.gain,
            "gainConnect"
          );
          that.gainConnectValue = val;
        },
        get() {
          return that.gainConnectValue;
        }
      },
      {
        type: "in",
        label() {
          return "Input";
        },
        set(val) {
          that.replaceOtherOnParam(
            that.inputConnectValue,
            val,
            that.delay,
            "input"
          );
          that.inputConnectValue = val;
        },
        get() {
          return that.inputConnectValue;
        }
      }
    ];
  }
}

module.exports = function (ctx, model) {
  return function (idx) {
    const last = model.items[idx];
    if ([constants.GAIN, constants.MICROPHONE].includes(last.type)) {
      return last;
    }
    return new Gain(ctx, model, idx);
  };
};
