import { windowComponents } from "./components";

export default function connectWindowsListeners(model) {
  const { graphButton, sequencerButton, backupButton } = windowComponents;

  graphButton.onclick = function () {
    graphButton.selected();
    sequencerButton.unselect();
    backupButton.unselect();
    model.update("window", "graph");
  };

  sequencerButton.onclick = function () {
    graphButton.unselect();
    sequencerButton.selected();
    backupButton.unselect();
    model.update("window", "sequencer");
  };

  backupButton.onclick = function () {
    graphButton.unselect();
    sequencerButton.unselect();
    backupButton.selected();
    model.update("window", "backup");
  };

  graphButton.click();
}
