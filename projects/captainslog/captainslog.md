# Captain's Log

Based on what we've learned so far we can build a program that uses a wake word to start recording. The additional changes here is combining that logic and playing sounds with using Google Speech APIs to handle speech recognition and synthesis.

This is meant as a starting point but should give you ideas on how to turn it into a more complete program, there are some suggestions at the end.

The initial program will behave as follows:

1. Listen for the wake word
1. When detected say "Captain's Log, stardate [date]"
1. Record and send data to Google for translation
1. console.log transcribed response
1. Stop transcribing after one minute (default timeout) or when "end transmission" is detected

To get started, create a project in the Google Cloud Console. The [Getting Started](https://cloud.google.com/docs/authentication/getting-started) guide has some more details, clicking on this button will take you to the menu to generate the keys and enable the Speech-To-Text and Text-To-Speech APIs:

![](./create-account.png)

> 1. In the GCP Console, go to the Create service account key page.
> 1. From the Service account list, select New service account.
> 1. In the Service account name field, enter a name.
> 1. From the Role list, select Project > Owner.
> 1. Click Create. A JSON file that contains your key downloads to your computer.

Once you've generated the keys and activated the Speech APIs, move the downloaded JSON file into a project folder and create a `package.json`. Make sure the generated key file is gitignored so that it doesn't get committed by accident. You'll see the `package.json` start script defines the environment variable that the google packages will use to know where to read the file from.

To get started with the code, the [Cloud Speech Node.js](https://github.com/googleapis/nodejs-speech) repo has a couple usage examples that are close to what we need. The following is based on the [MicrophoneStream example](https://github.com/googleapis/nodejs-speech/blob/master/samples/MicrophoneStream.js):

```js
const speech = require("@google-cloud/speech");
const recorder = require("node-record-lpcm16");
const sampleRateHertz = 16000;
const request = {
  config: {
    encoding: "LINEAR16",
    sampleRateHertz,
    languageCode: "en-US"
  },
  interimResults: true
};
const client = new speech.SpeechClient();

function getSpeechToTextStream(onData, onError) {
  return client
    .streamingRecognize(request)
    .on("error", onError)
    .on("data", onData);
}

function getAudioStream(onError) {
  return recorder
    .record({
      sampleRateHertz,
      threshold: 0,
      recordProgram: "rec",
      silence: "5.0"
    })
    .stream()
    .on("error", onError);
}

const audio = getAudioStream(handleError);
const transcription = getSpeechToTextStream(handleData, handleError);

audio.pipe(transcription);
```

Can you combine it with the wake word work we did before? Feel free to use pointers from

- wake word "Captains Log stardate XYZ"
- "Enter verification codes"
- check passwords
- if incorrect -> unauthorized message
- if correct -> start transmission
- listen for "pause log" when recording
- listen for "resume log" when paused
- listen for "end transmission"
