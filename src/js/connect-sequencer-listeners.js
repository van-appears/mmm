import { sequencerComponents } from "./components";

export default function connectSequencerListeners(model) {
  const { sequences } = model;

  function current() {
    return model.sequences[model.currentSeqIdx];
  }

  function showPlaying() {
    const { playing } = current();
    sequencerComponents.startStopButton.textContent = playing
      ? "Stop"
      : "Start";
  }

  function connectOption(sequence) {
    const { idx, delay, content } = sequence;
    sequencerComponents.delay.value = delay;
    sequencerComponents.content.value = content;
    sequencerComponents.optionButtons[idx].selected();
    showPlaying();
  }

  sequencerComponents.startStopButton.onclick = function () {
    const sequence = current();
    sequence.togglePlaying();
    showPlaying();
  };

  sequencerComponents.delay.onchange = function (evt) {
    const sequence = current();
    sequence.delay = evt.target.value;
  };

  sequencerComponents.content.onchange = function (evt) {
    const sequence = current();
    sequence.content = evt.target.value;
  };

  sequencerComponents.content.onkeyup = function (evt) {
    const sequence = current();
    sequence.content = evt.target.value;
  };

  sequencerComponents.optionButtons.forEach((optionButton, index) => {
    optionButton.onclick = function () {
      const sequence = current();
      sequence.content = sequencerComponents.content.value;
      sequence.delay = sequencerComponents.delay.value;

      model.update("currentSeqIdx", index);
      sequencerComponents.optionButtons[sequence.idx].unselect();
    };
  });

  model.register((obj, prop, value) => {
    if (prop === "window") {
      sequencerComponents.area.show(value === "sequencer");
    } else if (prop === "currentSeqIdx") {
      connectOption(model.sequences[value]);
    }
  });

  model.update("currentSeqIdx", 0);
}
