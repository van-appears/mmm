const select = require("./select");
const components = require("./components");

module.exports = function connectWindowListeners() {
  const {
    graphButton,
    sequencerButton,
    backupButton,
    graph,
    sequencer,
    backup
  } = components.windows;

  graphButton.addEventListener(
    "click",
    function () {
      graphButton.className = "selected";
      sequencerButton.className = "";
      backupButton.className = "";

      graph.className = "graph";
      sequencer.className = "sequencer hide";
      backup.className = "export hide";
    },
    false
  );

  sequencerButton.addEventListener(
    "click",
    function () {
      graphButton.className = "";
      sequencerButton.className = "selected";
      backupButton.className = "";

      graph.className = "graph hide";
      sequencer.className = "sequencer";
      backup.className = "export hide";
    },
    false
  );

  backupButton.addEventListener(
    "click",
    function () {
      graphButton.className = "";
      sequencerButton.className = "";
      backupButton.className = "selected";

      graph.className = "graph hide";
      sequencer.className = "sequencer hide";
      backup.className = "export";
    },
    false
  );

  graphButton.click();
};
