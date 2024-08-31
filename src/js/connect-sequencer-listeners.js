const select = require("./select");
const applyCommand = require("./apply-command");
const { FALLBACK_DELAY, MAX_DELAY_SECONDS } = require("./constants");
const commandSplitter = /^([0-9]{1}) *([a-zA-Z]{1,2}) *([0-9.]*)$/;
const commandSplitterNoIdx = /^([a-zA-Z]{1,2}) *([0-9.]*)$/;
const waitSplitter = /^w *([0-9.]*)(.*)$/;
const sequencerComponents = require("./components").sequencer;

module.exports = function connectSequencerListeners(model) {
  const executeCommand = applyCommand(model);
  let lineNum = 0;
  let timeoutId = null;
  let running = false;
  let lastIdx = -1;

  function parseDelay() {
    const delay = sequencerComponents.delay.value;
    return parseFloat(delay) * 1000 || FALLBACK_DELAY;
  }

  function processLine() {
    const lines = sequencerComponents.content.value.split("\n");
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
                ? Math.floor(parseFloat(duration))
                : Math.floor(parseFloat(duration) * 1000);

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

  function toggle() {
    running = !running;
    if (running) {
      sequencerComponents.startStopButton.textContent = "Stop";
      timeoutId = setTimeout(processLine, parseDelay());
    } else {
      sequencerComponents.startStopButton.textContent = "Start";
      clearTimeout(timeoutId);
    }
  }

  sequencerComponents.startStopButton.onclick = toggle;

  model.register((obj, prop, value) => {
    if (prop === "window") {
      sequencerComponents.area.show(value === "sequencer");
    }
  });
};
