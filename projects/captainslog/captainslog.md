# Captain's Log

Based on what we've learned so far, we can build a program that uses a wake word to start recording. The additional step in this project is combining playing sounds with Google Speech APIs to handle speech recognition and synthesis.

It is meant as a starting point that you can then expand on to turn it into a more complete program. If you are looking for ideas, there are some suggestions at the end.

The initial program will behave as follows:

1. Listen for the wake word
1. When detected it will say "Captain's Log, stardate [date]"
1. Record and send data to Google for translation
1. It will console.log transcribed response
1. It will stop transcribing after one minute (default timeout) or when "end transmission" is detected
1. Play a sound to indicate the transcription has completed

To get started, create a project in the Google Cloud Console. The [Getting Started](https://cloud.google.com/docs/authentication/getting-started) guide has some more details, clicking on this button will take you to the menu to generate the keys and enable the Speech-To-Text and Text-To-Speech APIs:

![](./create-account.png)

> 1. In the GCP Console, go to the Create service account key page.
> 1. From the Service account list, select New service account.
> 1. In the Service account name field, enter a name.
> 1. From the Role list, select Project > Owner.
> 1. Click Create. A JSON file that contains your key downloads to your computer.

Once you've generated the keys and activated the Speech APIs, move the downloaded JSON file into a project folder and create a `package.json`. Make sure the generated key file is gitignored so that it doesn't get committed by accident. You'll see the `package.json` start script defines the environment variable that the google packages will use to know where to read the file from. You can follow the same format (so that calling `npm start` sets the environment variable) or you can make sure it's otherwise available (see, for instance, [this article](https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255)).

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

The next step is to combine it with the Simon says projectm where we used [snowboy](https://www.npmjs.com/package/snowboy) to detect a keyword. Can you combine it with that program?

When the keyword is detected we'll want to play a sound (see the `./sounds` folder for a bunch of Star Trek-y sounds) and use Google's Text-to-Speech API to say "Captain's log, stardate XXXX".

First we need to convert the current date into the star trek's date format. Fortunately, there's an npm package for that ([stardate-converter](https://www.npmjs.com/package/stardate-converter)). We'll then build a utility that plays a sound and returns a promise when it's done. Something like this (based on Google's [nodejs-text-to-speech quickstart demo](https://github.com/googleapis/nodejs-text-to-speech/blob/master/samples/quickstart.js)):

```js
const fs = require('fs')
const player = require("play-sound")({});
const text = require("@google-cloud/text-to-speech");
const client = new text.TextToSpeechClient();

async function textToSpeech(text) {
  // Run text-to-speech conversion
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { name: "en-US-Wavenet-E", languageCode: "en-US" },
    audioConfig: { audioEncoding: "MP3" }
  });

  const fileName = `${__dirname}/temp.mp3`;
  fs.fileWriteSync(fileName, response.audioContent, 'binary');

  player.play(filename));
}
```

Getting all the different pieces to play well together can be tricky! Take a peek at the `./sample` folder if you get stuck. Feel free to use pointers from there or use it directly as a starting point to add some of the ideas for enhancements in the section below.

# Ideas for improvemments

## Easier detection of "end transmission"

What happens if the program doesn't understand "end transmission" correctly? Right now it won't stop recording.
We could make sure that similar words or sounds are also recognized. Keep in mind that the more generous we are with the number of sounds we accept, the easier it will be to also terminate the program accidentally. So we'll have to keep that balance in mind.

Right now we know we are maybe a bit too strict so one option would be to use the [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict). There's a copy of it in `sample/cmu.json` (and it's also available on [npm](https://www.npmjs.com/package/cmu-pronouncing-dictionary)). The CMU dictionary translates words into the different sounds that make up the word. For instance, from "cheese" to "CH IY Z". Also keep in mind that it's a dictionary so we may need to get creative to handle plurals and missing words or use another tool (see for instance [LOGIOS Lexicon Tool](http://www.speech.cs.cmu.edu/tools/lextool.html)).

In this case, instead of checking for "end transmission" we would convert it to its phonetic representation (`"EH1 N D T R AE0 N S M IH1 SH AH0 N"`) and compared it agains the phonetic representation of the transcribed text which we'll do on the fly.

## Multiple commands

When we say the wake word, the program is immediately triggered. This is fine because we only have one command, but, what if we had multiple?

The snowboy program can recognize multiple wake words. Let's modify the program to listen for: "time" and "captain" (hint: download models for these words and add them, the `.on("hotword")` event callback's second parameter contains the hotword triggered).

Now when we say "computer" it will switch to "listening" mode. If none of these words are heard in the next 5 seconds, revert to "inactive" state (so that the only word that activates is "computer"). For instance, this is the behavior we would implement for these interactions:

### Interaction 1

1. Say "computer"
1. Say "What **time** is it?"
1. The computer should reply "The time is XX:XX"

### Interaction 2

1. Say "computer, **captain**'s log"
1. The computer should reply "Stardate XXX" and start the previous transcription

### Interaction 3

If you say "computer" but no word is triggered within the next 5 seconds nothing happens

### Interaction 4

If you say "captain" or "time" but the wake word "computer" hasn't been detected within the last 5 seconds, nothing happens

## Store the logs

Right now the logs are kept in the terminal but what if we wanted to store them an be able to view them over time? We could set up a database and store each transcription. Feel free to use any storage solution but if you are looking for some guidance you can follow [this hackernoon tutorial](https://hackernoon.com/setting-up-node-js-with-a-database-part-1-3f2461bdd77f).

If you want to go for extra credit, since we'll need a password for the database, we can now modify the program so that when we say "computer" it instead requests the password (you could play the [sounds/enterauthorizationcode.mp3](./sounds/enterauthorizationcode.mp3) file) and send the response to the Google Speech API to validate (you can also play [sounds/commandcodesverified_ep.mp3](./sounds/commandcodesverified_ep.mp3) or [sounds/input_failed2_clean.mp3](./sounds/input_failed2_clean.mp3) on success or failure). Note that, although this is fine for our pet project, you probably don't want to be sending your passwords to Google to transcribe for anything important.
