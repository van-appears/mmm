import Node from "./Node";
import constants from "../constants";

const TYPES = ["lowpass", "highpass", "bandpass", "notch"];

class Filter extends Node {
  constructor(ctx, model, idx) {
    super(ctx, model, idx, constants.FILTER, true);
    this.model = model;
    this.filter = ctx.createBiquadFilter();

    this._controls = this.initControls();
    this._controls[0].set(100);
    this._controls[2].set(0.707);
    this._controls[4].set("lowpass");
  }

  title() {
    return `${this.idx} ${this.type} ${this.filter.type}`;
  }

  connector() {
    return this.filter;
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
          that.filter.frequency.cancelScheduledValues(0);
          that.filter.frequency.setValueCurveAtTime(
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
            that.filter.frequency,
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
        short: "q",
        label: "Q",
        set(val) {
          that.filter.Q.cancelScheduledValues(0);
          that.filter.Q.setValueCurveAtTime(
            [that.qValue || val, val],
            that.ctx.currentTime,
            that.qTime || 0.001
          );
          that.qValue = val;
        },
        get() {
          return that.qValue;
        },
        setTime(val) {
          that.qTime = val;
        },
        getTime() {
          return that.qTime;
        }
      },
      {
        type: "in",
        short: "qm",
        label: "Q Mod",
        set(val) {
          that.replaceOtherOnParam(
            that.qConnectValue,
            val,
            that.filter.Q,
            "qConnect"
          );
          that.qConnectValue = val;
        },
        get() {
          return that.qConnectValue;
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
          that.filter.type = val;
        },
        get() {
          return that.filter.type;
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
            that.filter,
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
    this.disconnectOtherFromParam(this.freqConnectValue, this.filter.frequency);
    this.disconnectOtherFromParam(this.qConnectValue, this.filter.Q);
    this.disconnectOtherFromParam(this.inputConnectValue, this.filter);
  }
}

export default function (ctx, model) {
  return function (idx) {
    return new Filter(ctx, model, idx);
  };
}
