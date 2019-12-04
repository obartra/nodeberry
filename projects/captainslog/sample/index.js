const stardate = require("stardate-converter");

const { playSound } = require("./play");
const { textToSpeech, speechToText } = require("./speech");
const { wakeWord } = require("./wakeword");

let init = false;

wakeWord(async audio => {
  if (init) {
    return;
  }

  // Play a sound when the wake word is triggered (and we aren't already processing audio, `init=true`)
  playSound("beep3");
  init = true;

  // Google will read the text and genereate an mp3 file for us
  await textToSpeech(`Captain's Log, stardate ${stardate(new Date())}`);

  // Handle streams when they are closed or they fail
  const onClose = () => {
    init = false;
    transcriptionStream.destroy();
    audio.unpipe(transcriptionStream);
    // On connection end we play the end transmission sound
    playSound("communications_end_transmission");
  };

  // There's little error handling here, we just log the error on the console and close the connections
  // like we do `onClose`
  const onError = e => {
    console.error(e);
    onClose();
  };

  // Results is the results object and it contains lots of information, it returns an array of results.
  // Each result is defiened as a `SpeechRecognitionResult` you can find more information here
  // https://cloud.google.com/speech-to-text/docs/reference/rest/v1/speech/recognize#SpeechRecognitionResult
  // another option is to `console.log(JSON.stringify(results, undefined, 2))` to get a better sense of
  // the data. What's returned in the `transcript` parameter is the most likely translation
  const onData = (results, transcript) => {
    if (
      results.some(result =>
        result.alternatives.some(alt =>
          alt.transcript.includes("end transmission")
        )
      )
    ) {
      onClose();
    } else {
      console.log(transcript);
    }
  };

  // Generate the transcription stream and connect it to the audio one provided by wakeword
  transcriptionStream = speechToText(onData, onError, onClose);
  audio.pipe(transcriptionStream);
});
