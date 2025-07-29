// js/core/audio-manager.js
import { getElement } from '../utils/helpers.js'; // Assuming getElement is in helpers.js

let backgroundMusic;
let liminalBackgroundMusic;
let bgmMuteButton;
let sfxVolumeSlider;
let clickSoundToggleBtn;
let clickSound;
let sparkleSound;

// Internal state for SFX mute, controlled by this module
let _sfxMuted = false;

export function init(bgmEl, liminalBgmEl, bgmMuteBtnEl, sfxVolSliderEl, clickSfxToggleBtnEl, clickSfxEl, sparkleSfxEl) {
    backgroundMusic = bgmEl;
    liminalBackgroundMusic = liminalBgmEl;
    bgmMuteButton = bgmMuteBtnEl;
    sfxVolumeSlider = sfxVolSliderEl;
    clickSoundToggleBtn = clickSfxToggleBtnEl;
    clickSound = clickSfxEl;
    sparkleSound = sparkleSfxEl;

    setupAudioListeners();

    // Set initial loop properties and muted state
    if (backgroundMusic) backgroundMusic.loop = true;
    if (liminalBackgroundMusic) liminalBackgroundMusic.loop = false; // Looping handled by `ended` event

    // Initial button states
    if (bgmMuteButton) {
        bgmMuteButton.innerHTML = backgroundMusic && backgroundMusic.muted ? `<span>${SVG_ICONS.soundOff} Unmute</span>` : `<span>${SVG_ICONS.soundOn} Mute</span>`;
        bgmMuteButton.classList.toggle('active', backgroundMusic && backgroundMusic.muted);
    }
    if (clickSoundToggleBtn) {
        clickSoundToggleBtn.innerHTML = _sfxMuted ? `<span>${SVG_ICONS.soundOff} Unmute SFX</span>` : `<span>${SVG_ICONS.soundOn} Mute SFX</span>`;
        clickSoundToggleBtn.classList.toggle('active', !_sfxMuted);
    }
    if (sfxVolumeSlider) {
        // Apply default volume to SFX elements
        const initialSfxVolume = parseFloat(sfxVolumeSlider.value || 0.5);
        if (clickSound) clickSound.volume = initialSfxVolume;
        if (sparkleSound) sparkleSound.volume = initialSfxVolume;
    }
}

function setupAudioListeners() {
    if (bgmMuteButton) {
        bgmMuteButton.addEventListener('click', () => {
            const newMutedState = backgroundMusic ? !backgroundMusic.muted : true;
            if (backgroundMusic) backgroundMusic.muted = newMutedState;
            if (liminalBackgroundMusic) liminalBackgroundMusic.muted = newMutedState;

            if (bgmMuteButton) {
                bgmMuteButton.innerHTML = newMutedState ? `<span>${SVG_ICONS.soundOff} Unmute</span>` : `<span>${SVG_ICONS.soundOn} Mute</span>`;
                bgmMuteButton.classList.toggle('active', newMutedState);
            }
            updateBackgroundMusicState();
        });
    }

    if (sfxVolumeSlider) {
        sfxVolumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            _sfxMuted = (volume === 0);

            if (clickSound) clickSound.volume = volume;
            if (sparkleSound) sparkleSound.volume = volume;
            // Assuming easter egg SFX also use this slider
            const easterEggRightSfx = getElement('easter-egg-right');
            const easterEggWrongSfx = getElement('easter-egg-wrong');
            if (easterEggRightSfx) easterEggRightSfx.volume = volume;
            if (easterEggWrongSfx) easterEggWrongSfx.volume = volume;

            const sfxIcon = _sfxMuted ? SVG_ICONS.soundOff : SVG_ICONS.soundOn;
            const sfxText = _sfxMuted ? 'Unmute SFX' : 'Mute SFX';
            if (clickSoundToggleBtn) {
                clickSoundToggleBtn.innerHTML = `<span>${sfxIcon} ${sfxText}</span>`;
                clickSoundToggleBtn.classList.toggle('active', !_sfxMuted);
            }
        });
    }

    if (clickSoundToggleBtn) {
        clickSoundToggleBtn.addEventListener('click', () => {
            _sfxMuted = !_sfxMuted;
            const newVolume = _sfxMuted ? 0 : (sfxVolumeSlider ? parseFloat(sfxVolumeSlider.value) : 0.5);
            if (sfxVolumeSlider) {
                sfxVolumeSlider.value = newVolume;
                sfxVolumeSlider.dispatchEvent(new Event('input')); // Trigger input event to update volume and UI
            }
        });
    }

    // Listen for liminal background music to end to play next random track
    if (liminalBackgroundMusic) {
        liminalBackgroundMusic.addEventListener('ended', playRandomLiminalMusicInternal);
    }
}

