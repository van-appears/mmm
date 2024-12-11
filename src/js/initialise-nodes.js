import constants from "./constants";
import createMicrophone from "./nodes/create-microphone";
import Node from "./nodes/Node";

export default function initialiseNodes(model) {
  const { audioCtx, items, mediaStream } = model;

  // microphone only gets initialised once
  let startIndex = 0;
  if (mediaStream) {
    startIndex = 1;
    if (!items[0]) {
      items[0] = createMicrophone(audioCtx, model, 0, mediaStream);
    }
  }

  for (let index = startIndex; index < 10; index++) {
    if (items[index]) {
      items[index].destroy();
    }
    items[index] = new Node(audioCtx, model, index, constants.EMPTY, false);
  }
}
