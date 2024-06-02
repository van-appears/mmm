const connectAudio = require("./connect-audio");
const createModel = require("./create-model");
const connectWindowListeners = require("./connect-window-listeners");
const connectGraphListeners = require("./connect-graph-listeners");
const connectSequencerListeners = require("./connect-sequencer-listeners");
const connectExportListeners = require("./connect-export-listeners");
const initialiseNodes = require("./initialise-nodes");

window.onload = function () {
  const wrapper = document.querySelector(".wrapper");
  connectAudio(function (err, audio) {
    if (!err) {
      wrapper.innerHTML = "Failed to connect audio";
      wrapper.style = "";
      console.log(err);
    } else {
      document.body.className = "started";
      wrapper.style = "";

      const model = createModel();
      connectWindowListeners(model);
      connectGraphListeners(model);
      connectSequencerListeners(model);
      connectExportListeners(model);
      initialiseNodes(model, audio);
      model.dispatch(null, "currentIdx", 0);
    }
  });
};
