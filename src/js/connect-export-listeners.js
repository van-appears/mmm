const select = require("./select");
const applyCommand = require("./apply-command");
const initialiseNodes = require("./initialise-nodes");
const commandSplitter = /^([0-9]{1}) *([a-zA-Z]*) *(.*)$/;

module.exports = function connectExportListeners(model) {
  const executeCommand = applyCommand(model);
  const importButton = select("#import");
  const copyButton = select("#copy");
  const resetButton = select("#reset");
  const windowExport = select("button[value=export]");
  const contentEl = select("#content");

  function display() {
    const desc = model.items
      .map(i => i.describe().join("\n"))
      .filter(i => i)
      .join("\n");
    contentEl.value = desc;
  }

  function reset() {
    initialiseNodes(model);
  }

  windowExport.addEventListener("click", display, false);

  resetButton.addEventListener(
    "click",
    function () {
      reset();
      display();
      model.dispatch(null, "currentIdx", 0);
    },
    false
  );

  importButton.addEventListener(
    "click",
    function () {
      const lines = contentEl.value.split("\n");
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
      model.dispatch(null, "currentIdx", 0);
    },
    false
  );

  copyButton.addEventListener("click", function () {
    contentEl.select();
    contentEl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(contentEl.value);
  });
};
