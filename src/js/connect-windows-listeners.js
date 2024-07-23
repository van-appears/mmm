const windowsComponents = require("./components").windows;

module.exports = function connectWindowsListeners(model) {
  const { graphButton, sequencerButton, backupButton } = windowsComponents;

  graphButton.addEventListener(
    "click",
    function () {
      graphButton.selected();
      sequencerButton.unselect();
      backupButton.unselect();
      model.update("window", "graph");
    },
    false
  );

  sequencerButton.addEventListener(
    "click",
    function () {
      graphButton.unselect();
      sequencerButton.selected();
      backupButton.unselect();
      model.update("window", "sequencer");
    },
    false
  );

  backupButton.addEventListener(
    "click",
    function () {
      graphButton.unselect();
      sequencerButton.unselect();
      backupButton.selected();
      model.update("window", "backup");
    },
    false
  );

  graphButton.click();
};
