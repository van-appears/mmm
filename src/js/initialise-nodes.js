const constants = require("./constants");
const createMicrophone = require("./nodes/create-microphone");
const Node = require("./nodes/Node");

module.exports = function initialiseNodes(model) {
  const { audioCtx, items, mediaStream } = model;

  // microphone only gets initialised once
  let startIndex = 0;
  if (mediaStream && !items[0]) {
    startIndex = 1;
    items[0] = createMicrophone(audioCtx, model, 0, mediaStream);
  }

  for (let index = startIndex; index < 10; index++) {
    if (items[index]) {
      items[index].destroy();
    }
    items[index] = new Node(audioCtx, model, index, constants.EMPTY, false);
  }
};
