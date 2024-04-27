const Node = require("./Node");
const constants = require("./constants");

class Oscillator extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.OSCILLATOR, true);
    this.osc = ctx.createOscillator();
    this.gain = ctx.createGain();
    this.osc.type = "sine";
    this.osc.connect(this.gain);
    this.osc.start(0);
  }

  connector() {
    return this.gain;
  }

  subtype() {
    const that = this;
    return {
      values: ["sawtooth", "sine", "square", "triangle"],
      set(val) {
        that.osc.type = val;
      },
      get() {
        return that.osc.type;
      }
    };
  }

  destroy() {
    super.destroy();
    this.disconnectOtherFromParam(this.freqConnectValue, that.osc.frequency);
    this.disconnectOtherFromParam(this.gainConnectValue, that.gain.gain);
    this.osc.stop();
  }

  controls() {
    const that = this;
    return [
      {
        type: "val",
        label() {
          return "Freq";
        },
        set(val) {
          that.freqValue = val;
          that.osc.frequency.setTargetAtTime(val, 0, 0);
        },
        get() {
          return that.freqValue;
        }
      },
      {
        type: "in",
        label() {
          return "Freq Mod";
        },
        set(val) {
          that.replaceOtherOnParam(
            that.freqConnectValue,
            val,
            that.osc.frequency
          );
          that.freqConnectValue = val;
        },
        get() {
          return that.freqConnectValue;
        }
      },
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
          return "Amp Mod";
        },
        set(val) {
          that.replaceOtherOnParam(that.gainConnectValue, val, that.gain.gain);
          that.gainConnectValue = val;
        },
        get() {
          return that.gainValue;
        }
      }
    ];
  }
}

module.exports = function (ctx, model) {
  return function (idx) {
    const last = model.items[idx];
    if (last.type === constants.OSCILLATOR) {
      return last;
    }
    return new Oscillator(ctx, model, idx);
  };
};
