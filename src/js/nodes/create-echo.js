const Node = require("./Node");
const constants = require("../constants");

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
          that.delayTimeValue = val;
          that.delay.delayTime.setTargetAtTime(val * 1000, 0, 0);
        },
        get() {
          return that.delayTimeValue;
        }
      },
      {
        type: "val",
        short: "s",
        label: "Sustain",
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

module.exports = function (ctx, model) {
  return function (idx) {
    return new Echo(ctx, model, idx);
  };
};
