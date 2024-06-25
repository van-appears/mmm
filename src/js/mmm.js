const createModel = require("./create-model");
const connectMediaStream = require("./connect-media-stream");
const connectWindowListeners = require("./connect-window-listeners");
const connectGraphListeners = require("./connect-graph-listeners");
const connectSequencerListeners = require("./connect-sequencer-listeners");
const connectExportListeners = require("./connect-export-listeners");
const initialiseNodes = require("./initialise-nodes");

window.onload = function () {
  const wrapper = document.querySelector(".wrapper");
  connectMediaStream(function (mediaStream) {
    document.body.className = "started";
    wrapper.style = "";

    const model = createModel(mediaStream);
    connectWindowListeners(model);
    connectGraphListeners(model);
    connectSequencerListeners(model);
    connectExportListeners(model);
    initialiseNodes(model);
    model.dispatch(null, "currentIdx", 0);
  });
};
