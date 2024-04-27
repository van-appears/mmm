const Node = require("./Node");
const thistype = "filter";

class Filter extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, thistype, true);
    this.model = model;
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
  }

  connector() {
    return this.filter;
  }

  subtype() {
    const that = this;
    return {
      values: ["lowpass", "highpass", "bandpass", "notch"],
      set(val) {
        that.filter.type = val;
      },
      get() {
        return that.filter.type;
      }
    };
  }

  destroy() {
    super.destroy();
    this.disconnectOtherFromParam(this.freqConnectValue, this.filter.frequency);
    this.disconnectOtherFromParam(this.qConnectValue, this.filter.Q);
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
          that.filter.frequency.setTargetAtTime(val, 0, 0);
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
            that.filter.frequency
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
          return "Q";
        },
        set(val) {
          that.qValue = val;
          that.filter.Q.setTargetAtTime(val, 0, 0);
        },
        get() {
          return that.qValue;
        }
      },
      {
        type: "in",
        label() {
          return "Q Mod";
        },
        set(val) {
          that.replaceOtherOnParam(that.qConnectValue, val, that.filter.Q);
          that.qConnectValue = val;
        },
        get() {
          return that.qConnectValue;
        }
      },
      {
        type: "in",
        label() {
          return "Input";
        },
        set(val) {
          that.replaceOtherOnParam(that.inputConnectValue, val, that.filter);
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
    if (last.type === thistype) {
      return last;
    }
    return new Filter(ctx, model, idx);
  };
};
