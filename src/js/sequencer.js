const select = require("./select");
const { FALLBACK_DELAY } = require("./constants");
const commandSplitter = /^([0-9]{1}) *([a-zA-Z]{1,2}) *([0-9.]*)$/;
const commandSplitterNoIdx = /^([a-zA-Z]{1,2}) *([0-9.]*)$/;
const waitSplitter = /^w *([0-9.]*)(.*)$/;

module.exports = function (model) {
  const linesEl = select("#sequence");
  const delay = select("#delay");
  let lineNum = 0;
  let timeoutId = null;
  let running = false;
  let lastIdx = -1;

  function executeCommand(idx, key, value) {
    if (idx < 0) {
      return;
    }

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
    } else if (control.type === "type") {
      control.set(value);
    }
  }

  function parseDelay() {
    return parseFloat(delay) || FALLBACK_DELAY;
  }

  function processLine() {
    const lines = linesEl.value.split("\n");
    if (lineNum >= lines.length) {
      lineNum = 0;
    }
    const pieces = (lines[lineNum] || "").split(";");
    for (let piece of pieces) {
      const command = commandSplitter.exec(piece.trim());
      if (command) {
        const [, idx, key, value] = command;
        executeCommand(idx, key, value);
        lastIdx = idx;
      } else {
        const command2 = commandSplitterNoIdx.exec(piece.trim());
        if (command2) {
          const [, key, value] = command2;
          executeCommand(lastIdx, key, value);
        } else {
          const waitCommand = waitSplitter.exec(piece.trim());
          if (waitCommand) {
            const [, duration, optUnit] = waitCommand;
            const delay =
              optUnit === "ms"
                ? Math.floor(duration)
                : Math.floor(duration * 1000);

            lineNum++;
            timeoutId = setTimeout(processLine, delay);
            return;
          }
        }
      }
    }

    if (running) {
      lineNum++;
      timeoutId = setTimeout(processLine, parseDelay());
    }
  }

  return {
    toggle() {
      running = !running;
      if (running) {
        timeoutId = setTimeout(processLine, parseDelay());
      } else {
        clearTimeout(timeoutId);
      }
    }
  };
};
