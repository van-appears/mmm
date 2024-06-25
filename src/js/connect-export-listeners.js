const constants = require("./constants");
const select = require("./select");
const applyCommand = require("./apply-command");
const initialiseNodes = require("./initialise-nodes");
const commandSplitter = /^([0-9]{1}) *([a-zA-Z]*) *(.*)$/;
const components = require("./components");

module.exports = function connectExportListeners(model) {
  const executeCommand = applyCommand(model);
  const windowExport = select("button[value=export]");

  function display() {
    const types = model.items
      .filter(i => ![constants.EMPTY, constants.MICROPHONE].includes(i.type))
      .map(i => `${i.idx} control ${i.type}`);
    const controls = model.items
      .map(i => i.describe().join("\n"))
      .filter(i => i);
    const playing = model.items
      .filter(i => i.type !== constants.EMPTY && i.playing)
      .map(i => `${i.idx} play`);

    let sequence = components.sequencer.content.value || "";
    if (sequence.length > 0) {
      sequence =
        "\n" +
        constants.SEQUENCE_SEPARATOR +
        components.sequencer.delayField.value +
        "\n" +
        sequence;
    }

    components.backup.content.value =
      types.concat(controls).concat(playing).join("\n") + sequence;
  }

  function reset() {
    initialiseNodes(model);
    components.sequencer.delayField.value = "";
    components.sequencer.content.value = "";
  }

  components.windows.backupButton.addEventListener("click", display, false);

  components.backup.resetButton.addEventListener(
    "click",
    function () {
      reset();
      display();
      model.dispatch(null, "currentIdx", 0);
    },
    false
  );

  components.backup.importButton.addEventListener(
    "click",
    function () {
      const contentValue = components.backup.content.value;
      const [graphContent, sequencerContent] = contentValue.split(
        constants.SEQUENCE_SEPARATOR
      );

      const lines = graphContent.split("\n");
      reset();
      lines.forEach(l => {
        const pieces = l.split(";");
        pieces.forEach(p => {
          const command = commandSplitter.exec(p.trim());
          if (command) {
            const [, idx, key, value] = command;
            executeCommand(idx, key, value);
          }
        });
      });

      const [first, remainder] = sequencerContent.split(/\n(.*)/s);
      components.sequencer.delayField.value = first;
      components.sequencer.content.value = remainder;

      model.dispatch(null, "currentIdx", 0);
    },
    false
  );

  components.backup.copyButton.addEventListener("click", function () {
    const backupContent = components.backup.content;
    backupContent.select();
    backupContent.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(backupContent.value);
  });
};
