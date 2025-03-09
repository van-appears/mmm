import applyCommand from "../apply-command";
import constants from "../constants";

const { FALLBACK_DELAY_SECONDS, MAX_DELAY_SECONDS } = constants;

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
      const pieces = piece.split(" ").map(x => x);
      const [idx, key, value, time] = pieces;
      if (idx === 'w') {
        const time = parseFloat(key);
        if (time) {
          this.lineNum++;
          this.timeoutId = setTimeout(this.processLine.bind(this), time * 1000);
          return;
        }
      } else {
        this.executeCommand(idx, key, value, time);
        this.lastIdx = idx;
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
