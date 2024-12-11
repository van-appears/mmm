import constants from "./constants";
import applyCommand from "./apply-command";
import initialiseNodes from "./initialise-nodes";
import { backupComponents, sequencerComponents } from "./components";

const commandSplitter = /^([0-9]{1}) *([a-zA-Z]*) *(.*)$/;

export default function connectBackupListeners(model) {
  const executeCommand = applyCommand(model);

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

    let sequence = sequencerComponents.content.value || "";
    if (sequence.length > 0) {
      sequence =
        "\n" +
        constants.SEQUENCE_SEPARATOR +
        sequencerComponents.delayField.value +
        "\n" +
        sequence;
    }

    backupComponents.content.value =
      types.concat(controls).concat(playing).join("\n") + sequence;
  }

  function reset() {
    initialiseNodes(model);
    sequencerComponents.delayField.value = "";
    sequencerComponents.content.value = "";
  }

  backupComponents.resetButton.onclick = function () {
    reset();
    display();
    model.update("currentGraphIdx", 0);
  };

  backupComponents.importButton.onclick = function () {
    const contentValue = backupComponents.content.value;
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
    sequencerComponents.delayField.value = first;
    sequencerComponents.content.value = remainder;

    model.update("currentGraphIdx", 0);
  };

  backupComponents.copyButton.onclick = function () {
    const backupContent = backupComponents.content;
    backupContent.select();
    backupContent.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(backupContent.value);
  };

  model.register((obj, prop, value) => {
    if (prop === "window") {
      if (value === "backup") {
        backupComponents.area.show(true);
        display();
      } else {
        backupComponents.area.show(false);
      }
    }
  });
}
