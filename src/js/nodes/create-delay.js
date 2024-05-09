const Node = require("./Node");
const constants = require("../constants");

class Delay extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.DELAY, true);
    this.delay = ctx.createDelay();

    this._controls = this.initControls();
    this._controls[0].set(1000);
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
        label: "Time (ms)",
        set(val) {
          that.delayTimeValue = val;
          that.delay.delayTime.setTargetAtTime(val, 0, 0);
        },
        get() {
          return that.delayTimeValue;
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
}

module.exports = function (ctx, model) {
  return function (idx) {
    const last = model.items[idx];
    if ([constants.DELAY, constants.MICROPHONE].includes(last.type)) {
      return last;
    }
    return new Delay(ctx, model, idx);
  };
};
