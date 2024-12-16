import Node from "./Node";
import constants from "../constants";

class Microphone extends Node {
  constructor(ctx, model, idx, mediaStream) {
    super(ctx, model, idx, constants.MICROPHONE, true);
    this.input = ctx.createMediaStreamSource(mediaStream);
    this.gain = ctx.createGain();
    this.input.connect(this.gain);

    this._controls = this.initControls();
    this._controls[0].set(1);
  }

  connector() {
    return this.gain;
  }

  initControls() {
    const that = this;
    return [
      {
        type: "val",
        short: "g",
        label: "Gain",
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
      }
    ];
  }

  controls() {
    return this._controls;
  }

  destroy() {
    // do nothing
  }
}

export default function (ctx, model, idx, mediaStream) {
  return new Microphone(ctx, model, idx, mediaStream);
}
