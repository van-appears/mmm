class Node {
  constructor(ctx, model, idx, type, playable) {
    this.ctx = ctx;
    this.model = model;
    this.idx = idx;
    this.type = type;
    this.playable = playable;
    this.playing = false;
  }

  connector() {
    return {
      connect() {},
      disconnect() {}
    };
  }

  disconnectOtherFromParam(otherIdx, param) {
    if (otherIdx >= 0) {
      model.items[otherIdx].connector().disconnect(param);
    }
  }

  connectOtherToParam(otherIdx, param) {
    if (otherIdx >= 0) {
      model.items[otherIdx].connector().connect(param);
    }
  }

  replaceOtherOnParam(oldIdx, newIdx, param) {
    this.disconnectOtherFromParam(oldIdx, param);
    this.connectOtherToParam(newIdx, param);
  }

  play(bool) {
    if (bool) {
      this.connector().connect(this.ctx.destination);
      this.playing = true;
    } else {
      this.connector().disconnect(this.ctx.destination);
      this.playing = false;
    }
  }

  subtype() {
    return {
      values: null,
      set(val) {},
      get() {
        return "";
      }
    };
  }

  label() {
    return `${this.idx} ${this.type} ${this.subtype().get()}`;
  }

  controls() {
    return [];
  }

  setValuesTo(newNode) {
    const lastControls = this.controls() || [];
    const newControls = newNode.controls() || [];
    for (let index = 0; index < lastControls.length; index++) {
      if (!newControls[index]) {
        return;
      }
      if (lastControls[index].type === newControls[index].type) {
        newControls[index].set(lastControls[index].type);
      }
    }
  }

  destroy() {
    if (this.playing) {
      this.play(false);
    }
  }
}

module.exports = Node;
