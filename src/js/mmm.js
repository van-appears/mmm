const connectAudio = require("./connect-audio");
const createModel = require("./create-model");
const connectWindowListeners = require("./connect-window-listeners");
const connectGraphListeners = require("./connect-graph-listeners");
const connectSequencerListeners = require("./connect-sequencer-listeners");

window.onload = function () {
  connectAudio(function (err, audio) {
    if (err) {
      //document.querySelector(".info").innerHTML =
      //  "Failed to connect to audio: " + err.message;
      console.log(err);
    } else {
      document.body.className = "started";
      const model = createModel(audio);
      connectWindowListeners(model);
      connectGraphListeners(model);
      connectSequencerListeners(model);
    }
  });
};
