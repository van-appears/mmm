module.exports = function (model) {
  const { items } = model;

  return function (idx, short, value) {
    if (idx < 0) {
      return;
    }

    if (short === "control" && idx > 0) {
      items[idx] = model.types[value](idx);
      return;
    }

    if (short === "play") {
      items[idx].play(true);
      return;
    }

    if (short === "stop") {
      items[idx].play(false);
      return;
    }

    const controls = items[idx].controls() || [];
    const control = controls.find(x => x.short === short) || {};
    if (control.type === "val") {
      const parsed = parseFloat(value);
      if (parsed) {
        control.set(parsed);
      }
    } else if (control.type === "in") {
      const parsed = parseInt(value);
      if (parsed && idx !== parsed) {
        control.set(parsed);
      }
    } else if (control.type === "type") {
      control.set(value);
    }
  };
};
