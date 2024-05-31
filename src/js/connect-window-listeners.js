const select = require("./select");

module.exports = function connectWindowListeners() {
  const windowGraph = select("button[value=graph]");
  const windowSequencer = select("button[value=sequencer]");
  const windowExport = select("button[value=export]");
  const graphEl = select(".graph");
  const sequencerEl = select(".sequencer");
  const exportEl = select(".export");

  windowGraph.addEventListener(
    "click",
    function () {
      windowGraph.className = "selected";
      windowSequencer.className = "";
      windowExport.className = "";

      graphEl.className = "graph";
      sequencerEl.className = "sequencer hide";
      exportEl.className = "export hide";
    },
    false
  );

  windowSequencer.addEventListener(
    "click",
    function () {
      windowGraph.className = "";
      windowSequencer.className = "selected";
      windowExport.className = "";

      graphEl.className = "graph hide";
      sequencerEl.className = "sequencer";
      exportEl.className = "export hide";
    },
    false
  );

  windowExport.addEventListener(
    "click",
    function () {
      windowGraph.className = "";
      windowSequencer.className = "";
      windowExport.className = "selected";

      graphEl.className = "graph hide";
      sequencerEl.className = "sequencer hide";
      exportEl.className = "export";
    },
    false
  );

  windowGraph.click();
};
