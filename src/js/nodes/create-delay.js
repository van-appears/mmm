import Node from "./Node";
import constants from "../constants";

class Delay extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.DELAY, true);
    this.delay = ctx.createDelay(constants.MAX_DELAY_SECONDS);

    this._controls = this.initControls();
    this._controls[0].set(1);
  }

  connector() {
    return this.delay;
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
    return new Delay(ctx, model, idx);
  };
}