// Internal function used by this module (not exported)
function playRandomLiminalMusicInternal() {
    if (!liminalBackgroundMusic || liminalMusicTracks.length === 0 || liminalBackgroundMusic.muted) return;
    const randomIndex = Math.floor(Math.random() * liminalMusicTracks.length);
    liminalBackgroundMusic.src = liminalMusicTracks[randomIndex];
    liminalBackgroundMusic.load(); // Load the new source
    liminalBackgroundMusic.loop = false; // Ensure it does not loop, so 'ended' event fires for next track
    fadeAudio(liminalBackgroundMusic, 'in', 2000); // Fade in the new random track
}


/**
 * Fades an audio element in or out over a specified duration.
 * @param {HTMLAudioElement} audioElement - The audio element to fade.
 * @param {'in'|'out'} direction - 'in' to fade up, 'out' to fade down.
 * @param {number} duration - Fade duration in milliseconds (e.g., 2000 for 2 seconds).
 * @returns {Promise<void>} A promise that resolves when the fade is complete.
 */
export function fadeAudio(audioElement, direction, duration = 2000) {
    return new Promise(resolve => {
        if (!audioElement || (audioElement.muted && direction === 'in')) { // Don't fade if element doesn't exist or is muted and fading in
            resolve();
            return;
        }

        // Stop any existing fade interval for this element
        if (audioElement._fadeInterval) {
            clearInterval(audioElement._fadeInterval);
            audioElement._fadeInterval = null;
        }

        const startVolume = audioElement.volume;
        // Target max 0.5 for BGM, 1 for user audio (assuming theme BGM volume is capped)
        const targetVolume = (direction === 'in') ? (audioElement === backgroundMusic || audioElement === liminalBackgroundMusic ? 0.5 : 1) : 0; 
        const volumeChange = targetVolume - startVolume;
        const steps = duration / 50; // Update every 50ms
        const stepAmount = volumeChange / steps;

        // If fading in and currently paused, play it immediately at current volume
        if (direction === 'in' && audioElement.paused) {
            audioElement.play().catch(e => console.error("Audio play failed during fade in:", e));
        }

        audioElement._fadeInterval = setInterval(() => {
            // Ensure volume stays within [0, 1] range to prevent IndexSizeError
            // Use a small epsilon to avoid issues with near-zero floating point numbers
            audioElement.volume = Math.max(0, Math.min(1, audioElement.volume + stepAmount));

            // Check if target volume is reached or surpassed (allowing for tiny floating point errors)
            if ((direction === 'in' && audioElement.volume >= targetVolume - 0.000001) || // Tiny buffer for 'in'
                (direction === 'out' && audioElement.volume <= targetVolume + 0.000001)) { // Tiny buffer for 'out'
                
                audioElement.volume = targetVolume; // Snap to exact target volume
                clearInterval(audioElement._fadeInterval);
                audioElement._fadeInterval = null; // Clear the interval ID
                
                if (direction === 'out') {
                    audioElement.pause();
                    // ONLY reset currentTime if it's not the backgroundMusic (which uses native loop)
                    // or if it's the liminalBackgroundMusic (which handles its own cycling)
                    if (audioElement !== backgroundMusic && audioElement !== liminalBackgroundMusic) {
                        audioElement.currentTime = 0; 
                    }
                }
                resolve(); // Resolve the promise
            }
        }, 50);
    });
}

/**
 * Manages background music based on current theme and player states.
 * Handles fading in/out when other players start/stop, and when themes change.
 */
