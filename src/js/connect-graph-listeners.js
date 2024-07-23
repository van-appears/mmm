const constants = require("./constants");
const fillSelect = require("./fill-select");
const graphComponents = require("./components").graph;

module.exports = function connectGraphListeners(model) {
  const { items, types, connections } = model;
  let current = null;
  let nextType = null;
  let lastControl = null;

  function setOptionStyle(idx) {
    const style = items[idx].type + (items[idx].playing ? " playing" : "");
    graphComponents.optionButtons[idx].className = style;
    graphComponents.optionButtons[idx].setAttribute("title", style);
  }

  function connectOption(index) {
    current = items[index];
    graphComponents.componentLabel.textContent = current.label();
    const { playing, playable } = current;
    if (playable) {
      graphComponents.playButton.checked = playing;
      graphComponents.playButton.show(true);
      graphComponents.playLabel.show(true);
    } else {
      graphComponents.playButton.show(false);
      graphComponents.playLabel.show(false);
    }

    const controls = current.controls();
    for (let cIndex = 0; cIndex < 6; cIndex++) {
      const control = controls[cIndex];
      const controlComponent = graphComponents.controls[cIndex];
      controlComponent.area.show(false);
      if (!control) {
        continue;
      }

      controlComponent.shortText.textContent = `(${control.short})`;
      controlComponent.longText.textContent = control.label;
      controlComponent.input.show(false);
      controlComponent.select.show(false);

      if (control.type === "val") {
        controlComponent.input.value = control.get();
        controlComponent.input.show(true);
      } else if (control.type === "in") {
        fillSelect(
          controlComponent.select,
          control.get(),
          items
            .map(x => x.asOption())
            .filter(x => x.value !== index && x.type !== constants.EMPTY),
          true
        );
        controlComponent.select.show(true);
      } else if (control.type === "type") {
        fillSelect(
          controlComponent.select,
          control.get(),
          control.values.map(x => ({ value: x, label: x }))
        );
        controlComponent.select.show(true);
      }

      controlComponent.area.show(true);
    }
  }

  function convert() {
    const newControl = types[nextType](model.currentIdx);
    lastControl.setValuesTo(newControl);
    const currentConnections = model.connections[model.currentIdx];
    Object.keys(currentConnections).forEach(key => {
      lastControl.connector().connect(currentConnections[key]);
      newControl.connector().connect(currentConnections[key]);
    });

    lastControl.destroy();
    items[model.currentIdx] = newControl;
    connectOption(model.currentIdx);
    setOptionStyle(model.currentIdx);
  }

  graphComponents.playButton.onclick = function (evt) {
    if (current) {
      current.play(evt.target.checked);
      setOptionStyle(model.currentIdx);
    }
  };

  graphComponents.optionButtons.forEach((optionButton, index) => {
    optionButton.onclick = function () {
      const lastIdx = model.currentIdx;
      model.update("currentIdx", index);
      optionButton.selected();
      graphComponents.optionButtons[lastIdx].unselect();
    };
  });

  graphComponents.controls.forEach((controlComponent, index) => {
    controlComponent.select.onchange = function (evt) {
      if (current) {
        current.controls()[index].set(evt.target.value);
        graphComponents.componentLabel.textContent = current.label();
      }
    };
    controlComponent.input.onchange = function (evt) {
      if (current) {
        const val = evt.target.value;
        current.controls()[index].set(parseInt(val) || val);
        graphComponents.componentLabel.textContent = current.label();
      }
    };
  });

  graphComponents.convertButtons.forEach((convertButton, index) => {
    convertButton.onclick = function (evt) {
      if (current) {
        nextType = evt.target.value;
        lastControl = items[model.currentIdx];
        if (
          lastControl.type === nextType ||
          lastControl.type === constants.MICROPHONE
        ) {
          return;
        }
        if (lastControl.type === constants.EMPTY) {
          convert();
        } else {
          graphComponents.changeButton.textContent = "Change to " + nextType;
          graphComponents.controlsArea.show(false);
          graphComponents.confirmArea.show(true);
        }
      }
    };
  });

  graphComponents.changeButton.onclick = function (evt) {
    graphComponents.controlsArea.show(true);
    graphComponents.confirmArea.show(false);
    convert();
  };

  graphComponents.cancelButton.onclick = function (evt) {
    graphComponents.controlsArea.show(true);
    graphComponents.confirmArea.show(false);
    connectOption(model.currentIdx);
  };

  model.register((obj, prop, value) => {
    if (Array.isArray(obj)) {
      setOptionStyle(prop);
    } else if (prop === "currentIdx") {
      connectOption(value);
    } else if (prop === "window") {
      graphComponents.area.show(value === "graph");
    }
  });

  model.update("currentIdx", 0);
};
