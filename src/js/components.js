const select = require("./select");

module.exports = {
  windows: {
    graphButton: select("button[value=graph]"),
    sequencerButton: select("button[value=sequencer]"),
    backupButton: select("button[value=export]"),
    graph: select(".graph"),
    sequencer: select(".sequencer"),
    backup: select(".export")
  },
  sequencer: {
    delayField: select("#delay"),
    startStopButton: select("#startstop"),
    content: select("#sequence")
  },
  backup: {
    importButton: select("#import"),
    copyButton: select("#copy"),
    resetButton: select("#reset"),
    content: select("#backupContent")
  }
};
