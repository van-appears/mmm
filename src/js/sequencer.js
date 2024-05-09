const select = require("./select");
const commandSplitter = /([0-9]{1}) ([a-zA-Z]{1,2}) ([0-9.]*)/;

module.exports = function(model) {
  const linesEl = select("#sequence");
  let lineNum = 0;
  let timeoutId = null;
  let running = false;

  function executeCommand(idx, key, value) {
    const controls = model.items[idx].controls() || [];
    const control = controls.find(x => x.short === key) || {};
    if (control.type === "val") {
      const parsed = parseFloat(value);
      if (parsed) {
        control.set(parsed);
      }
    } else if (control.type === "in") {
      const parsed = parseInt(value);
      if (parsed && idx !== parsed) {
        control.set(parsed);
      }
    }
  }

  function processLine() {
    const lines = linesEl.value.split("\n");
    if (lineNum >= lines.length) {
      lineNum = 0;
    }
    const pieces = (lines[lineNum] || "").split(";");
    for (let piece of pieces) {
      const command = commandSplitter.exec(piece);
      if (command) {
        const [, idx, key, value] = command;
        executeCommand(idx, key, value);
      }
    }
    if (running) {
      timeoutId = setTimeout(processLine, 100);
    }
  }

  return {
    toggle () {
      running = !running;
      if (running) {
        timeoutId = setTimeout(processLine, 100);
      } else {
        clearTimeout(timeoutId);
        running = false;
      }
    }
  };
}