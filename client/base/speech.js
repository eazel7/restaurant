require('angular')
.module(
    (module.exports = 'speech'),
    []
)
.service(
    'SpeechService',
    function ($q, $window) {
        var synth = $window.speechSynthesis;

        return {
            getVoices: function () {
                return synth.getVoices();
            },
            speak: function (voiceURI, text, volume) {
                var voice = synth.getVoices().filter(function (v) { return v.voiceURI === voiceURI; })[0];

                if (!voice) return $q.reject(new Error('no voice found for language ' + language));

                var utterance = new SpeechSynthesisUtterance(text);

                utterance.voice = voice;

                if (volume) utterance.volume = volume;

                synth.speak(utterance);
            }
        }
    }
)