export async function updateBackgroundMusicState() {
    const currentThemeClass = body.className.split(' ').find(cls => cls.endsWith('-theme'));
    const isLiminalTheme = currentThemeClass === 'liminal-theme';

    // Check if user's audio/video player is active (takes priority over theme BGM)
    const isUserMediaPlaying = (audioPlayer && !audioPlayer.paused && audioPlayer.src) || (videoPlayer && !videoPlayer.paused && videoPlayer.src);

    const primaryBgm = isLiminalTheme ? liminalBackgroundMusic : backgroundMusic;
    const secondaryBgm = isLiminalTheme ? backgroundMusic : liminalBackgroundMusic;

    // Condition to stop all theme BGM (e.g., if custom media is playing or BGM is muted)
    const shouldStopAllThemeBGM = isUserMediaPlaying || (primaryBgm && primaryBgm.muted) || (secondaryBgm && secondaryBgm.muted);

    if (shouldStopAllThemeBGM) {
        if (backgroundMusic && !backgroundMusic.paused) {
            await fadeAudio(backgroundMusic, 'out', 2000);
        }
        if (liminalBackgroundMusic && !liminalBackgroundMusic.paused) {
            await fadeAudio(liminalBackgroundMusic, 'out', 2000);
        }
        return; // Exit: No theme BGM should play
    }

    // --- Handle BGM transitions when no user media is playing and BGM is not muted ---

    // 1. Fade out the currently playing *secondary* background music (if any and it's not the current theme's BGM)
    // Only fade out if it's actually playing and not just a stopped track with current time > 0
    if (secondaryBgm && !secondaryBgm.paused && secondaryBgm.currentTime > 0) { 
        await fadeAudio(secondaryBgm, 'out', 2000); // Wait for fade out to complete
    }

    // 2. Start/fade in the *primary* background music
    if (primaryBgm) {
        if (isLiminalTheme && !primaryBgm.src) { // For liminal, if src is not set yet, pick a random track
            playRandomLiminalMusicInternal(); // This sets src and loads it
        } 
        
        // Ensure loop property is set correctly for the primary BGM
        if (primaryBgm === backgroundMusic) {
            primaryBgm.loop = true;
        } else if (primaryBgm === liminalBackgroundMusic) {
            primaryBgm.loop = false; // Looping handled by 'ended' event
        }

        // Only fade in if it's currently paused or its volume is less than its target (0.5)
        // This allows it to resume smoothly if it was paused.
        if (primaryBgm.paused || primaryBgm.volume < 0.5) {
            fadeAudio(primaryBgm, 'in', 2000);
        }
    }
}


// Exported functions for other modules
export function playSfx(audioElement) {
    if (!audioElement || _sfxMuted) return; // Use internal sfxMuted state
    if (audioElement.readyState >= 2) {
        audioElement.volume = parseFloat(sfxVolumeSlider ? sfxVolumeSlider.value : 0.5); // Default to 0.5 if slider missing
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.warn("SFX play failed:", e));
    }
}

export async function stopAllAudio() {
    // This is a shared utility, keep it here and make it stop everything
    await Promise.all([
        fadeAudio(backgroundMusic, 'out', 500),
        fadeAudio(liminalBackgroundMusic, 'out', 500),
        fadeAudio(audioPlayer, 'out', 500),
        fadeAudio(videoPlayer, 'out', 500)
    ]);

    // Ensure all are actually paused and reset after fades
    if (backgroundMusic) { backgroundMusic.pause(); backgroundMusic.currentTime = 0; backgroundMusic.volume = 0.5; backgroundMusic.loop = true; }
    if (liminalBackgroundMusic) { liminalBackgroundMusic.pause(); liminalBackgroundMusic.currentTime = 0; liminalBackgroundMusic.volume = 0.5; liminalBackgroundMusic.loop = false; }
    if (audioPlayer) { audioPlayer.pause(); audioPlayer.currentTime = 0; audioPlayer.volume = 1; audioPlayer.loop = false; URL.revokeObjectURL(currentAudioObjectURL); currentAudioObjectURL = null; audioPlayer.src = ''; }
    if (videoPlayer) { videoPlayer.pause(); videoPlayer.currentTime = 0; videoPlayer.volume = 1; videoPlayer.loop = false; URL.revokeObjectURL(currentVideoObjectURL); currentVideoObjectURL = null; videoPlayer.src = ''; }
}

// Export specific audio elements if other modules need direct reference (e.g., for play/pause checks)
export { audioPlayer, videoPlayer, backgroundMusic, liminalBackgroundMusic, liminalMusicTracks, liminalVideoTracks };