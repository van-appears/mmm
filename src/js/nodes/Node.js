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

  disconnectOtherFromParam(otherIdx, param, key) {
    if (otherIdx >= 0) {
      this.model.items[otherIdx].connector().disconnect(param);
      delete this.model.connections[this.idx][`${this.idx}_${key}`];
    }
  }

  connectOtherToParam(otherIdx, param, key) {
    if (otherIdx >= 0) {
      this.model.items[otherIdx].connector().connect(param);
      this.model.connections[this.idx][`${otherIdx}_${key}`] = param;
    }
  }

  replaceOtherOnParam(oldIdx, newIdx, param, key) {
    this.disconnectOtherFromParam(oldIdx, param, key);
    this.connectOtherToParam(newIdx, param, key);
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
        newControls[index].set(lastControls[index].get());
      }
    }
  }

  destroy() {
    if (this.playing) {
      this.play(false);
    }
  }

  asOption() {
    return {
      value: this.idx,
      label: this.label(),
      type: this.type,
    };
  }
}

module.exports = Node;