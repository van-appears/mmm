const constants = require("./constants");
const fillOptions = require("./fill-options");
const sequencer = require("./sequencer");
const select = require("./select");

module.exports = function connectListeners(model) {
  const { items, types, connections } = model;
  let currentIdx = null;
  let current = null;

  const wrapper = select(".wrapper");
  const controlArea = select(".controls");
  const label = select("#name");
  const play = select("#play");
  const typeEl = select("#type");
  const controlValEls = select(".controls .control input");
  const controlInEls = select(".controls .control select");
  const convertEls = select(".nodes button");
  play.checked = false;

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

    const subtypes = current && current.subtype().values;
    if (subtypes && subtypes.length) {
      classes += "types ";
      fillOptions(
        typeEl,
        current.subtype().get(),
        subtypes.map(x => ({ value: x, label: x})));
    }

    const controls = current.controls();
    for (let cIndex = 0; cIndex < controls.length; cIndex++) {
      const control = controls[cIndex];
      classes += "control" + (cIndex + 1) + control.type + " ";
      select("label[for=control" + (cIndex + 1) + "val]").textContent =
        control.label;

      if (control.type === "val") {
        controlValEls[cIndex].value = control.get();
      } else {
        fillOptions(
          controlInEls[cIndex],
          control.get(),
          items
            .map(x => x.asOption())
            .filter(x => x.value !== index && x.type !== constants.EMPTY),
          true);
      }
    }

    controlArea.className = classes;
  }

  typeEl.onchange = function (evt) {
    if (current) {
      current.subtype().set(evt.target.value);
    }
  };

  const options = select(".options button");
  for (let index = 0; index < options.length; index++) {
    options[index].onclick = function () {
      connect(index);
    };
  }

  const windowGraph = select("button[value=graph]");
  windowGraph.onclick = function () {
    wrapper.className = "wrapper graph";
  }

  const windowSequencer = select("button[value=sequencer]");
  windowSequencer.onclick = function () {
    wrapper.className = "wrapper sequencer";
  }

  play.onclick = function (evt) {
    if (current) {
      current.play(evt.target.checked);
    }
  };

  for (let index = 0; index < controlValEls.length; index++) {
    controlValEls[index].value = null;
    controlValEls[index].onchange = function (evt) {
      if (current) {
        current.controls()[index].set(evt.target.value);
      }
    };
  }

  for (let index = 0; index < controlInEls.length; index++) {
    controlInEls[index].onchange = function (evt) {
      if (current) {
        current.controls()[index].set(parseInt(evt.target.value));
      }
    };
  }

  for (let index = 0; index < convertEls.length; index++) {
    convertEls[index].onclick = function (evt) {
      if (current) {
        const lastControl = items[currentIdx];
        const newControl = types[evt.target.value](currentIdx);
        lastControl.setValuesTo(newControl);

        const currentConnections = model.connections[currentIdx];
        Object.keys(currentConnections).forEach(key => {
          lastControl.connector().connect(currentConnections[key]);
          newControl.connector().connect(currentConnections[key]);
        });

        lastControl.destroy();
        items[currentIdx] = newControl;
        connect(currentIdx);
      }
    };
  }
};
