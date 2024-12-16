import Node from "./Node";
import constants from "../constants";

class Echo extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.ECHO, true);
    this.delay = ctx.createDelay();
    this.gain = ctx.createGain();

    this.delay.connect(this.gain);
    this.gain.connect(this.delay);
    this._controls = this.initControls();
    this._controls[0].set(1000);
    this._controls[1].set(0.5);
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
        short: "t",
        label: "Time <= 10s",
        max: constants.MAX_DELAY_SECONDS,
        set(val) {
          that.delay.delayTime.setValueCurveAtTime(
            [that.delayTimeValue || val, val],
            that.ctx.currentTime,
            that.delayTimeTime || 0.001
          );
          that.delayTimeValue = val;
        },
        get() {
          return that.delayTimeValue;
        },
        setTime(val) {
          that.delayTimeTime = val;
        },
        getTime() {
          return that.delayTimeTime;
        }
      },
      {
        type: "val",
        short: "s",
        label: "Sustain",
        set(val) {
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
        short: "i",
        label: "Input",
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

  destroy() {
    super.destroy();
    this.disconnectOtherFromParam(this.inputConnectValue, this.delay);
  }
}

export default function (ctx, model) {
  return function (idx) {
    return new Echo(ctx, model, idx);
  };
}
