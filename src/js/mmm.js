const createModel = require("./create-model");
const connectMediaStream = require("./connect-media-stream");
const connectGraphListeners = require("./connect-graph-listeners");
const connectSequencerListeners = require("./connect-sequencer-listeners");
const connectBackupListeners = require("./connect-backup-listeners");
const connectWindowsListeners = require("./connect-windows-listeners");
const initialiseNodes = require("./initialise-nodes");

window.onload = function () {
  const wrapper = document.querySelector(".wrapper");
  connectMediaStream(function (mediaStream) {
    document.body.className = "started";
    wrapper.style = "";

    const model = createModel(mediaStream);
    initialiseNodes(model);

    connectGraphListeners(model);
    connectSequencerListeners(model);
    connectBackupListeners(model);
    connectWindowsListeners(model);
  });
};
