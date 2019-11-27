# Simon Says

There are many ways to record and play audio on node. The `example` folder contains an implementation example.

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

https://www.youtube.com/watch?v=wiLEr6TeE58
https://github.com/Kitt-AI/snowboy
https://github.com/wanleg/snowboyPi
https://snowboy.kitt.ai/dashboard
