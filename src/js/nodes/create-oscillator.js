const Node = require("./Node");
const constants = require("../constants");
const TYPES = ["sawtooth", "sine", "square", "triangle"];

class Oscillator extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.OSCILLATOR, true);
    this.osc = ctx.createOscillator();
    this.gain = ctx.createGain();
    this.delay = ctx.createDelay();
    this.osc.connect(this.gain);
    this.gain.connect(this.delay);
    this.osc.start(0);

    this.delay.delayTime.setTargetAtTime(0.001, 0, 0);
    this._controls = this.initControls();
    this._controls[0].set(100);
    this._controls[2].set(1);
    this._controls[4].set("sine");
  }

  label() {
    return `${this.idx} ${this.type} ${this.osc.type}`;
  }

  connector() {
    return this.delay;
  }

  subtype() {
    const that = this;
    return {
      values: [],
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
    this.disconnectOtherFromParam(this.freqConnectValue, this.osc.frequency);
    this.disconnectOtherFromParam(this.gainConnectValue, this.gain.gain);
    this.osc.stop();
  }

  controls() {
    return this._controls;
  }

  initControls() {
    const that = this;
    return [
      {
        type: "val",
        short: "f",
        label: "Freq",
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
        short: "fm",
        label: "Freq Mod",
        set(val) {
          that.replaceOtherOnParam(
            that.freqConnectValue,
            val,
            that.osc.frequency,
            "freqConnect"
          );
          that.freqConnectValue = val;
        },
        get() {
          return that.freqConnectValue;
        }
      },
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
      },
      {
        type: "in",
        short: "g",
        label: "Gain Mod",
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
        type: "type",
        short: "t",
        label: "Type",
        values: TYPES,
        set(val) {
          if (!TYPES.includes(val)) {
            return;
          }
          that.osc.type = val;
        },
        get() {
          return that.osc.type;
        }
      }
    ];
  }
}

module.exports = function (ctx, model) {
  return function (idx) {
    const last = model.items[idx];
    if ([constants.OSCILLATOR, constants.MICROPHONE].includes(last.type)) {
      return last;
    }
    return new Oscillator(ctx, model, idx);
  };
};
