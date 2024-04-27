const convert = require("./convert-node");
const constants = require("./constants");

const qs = id => {
  const nodes = document.querySelectorAll(id);
  return nodes.length > 1 ? nodes : nodes[0];
};

module.exports = function connectListeners(model) {
  const { items, types } = model;
  let currentIdx = null;
  let current = null;

  const controlArea = qs(".controls");
  const label = qs("#name");
  const play = qs("#play");
  const typeEl = qs("#type");
  const controlValEls = qs(".controls .control input");
  const controlInEls = qs(".controls .control select");
  const convertEls = qs(".nodes button");
  play.checked = false;

  function connect(index) {
    currentIdx = index;
    current = items[index];
    label.innerHTML = current.label();
    const { playing, playable } = current;

    let classes = "controls ";
    if (playable) {
      classes += "playable ";
      play.checked = playing;
    }

    const subtypes = current && current.subtype().values;
    if (subtypes && subtypes.length) {
      classes += "types ";
      typeEl.replaceChildren();
      for (let subtype of subtypes) {
        const option = document.createElement("option");
        option.setAttribute("value", subtype);
        if (subtype === current.subtype().get()) {
          option.setAttribute("selected", true);
        }
        option.text = subtype;
        typeEl.appendChild(option);
      }
    }

    const controls = current.controls();
    for (let cIndex = 0; cIndex < controls.length; cIndex++) {
      const control = controls[cIndex];
      classes += "control" + (cIndex + 1) + control.type + " ";
      qs("label[for=control" + (cIndex + 1) + "val]").innerHTML =
        control.label();

      if (control.type === "val") {
        controlValEls[cIndex].value = control.get();
      } else {
        controlInEls[cIndex].replaceChildren();
        const unselected = document.createElement("option");
        unselected.setAttribute("value", -1);
        unselected.text = "-";
        if (control.get() === null || control.get() === undefined) {
          unselected.setAttribute("selected", true);
        }
        controlInEls[cIndex].appendChild(unselected);

        for (let nIndex = 0; nIndex < items.length; nIndex++) {
          if (nIndex === index || items[nIndex].type === constants.EMPTY) {
            continue;
          }
          const option = document.createElement("option");
          option.setAttribute("value", nIndex);
          option.text = items[nIndex].label();
          if (control.get() === nIndex) {
            option.setAttribute("selected", true);
          }
          controlInEls[cIndex].appendChild(option);
        }
      }
    }

    controlArea.className = classes;
  }

  typeEl.onchange = function (evt) {
    if (current) {
      current.subtype().set(evt.target.value);
    }
  };

  const options = qs(".options button");
  for (let index = 0; index < options.length; index++) {
    options[index].onclick = function () {
      connect(index);
    };
  }

  play.onclick = function (evt) {
    if (current) {
      current.play(evt.target.checked); // HMMM?
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
      console.log("convert", evt.target, evt.target.value, current);
      if (current) {
        const lastControl = items[currentIdx];
        const newControl = types[evt.target.value](currentIdx);
        lastControl.setValuesTo(newControl);
        items[currentIdx] = newControl;
        connect(currentIdx);
      }
    };
  }
};
