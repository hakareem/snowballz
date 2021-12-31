"option strict;";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var Sound;
(function (Sound) {
    const audio = {}; //HTMLAudioElement[]=[]    
    const AudioContext = window.AudioContext; // || window.webkitAudioContext;
    let dataArray;
    let audioCtx;
    function state() { return audioCtx.state; }
    Sound.state = state;
    function setup(sounds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Creating audio context");
                audioCtx = new AudioContext();
            }
            catch (e) {
                console.log(e.message);
            }
            yield Promise.all(sounds.map((s) => __awaiter(this, void 0, void 0, function* () {
                console.log("loadaudio " + s);
                loadAudio(s);
            })));
        });
    }
    Sound.setup = setup;
    function resume() {
        return __awaiter(this, void 0, void 0, function* () {
            yield audioCtx.resume();
        });
    }
    Sound.resume = resume;
    function loadAudio(f) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (fetch(`./sfx/${f}.mp3`));
            console.log("fetched " + f);
            const arrayBuffer = yield response.arrayBuffer();
            console.log("got buffer " + f);
            audioCtx.decodeAudioData(arrayBuffer, audioBuffer => {
                audio[f] = audioBuffer;
                console.log("decoded " + f);
            }, e => alert(e.message));
        });
    }
    function play(sound, v) {
        var gainNode = audioCtx.createGain();
        const source = audioCtx.createBufferSource();
        source.buffer = audio[sound];
        source.connect(gainNode);
        gainNode.gain.setValueAtTime(v, audioCtx.currentTime);
        gainNode.connect(audioCtx.destination);
        source.start();
    }
    Sound.play = play;
})(Sound || (Sound = {})); //end module
//# sourceMappingURL=sounds.js.map