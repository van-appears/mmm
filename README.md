# mmm
Mobile modular (for) messing
Designed to be a simple, quickly editable, modular synth

# components
There are three sections Graph, Sequencer and Backup.

The Graph section is for creating nodes (e.g. oscillators and filters) and setting values on them. The Sequencer section allows values to be automatically set in a looping pattern. The Backup section allows you to copy the current graph and sequencer values so that you can back them up to a file; or similarly to allow you to load values in.

## Graph
There are 10 nodes that can be altered; if you give permission for the app to use your micrphone the first is fixed to a microphone input node and only the other 9 are alterable.
There are five types:

## Sequencer
* The colour attribute the controls the filter cutoff frequency
* The filter type: all pass (i.e. no filter), low pass, high pass, or band pass
* The colour attribute that controlls the filter resonance / bandwidth

## Backup


# development
To run development mode
```
npm start
```
To create a production build
```
npm run build
```


TODO
- documentation
- notification for import / copy to clipboard
- disable graphs in destroy
- layout
- time change for val
- looper
- internal saves