import Node from "./Node";
import constants from "../constants";

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

  title() {
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
          that.osc.frequency.cancelScheduledValues(0);
          that.osc.frequency.setValueCurveAtTime(
            [that.freqValue || val, val],
            that.ctx.currentTime,
            that.freqTime || 0.001
          );
          that.freqValue = val;
        },
        get() {
          return that.freqValue;
        },
        setTime(val) {
          that.freqTime = val;
        },
        getTime() {
          return that.freqTime;
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
          that.gain.gain.cancelScheduledValues(0);
          that.gain.gain.setValueCurveAtTime(
            [that.gainValue || val, val],
            that.ctx.currentTime,
            that.gainTime || 0.001
          );
          that.gainValue = val;
        },
        get() {
          return that.gainValue;
        },
        setTime(val) {
          that.gainTime = val;
        },
        getTime() {
          return that.gainTime;
        }
      },
      {
        type: "in",
        short: "gm",
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

export default function (ctx, model) {
  return function (idx) {
    return new Oscillator(ctx, model, idx);
  };
}
