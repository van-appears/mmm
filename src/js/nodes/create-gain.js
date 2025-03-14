import Node from "./Node";
import constants from "../constants";

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
        type: "in",
        short: "i",
        label: "Input",
        set(val) {
          that.replaceOtherOnParam(
            that.inputConnectValue,
            val,
            that.gain,
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

  destroy() {
    super.destroy();
    this.disconnectOtherFromParam(this.inputConnectValue, this.gain);
  }
}

export default function (ctx, model) {
  return function (idx) {
    return new Gain(ctx, model, idx);
  };
}
