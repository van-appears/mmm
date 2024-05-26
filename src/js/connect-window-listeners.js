const select = require("./select");

module.exports = function connectWindowListeners() {
  const windowGraph = select("button[value=graph]");
  const windowSequencer = select("button[value=sequencer]");
  const graphEl = select(".graph");
  const sequencerEl = select(".sequencer");

  windowGraph.onclick = function () {
    windowGraph.className = "selected";
    windowSequencer.className = "";
    graphEl.className = "graph";
    sequencerEl.className = "sequencer hide";
  };

  windowSequencer.onclick = function () {
    windowGraph.className = "";
    windowSequencer.className = "selected";
    graphEl.className = "graph hide";
    sequencerEl.className = "sequencer";
  };

  windowGraph.click();
}