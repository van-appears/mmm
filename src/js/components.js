import select from "./select";

export const windowComponents = {
  graphButton: select("button[value=graph]"),
  sequencerButton: select("button[value=sequencer]"),
  backupButton: select("button[value=export]")
};

export const graphComponents = {
  area: select(".graph"),
  changeButton: select(".confirm button[value=change]"),
  cancelButton: select(".confirm button[value=cancel]"),
  playLabel: select("label[for=play]"),
  playButton: select("#play"),
  optionButtons: select(".graph .options button"),
  convertButtons: select(".nodes button"),
  controlsArea: select(".graph .controls"),
  confirmArea: select(".confirm"),
  componentLabel: select(".header .name"),
  controls: [
    {
      area: select(".graph .controls .control:nth-child(1)"),
      shortText: select(".graph .controls .control:nth-child(1) .short"),
      longText: select(".graph .controls .control:nth-child(1) .long"),
      select: select(".graph .controls .control:nth-child(1) select"),
      time: select(".graph .controls .control:nth-child(1) input:nth-child(4)"),
      input: select(".graph .controls .control:nth-child(1) input:nth-child(3)")
    },
    {
      area: select(".graph .controls .control:nth-child(2)"),
      shortText: select(".graph .controls .control:nth-child(2) .short"),
      longText: select(".graph .controls .control:nth-child(2) .long"),
      select: select(".graph .controls .control:nth-child(2) select"),
      time: select(".graph .controls .control:nth-child(2) input:nth-child(4)"),
      input: select(".graph .controls .control:nth-child(2) input:nth-child(3)")
    },
    {
      area: select(".graph .controls .control:nth-child(3)"),
      shortText: select(".graph .controls .control:nth-child(3) .short"),
      longText: select(".graph .controls .control:nth-child(3) .long"),
      select: select(".graph .controls .control:nth-child(3) select"),
      time: select(".graph .controls .control:nth-child(3) input:nth-child(4)"),
      input: select(".graph .controls .control:nth-child(3) input:nth-child(3)")
    },
    {
      area: select(".graph .controls .control:nth-child(4)"),
      shortText: select(".graph .controls .control:nth-child(4) .short"),
      longText: select(".graph .controls .control:nth-child(4) .long"),
      select: select(".graph .controls .control:nth-child(4) select"),
      time: select(".graph .controls .control:nth-child(4) input:nth-child(4)"),
      input: select(".graph .controls .control:nth-child(4) input:nth-child(3)")
    },
    {
      area: select(".graph .controls .control:nth-child(5)"),
      shortText: select(".graph .controls .control:nth-child(5) .short"),
      longText: select(".graph .controls .control:nth-child(5) .long"),
      select: select(".graph .controls .control:nth-child(5) select"),
      time: select(".graph .controls .control:nth-child(5) input:nth-child(4)"),
      input: select(".graph .controls .control:nth-child(5) input:nth-child(3)")
    },
    {
      area: select(".graph .controls .control:nth-child(6)"),
      shortText: select(".graph .controls .control:nth-child(6) .short"),
      longText: select(".graph .controls .control:nth-child(6) .long"),
      select: select(".graph .controls .control:nth-child(6) select"),
      time: select(".graph .controls .control:nth-child(6) input:nth-child(4)"),
      input: select(".graph .controls .control:nth-child(6) input:nth-child(3)")
    }
  ]
};

export const sequencerComponents = {
  area: select(".sequencer"),
  delayField: select("#delay"),
  startStopButton: select("#startstop"),
  optionButtons: select(".sequencer .options button"),
  content: select("#sequence"),
  delay: select("#delay")
};

export const backupComponents = {
  area: select(".backup"),
  importButton: select("#import"),
  copyButton: select("#copy"),
  resetButton: select("#reset"),
  content: select("#backupContent")
};
