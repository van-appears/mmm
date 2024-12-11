import createModel from "./create-model";
import connectMediaStream from "./connect-media-stream";
import connectGraphListeners from "./connect-graph-listeners";
import connectSequencerListeners from "./connect-sequencer-listeners";
import connectBackupListeners from "./connect-backup-listeners";
import connectWindowsListeners from "./connect-windows-listeners";
import initialiseNodes from "./initialise-nodes";

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
