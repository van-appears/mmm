const constants = require("./constants");
const fillSelect = require("./fill-select");
const select = require("./select");

module.exports = function connectGraphListeners(model) {
  const { items, types, connections } = model;
  let currentIdx = 0;
  let current = null;
  let nextType = null;
  let lastControl = null;

  const controlArea = select(".controls");
  const confirmEl = select(".confirm");
  const label = select(".name span");
  const play = select("#play");
  const controlShortEls = select(".controls .control .short");
  const controlLongEls = select(".controls .control .long");
  const controlValEls = select(".controls .control input");
  const controlInEls = select(".controls .control select");
  const convertEls = select(".nodes button");
  const optionEls = select(".options button");
  play.checked = false;

  function setOptionStyle(idx) {
    const style = items[idx].type +
      (items[idx].playing ? " playing" : "") +
      (idx === currentIdx ? " selected" : "");
    optionEls[idx].className = style;
    optionEls[idx].setAttribute("title", style);
  }

  function connect(index) {
    currentIdx = index;
    current = items[index];
    label.textContent = current.label();
    const { playing, playable } = current;

    let classes = "controls " + current.type + " ";
    if (playable) {
      classes += "playable ";
      play.checked = playing;
    }

    const controls = current.controls();
    for (let cIndex = 0; cIndex < controls.length; cIndex++) {
      const control = controls[cIndex];
      classes += "control" + (cIndex + 1) + control.type + " ";
      controlShortEls[cIndex].textContent = `(${control.short})`;
      controlLongEls[cIndex].textContent = control.label;

      if (control.type === "val") {
        controlValEls[cIndex].value = control.get();
      } else if (control.type === "in") {
        fillSelect(
          controlInEls[cIndex],
          control.get(),
          items
            .map(x => x.asOption())
            .filter(x => x.value !== index && x.type !== constants.EMPTY),
          true
        );
      } else if (control.type === "type") {
        fillSelect(
          controlInEls[cIndex],
          control.get(),
          control.values.map(x => ({ value: x, label: x }))
        );
      }
    }

    controlArea.className = classes;
  }

  for (let index = 0; index < optionEls.length; index++) {
    optionEls[index].onclick = function () {
      const lastIdx = currentIdx;
      connect(index);
      setOptionStyle(lastIdx);
      setOptionStyle(index);
    };
  }

  play.onclick = function (evt) {
    if (current) {
      current.play(evt.target.checked);
      setOptionStyle(currentIdx);
    }
  };

  for (let index = 0; index < controlValEls.length; index++) {
    controlValEls[index].value = null;
    controlValEls[index].onchange = function (evt) {
      if (current) {
        current.controls()[index].set(evt.target.value);
        label.textContent = current.label();
      }
    };
  }

  for (let index = 0; index < controlInEls.length; index++) {
    controlInEls[index].onchange = function (evt) {
      if (current) {
        const val = evt.target.value;
        current.controls()[index].set(parseInt(val) || val);
        label.textContent = current.label();
      }
    };
  }

  function convert() {
    const newControl = types[nextType](currentIdx);
    lastControl.setValuesTo(newControl);
    const currentConnections = model.connections[currentIdx];
    Object.keys(currentConnections).forEach(key => {
      lastControl.connector().connect(currentConnections[key]);
      newControl.connector().connect(currentConnections[key]);
    });

    lastControl.destroy();
    items[currentIdx] = newControl;
    connect(currentIdx);
    setOptionStyle(currentIdx);
  }

  for (let index = 0; index < convertEls.length; index++) {
    convertEls[index].onclick = function (evt) {
      if (current) {
        nextType = evt.target.value;
        lastControl = items[currentIdx];
        if (lastControl.type === types[nextType] ||
          lastControl.type === constants.MICROPHONE) {
          return;
        }
        if (lastControl.type === constants.EMPTY) {
          convert();
        } else {
          controlArea.className = "controls hide";
          confirmEl.className = "confirm";
        }
      }
    };
  }

  select("button[value=change").onclick = function (evt) {
    controlArea.className = "controls";
    confirmEl.className = "confirm hide";
    convert();
  }

  select("button[value=cancel").onclick = function (evt) {
    controlArea.className = "controls";
    confirmEl.className = "confirm hide";
  }

  optionEls[0].click();
};
