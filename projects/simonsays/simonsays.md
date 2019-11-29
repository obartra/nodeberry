# Simon Says

There are many ways to record and play audio on node. The `recording` folder contains an implementation example.

For this project there are no specific requirements other than making sure we are able to record from the microphone and playback both, audio we've recorded and audio from a file.

If you want to follow step-by-step instructions you can follow along below:

Create a package and install `node-record-lpcm16`. It allows us to write audio data into a stream. Based on their README, we can create a record function that saves into a file:

```js
const recorder = require("node-record-lpcm16");

function record(filename) {
  const file = fs.createWriteStream(filename, { encoding: "binary" });
  const recording = recorder.record({ sampleRate: 44100 });

  recording.stream().pipe(file);

  return recording;
}
```

When we are done we can call `recording.stop()` to stop recording.

For playing audio, we'll use the `play-sound` package. Similarly, we can play an audio stream like this:

```js
const player = require("play-sound")({});

function play(filename) {
  return new Promise((resolve, reject) => {
    player.play(filename, err => {
      if (err) {
        reject(new Error("Failed to play audio"));
      } else {
        resolve();
      }
    });
  });
}
```

We can now consume these two methods to coordinate recording / playback. Take a look at the `main` method on `index.js`:

```js
async function main() {
  log("🎙️  Recording");
  const ai = record(files.temp);
  await wait(duration);
  ai.stop();

  log("🎙️  Recorded", { end: true });

  log("🔊 Playing");
  await play(files.temp);

  log("🔇 Playing done", { end: true });
  log("🎵 Music");

  await play(files.end);
  log("🎵 Music", { end: true });
}
```

`log` is a utility function to make it easier to track when different events start and end. `wait` is a promisified version of `setTimeout` so that we can wait for a given number of miliseconds.

## 😴 Wake word

Let's go for extra credit. What if we only wanted to start recording _after_ a "wake word" is triggered. This behavior is similar to most voice assisstants that are triggered with words like "Alexa", "Hey Siri" or "Ok Google".

There are many speech recognition services available but many send data over the network. This would be problematic for privacy since if we want the service to work it would have to be constantly streaming audio. Instead, we'll look for offline wake word solutions.

[Snowboy](https://snowboy.kitt.ai/) is a free solution for open source projects. To get started, we'll log in and go to the [dashboard](https://snowboy.kitt.ai/dashboard) and download an activation word.

The `wakeword` folder contains an example project based on the [microphone example](https://github.com/Kitt-AI/snowboy/blob/master/examples/Node/microphone.js) snowbody provides but let's go step by step.

1. Create a new npm project (`npm init`)
1. Install `snowboy` and the library you used above to record sounds (we've used `node-record-lpcm16`)
1. Download the generated wakeword file from snowboy (it should be a file ending in `*.pmdl`)
1. Download the [resources file](https://github.com/Kitt-AI/snowboy/blob/master/resources/common.res) from the snowboy repo
1. We can now create an app that detects hotwords. This is a simplified version of `wakeword/index.js`:

```js
const record = require("node-record-lpcm16");
const { Detector, Models } = require("snowboy");

const models = new Models();

models.add({
  file: "jarvis.pmdl",
  sensitivity: "0.5",
  hotwords: "jarvis"
});

const detector = new Detector({
  resource: "common.res",
  models: models
});

detector.on("hotword", () => console.log("WORD DETECTED!"));

const mic = record.record({
  threshold: 0,
  verbose: true
});

mic.stream().pipe(detector);
```

We load the different wake word models, pass them to the detector and then use `node-record-lpcm16` (just like before) to capture microphone data. Then we tell the microphone stream to pass everything it picks up to the detector.

## 🌐 Combining with a server

We can use the trigger word to make a server call. Instead of calling `console.log("WORD DETECTED!")` we can make a request to our server and trigger, for instance, an IFTTT action. How would you change the code above to make it trigger the "Find my phone" action from the IFTTT project?
