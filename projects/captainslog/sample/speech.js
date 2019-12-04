const text = require("@google-cloud/text-to-speech");
const speech = require("@google-cloud/speech");
const { saveOutput, playOutput } = require("./play");

/**
 * Why use paid Google services when there are free alternatives?
 *
 * That's a fair question, you can probably find offline equivalents for both
 * text-to-speech (e.g. the `say` package) and speech-to-text (e.g.
 * `pocketsphinx`) but the results aren't as good. If you are ok with these
 * trade-offs or you don't want to send your data to google, you may want to
 * consider these alternatives
 */
// speakClient is used to generate audio from text
const speakClient = new text.TextToSpeechClient();
// recognizeClient is used to turn audio into text
const recognizeClient = new speech.SpeechClient();

async function textToSpeech(text) {
  // Run text-to-speech conversion
  const [response] = await speakClient.synthesizeSpeech({
    input: { text },
    voice: { name: "en-US-Wavenet-E", languageCode: "en-US" },
    audioConfig: { audioEncoding: "MP3" }
  });

  const fileName = `audio-${new Date().getTime()}`;
  // Save a file with the mp3 data
  saveOutput(fileName, response.audioContent);

  // Read mp3 file
  playOutput(fileName);
}

function speechToText(onData, onError, onEnd) {
  // Run speech-to-text conversion
  return recognizeClient
    .streamingRecognize({
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US"
      },
      interimResults: false
    })
    .on("error", e => {
      if (e.message !== "Cannot call write after a stream was destroyed") {
        onError(e);
      }
    })
    .on("close", onEnd)
    .on("end", onEnd)
    .on("data", data => {
      if (!data.results[0] || !data.results[0].alternatives[0]) {
        return;
      }

      const transcription = data.results
        .map(result => result.alternatives[0].transcript)
        .join(", ");

      onData(data.results, transcription);
    });
}

module.exports = {
  textToSpeech,
  speechToText
};
