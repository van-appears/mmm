const select = require("./select");

module.exports = {
  windows: {
    graphButton: select("button[value=graph]"),
    sequencerButton: select("button[value=sequencer]"),
    backupButton: select("button[value=export]")
  },
  graph: {
    area: select(".graph"),
    changeButton: select(".confirm button[value=change]"),
    cancelButton: select(".confirm button[value=cancel]"),
    playLabel: select("label[for=play]"),
    playButton: select("#play"),
    optionButtons: select(".options button"),
    convertButtons: select(".nodes button"),
    controlsArea: select(".controls"),
    confirmArea: select(".confirm"),
    componentLabel: select(".header .name"),
    controls: [
      {
        area: select(".controls .control:nth-child(1)"),
        shortText: select(".controls .control:nth-child(1) .short"),
        longText: select(".controls .control:nth-child(1) .long"),
        input: select(".controls .control:nth-child(1) input"),
        select: select(".controls .control:nth-child(1) select")
      },
      {
        area: select(".controls .control:nth-child(2)"),
        shortText: select(".controls .control:nth-child(2) .short"),
        longText: select(".controls .control:nth-child(2) .long"),
        input: select(".controls .control:nth-child(2) input"),
        select: select(".controls .control:nth-child(2) select")
      },
      {
        area: select(".controls .control:nth-child(3)"),
        shortText: select(".controls .control:nth-child(3) .short"),
        longText: select(".controls .control:nth-child(3) .long"),
        input: select(".controls .control:nth-child(3) input"),
        select: select(".controls .control:nth-child(3) select")
      },
      {
        area: select(".controls .control:nth-child(4)"),
        shortText: select(".controls .control:nth-child(4) .short"),
        longText: select(".controls .control:nth-child(4) .long"),
        input: select(".controls .control:nth-child(4) input"),
        select: select(".controls .control:nth-child(4) select")
      },
      {
        area: select(".controls .control:nth-child(5)"),
        shortText: select(".controls .control:nth-child(5) .short"),
        longText: select(".controls .control:nth-child(5) .long"),
        input: select(".controls .control:nth-child(5) input"),
        select: select(".controls .control:nth-child(5) select")
      },
      {
        area: select(".controls .control:nth-child(6)"),
        shortText: select(".controls .control:nth-child(6) .short"),
        longText: select(".controls .control:nth-child(6) .long"),
        input: select(".controls .control:nth-child(6) input"),
        select: select(".controls .control:nth-child(6) select")
      }
    ]
  },
  sequencer: {
    area: select(".sequencer"),
    delayField: select("#delay"),
    startStopButton: select("#startstop"),
    content: select("#sequence")
  },
  backup: {
    area: select(".backup"),
    importButton: select("#import"),
    copyButton: select("#copy"),
    resetButton: select("#reset"),
    content: select("#backupContent")
  }
};
