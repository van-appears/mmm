const connectAudio = require("./connect-audio");
const connectListeners = require("./connect-listeners");
const createModel = require("./create-model");

window.onload = function () {
  connectAudio(function (err, audio) {
    if (err) {
      //document.querySelector(".info").innerHTML =
      //  "Failed to connect to audio: " + err.message;
      console.log(err);
    } else {
      document.body.className = "started";
      const model = createModel(audio);
      connectListeners(model);
    }
  });
};
