import constants from "./constants";
import fillSelect from "./fill-select";
import { graphComponents } from "./components";

export default function connectGraphListeners(model) {
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

    graphComponents.convertButtons.forEach(button => {
      if (button.value === current.type) {
        button.selected();
      } else {
        button.unselect();
      }
    });

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
      controlComponent.time.show(false);
      controlComponent.select.show(false);

      if (control.type === "val") {
        controlComponent.input.value = control.get();
        controlComponent.input.show(true);
        controlComponent.time.value = control.getTime();
        controlComponent.time.show(true);
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
    const newControl = types[nextType](model.currentGraphIdx);
    lastControl.setValuesTo(newControl);
    const currentConnections = model.connections[model.currentGraphIdx];
    Object.keys(currentConnections).forEach(key => {
      lastControl.connector().connect(currentConnections[key]);
      newControl.connector().connect(currentConnections[key]);
    });

    lastControl.destroy();
    items[model.currentGraphIdx] = newControl;
    connectOption(model.currentGraphIdx);
    setOptionStyle(model.currentGraphIdx);
  }

  graphComponents.playButton.onclick = function (evt) {
    if (current) {
      current.play(evt.target.checked);
      setOptionStyle(model.currentGraphIdx);
    }
  };

  graphComponents.optionButtons.forEach((optionButton, index) => {
    optionButton.onclick = function () {
      const lastIdx = model.currentGraphIdx;
      model.update("currentGraphIdx", index);
      optionButton.selected();
      graphComponents.optionButtons[lastIdx].unselect();
    };
  });

  graphComponents.controls.forEach((controlComponent, index) => {
    controlComponent.select.onchange = function (evt) {
      if (current) {
        let val = parseFloat(evt.target.value);
        if (!Number.isInteger(val)) {
          val = evt.target.value;
        }
        current.controls()[index].set(val);
        graphComponents.componentLabel.textContent = current.label();
      }
    };
    controlComponent.input.onchange = function (evt) {
      if (current) {
        const val = evt.target.value;
        let numVal = parseFloat(val);
        const control = current.controls()[index];
        if (control.max && numVal && numVal > control.max) {
          numVal = control.max;
          controlComponent.input.value = numVal;
        }
        current.controls()[index].set(numVal || val);
        graphComponents.componentLabel.textContent = current.label();
      }
    };
    controlComponent.time.onchange = function (evt) {
      if (current) {
        const val = evt.target.value;
        const numVal = parseFloat(val);
        const control = current.controls()[index];
        current.controls()[index].setTime(numVal);
      }
    };
  });

  graphComponents.convertButtons.forEach((convertButton, index) => {
    convertButton.onclick = function (evt) {
      if (current) {
        nextType = evt.target.value;
        lastControl = items[model.currentGraphIdx];
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
    connectOption(model.currentGraphIdx);
  };

  model.register((obj, prop, value) => {
    if (Array.isArray(obj)) {
      setOptionStyle(prop);
    } else if (prop === "currentGraphIdx") {
      connectOption(value);
    } else if (prop === "window") {
      graphComponents.area.show(value === "graph");
    }
  });

  model.update("currentGraphIdx", 0);
}
