// js/features/easter-eggs.js
import { getElement } from '../utils/helpers.js';

let easterEggButton;
let easterEggOverlay;
let easterEggContent;
let easterEggQuestion;
let easterEggAnswers;
let easterEggResultImage;
let easterEggMusic;
let easterEggRightSfx;
let easterEggWrongSfx;
let easterEggTwoTrigger;
let videoPlayerForEasterEgg; // Reference to the main video player for the secret video

let _stopAllAudioCallback; // Callback from AudioManager to stop all sounds
let _playSfxCallback; // Callback from AudioManager to play SFX

let easterEggCounter = 0;

export function init(easterEggButtonRef, easterEggOverlayRef, easterEggContentRef, easterEggQuestionRef, easterEggAnswersRef, easterEggResultImageRef, easterEggMusicRef, easterEggRightSfxRef, easterEggWrongSfxRef, easterEggTwoTriggerRef, videoPlayerRef, stopAllAudioFn, playSfxFn) {
    easterEggButton = easterEggButtonRef;
    easterEggOverlay = easterEggOverlayRef;
    easterEggContent = easterEggContentRef;
    easterEggQuestion = easterEggQuestionRef;
    easterEggAnswers = easterEggAnswersRef;
    easterEggResultImage = easterEggResultImageRef;
    easterEggMusic = easterEggMusicRef;
    easterEggRightSfx = easterEggRightSfxRef;
    easterEggWrongSfx = easterEggWrongSfxRef;
    easterEggTwoTrigger = easterEggTwoTriggerRef;
    videoPlayerForEasterEgg = videoPlayerRef; // Get reference to main video player

    _stopAllAudioCallback = stopAllAudioFn;
    _playSfxCallback = playSfxFn;

    setupEasterEggListeners();
}

function setupEasterEggListeners() {
    if (easterEggButton) {
        easterEggButton.addEventListener('click', async () => {
            easterEggCounter++;
            if (easterEggCounter === 15) {
                // Ensure all audio/video is stopped with fades before easter egg
                if (_stopAllAudioCallback) {
                    await _stopAllAudioCallback(); 
                }

                if (easterEggOverlay) {
                    easterEggOverlay.classList.add('visible');
                    setTimeout(() => {
                        if (easterEggContent) easterEggContent.classList.add('visible');
                        if (easterEggMusic) easterEggMusic.play().catch(e => console.error("Easter egg music play failed:", e));
                    }, 5000);
                }
            }
        });
    }
    if (easterEggAnswers) {
        document.querySelectorAll('.answer-btn').forEach(button => {
            if (!button) return;
            button.addEventListener('click', () => {
                if (easterEggMusic) { easterEggMusic.pause(); easterEggMusic.currentTime = 0; }
                if (easterEggQuestion) easterEggQuestion.style.display = 'none';
                if (easterEggAnswers) easterEggAnswers.style.display = 'none';
                if (easterEggResultImage) easterEggResultImage.style.display = 'block';

                if (button.id === 'correct-answer') {
                    easterEggResultImage.src = 'assets/images/eastereggright.png';
                    if (_playSfxCallback && easterEggRightSfx) {
                        _playSfxCallback(easterEggRightSfx);
                    }
                    setTimeout(() => { location.reload(); }, 3000);
                } else {
                    easterEggResultImage.src = 'assets/images/eastereggwrong.png';
                    if (_playSfxCallback && easterEggWrongSfx) {
                        _playSfxCallback(easterEggWrongSfx);
                    }
                }
            });
        });
    }

    if (easterEggTwoTrigger && videoPlayerForEasterEgg) { // Use the passed videoPlayerForEasterEgg
        easterEggTwoTrigger.addEventListener('click', async () => {
            // Stop ALL current background and user media before playing secret video
            if (_stopAllAudioCallback) {
                await _stopAllAudioCallback();
            }

            // Revoke old object URL if any, then set new source
            if (videoPlayerForEasterEgg.currentVideoObjectURL) {
                URL.revokeObjectURL(videoPlayerForEasterEgg.currentVideoObjectURL);
                videoPlayerForEasterEgg.currentVideoObjectURL = null;
            }
            videoPlayerForEasterEgg.src = 'assets/videos/eastereggtwovideo.mp4';
            videoPlayerForEasterEgg.load();
            if (getElement('video-player-container')) getElement('video-player-container').classList.add('video-player-loading');
            
            videoPlayerForEasterEgg.play().catch(error => {
                console.error("Error playing Easter Egg 2 video:", error);
                alert("The secret video tried to play but was blocked by your browser's autoplay policy (it probably has sound!). Please click the video area to play.");
                if (getElement('video-player-container')) { getElement('video-player-container').classList.add('paused'); getElement('video-player-container').classList.remove('video-player-loading'); }
            });
        });
    }
}