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
          that.gainValue = val;
          that.gain.gain.setTargetAtTime(val, 0, 0);
        },
        get() {
          return that.gainValue;
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
