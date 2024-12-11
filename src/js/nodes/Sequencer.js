import applyCommand from "../apply-command";
import constants from "../constants";

const { FALLBACK_DELAY_SECONDS, MAX_DELAY_SECONDS } = constants;
const commandSplitter = /^([0-9]{1}) *([a-zA-Z]{1,2}) *([0-9.]*)$/;
const commandSplitterNoIdx = /^([a-zA-Z]{1,2}) *([0-9.]*)$/;
const waitSplitter = /^w *([0-9.]*)(.*)$/;

class Sequencer {
  constructor(model, idx) {
    this.executeCommand = applyCommand(model);
    this.idx = idx;
    this.playing = false;
    this.delay = FALLBACK_DELAY_SECONDS;
    this.lineNum = 0;
    this.content = "";
  }

  parseDelay() {
    return (parseFloat(this.delay) || FALLBACK_DELAY_SECONDS) * 1000;
  }

  togglePlaying() {
    this.playing = !this.playing;
    if (this.playing) {
      this.timeoutId = setTimeout(
        this.processLine.bind(this),
        this.parseDelay()
      );
    } else {
      clearTimeout(this.timeoutId);
    }
  }

  processLine() {
    const lines = this.content.split("\n");
    if (this.lineNum >= lines.length) {
      this.lineNum = 0;
    }
    const pieces = (lines[this.lineNum] || "").split(";");
    for (let piece of pieces) {
      const command = commandSplitter.exec(piece.trim());
      if (command) {
        const [, idx, key, value] = command;
        this.executeCommand(idx, key, value);
        this.lastIdx = idx;
      } else {
        const command2 = commandSplitterNoIdx.exec(piece.trim());
        if (command2) {
          const [, key, value] = command2;
          this.executeCommand(this.lastIdx, key, value);
        } else {
          const waitCommand = waitSplitter.exec(piece.trim());
          if (waitCommand) {
            const [, duration, optUnit] = waitCommand;
            const delay =
              optUnit === "ms"
                ? Math.floor(parseFloat(duration))
                : Math.floor(parseFloat(duration) * 1000);

            this.lineNum++;
            this.timeoutId = setTimeout(this.processLine.bind(this), delay);
            return;
          }
        }
      }
    }

    if (this.playing) {
      this.lineNum++;
      this.timeoutId = setTimeout(
        this.processLine.bind(this),
        this.parseDelay()
      );
    }
  }

  describe() {
    return "TODO";
  }
}

export default Sequencer;
