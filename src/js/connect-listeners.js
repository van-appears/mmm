const constants = require("./constants");
const fillSelect = require("./fill-select");
const sequencerFactory = require("./sequencer");
const select = require("./select");

module.exports = function connectListeners(model) {
  const { items, types, connections } = model;
  sequencerFactory(model);
  let currentIdx = null;
  let current = null;
  let nextType = null;
  let lastControl = null;

  const wrapper = select(".wrapper");
  const controlArea = select(".controls");
  const confirmEl = select(".confirm");
  const label = select("#name");
  const play = select("#play");
  const controlShortEls = select(".controls .control .short");
  const controlLongEls = select(".controls .control .long");
  const controlValEls = select(".controls .control input");
  const controlInEls = select(".controls .control select");
  const convertEls = select(".nodes button");
  const optionEls = select(".options button");
  play.checked = false;

  function setOptionStyle() {
    const style = items[currentIdx].type + (items[currentIdx].playing ? " playing" : "");
    optionEls[currentIdx].className = style;
    optionEls[currentIdx].setAttribute("title", style);
  }

  function connect(index) {
    currentIdx = index;
    current = items[index];
    label.textContent = current.label();
    const { playing, playable } = current;

    let classes = "controls ";
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
      connect(index);
    };
  }

  const windowGraph = select("button[value=graph]");
  windowGraph.onclick = function () {
    wrapper.className = "wrapper graph";
  };

  const windowSequencer = select("button[value=sequencer]");
  windowSequencer.onclick = function () {
    wrapper.className = "wrapper sequencer";
  };

  play.onclick = function (evt) {
    if (current) {
      current.play(evt.target.checked);
      setOptionStyle();
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
    setOptionStyle();
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
};
