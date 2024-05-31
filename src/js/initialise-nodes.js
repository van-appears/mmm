const constants = require("./constants");
const createMicrophone = require("./nodes/create-microphone");
const Node = require("./nodes/Node");

module.exports = function initialiseNodes(model, stream) {
  const { audioCtx, items } = model;

  // microphone only gets initialised once
  if (!items[0]) {
    items[0] = createMicrophone(audioCtx, model, 0, stream);
  }

  for (let index = 1; index < 10; index++) {
    if (items[index]) {
      items[index].destroy();
    }
    items[index] = new Node(audioCtx, model, index, constants.EMPTY, false);
  }
};
