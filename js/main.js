// js/main.js
import { getElement } from './utils/helpers.js';
import * as UIElements from './core/ui-elements.js';
import * as Themes from './core/themes.js';
import * as AudioManager from './core/audio-manager.js';
import * as Players from './features/players.js';
import * as Gallery from './features/gallery.js';
import * as Comments from './features/comments.js';
import * as EasterEggs from './features/easter-eggs.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initial element references needed globally (or passed to init functions)
    const body = document.body;
    const enterButton = getElement('enter-button');
    const welcomeOverlay = getElement('welcome-overlay');
    const animatedCards = document.querySelectorAll('.card-animate');
    const mainHeader = getElement('main-header'); // Pass to UIElements for its transitions
    const mainContentArea = getElement('main-content-area'); // Pass to UIElements for its transitions

    // Initialize core modules first
    UIElements.init(body, getElement('cursor'), getElement('sparkle-container'), getElement('toggle-ui-btn'), getElement('hide-ui-heading'), getElement('restore-ui-btn'), mainHeader, mainContentArea); // Pass mainContentArea
    AudioManager.init(getElement('background-music'), getElement('liminal-background-music'), getElement('bgmMuteButton'), getElement('sfx-volume'), getElement('click-sound-toggle'), getElement('click-sfx'), getElement('sparkle-sfx'));
    Themes.init(body, getElement('petal-container'), getElement('liminal-video-container'), getElement('liminal-background-video-blurred'), getElement('liminal-background-video-main'), getElement('settings-card'), document.querySelectorAll('.settings-tab-btn'), document.querySelectorAll('.theme-choice-btn'), getElement('effect-amount'), getElement('effect-speed'), getElement('sparkle-frequency'), getElement('card-animation-speed'), getElement('toggle-background-effects'), document.querySelectorAll('.filter-btn'), getElement('filter-intensity'), AudioManager.updateBackgroundMusicState, UIElements.getBackgroundEffectsHiddenState, UIElements.setBackgroundEffectsHidden); // Pass setBackgroundEffectsHidden

    // Initialize feature modules
    Players.init(getElement('player-prompt'), getElement('audio-player'), getElement('mp3-upload'), getElement('play-pause-btn'), getElement('seek-bar'), getElement('volume-bar'), getElement('player-mute-button'), getElement('song-title-display'), getElement('player-controls'), getElement('video-player-container'), getElement('custom-video'), getElement('video-play-pause-btn'), getElement('video-seek-bar'), getElement('video-time'), getElement('video-mute-btn'), getElement('video-volume-bar'), getElement('fullscreen-btn'), getElement('mp4-upload'), AudioManager.updateBackgroundMusicState);
    Gallery.init(getElement('gallery-grid'), getElement('open-gallery-btn'), getElement('close-gallery-btn-top'), getElement('close-gallery-btn-bottom'), getElement('in-page-gallery-modal'), getElement('main-content-area'), getElement('main-header'), getElement('lightbox-overlay'), getElement('lightbox-image'), getElement('lightbox-close-btn'), AudioManager.playSfx, getElement('click-sfx'));
    Comments.init(getElement('comment-form'), getElement('comment-log'));
    EasterEggs.init(getElement('easter-egg-button'), getElement('easter-egg-overlay'), getElement('easter-egg-content'), getElement('easter-egg-question'), getElement('easter-egg-answers'), getElement('easter-egg-result-image'), getElement('easter-egg-music'), getElement('easter-egg-right'), getElement('easter-egg-wrong'), getElement('easter-egg-two-trigger'), getElement('custom-video'), AudioManager.stopAllAudio, AudioManager.playSfx);


    // Welcome overlay functionality (remains in main.js as it's the very first app state)
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (welcomeOverlay) {
                welcomeOverlay.classList.add('hidden');
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                    // Re-enable main UI elements after welcome fade-out
                    if (mainHeader) {
                        mainHeader.style.opacity = '1';
                        mainHeader.style.pointerEvents = 'auto';
                        mainHeader.style.visibility = 'visible';
                    }
                    if (mainContentArea) { // Ensure main content is also shown
                        mainContentArea.style.opacity = '1';
                        mainContentArea.style.pointerEvents = 'auto';
                        mainContentArea.style.visibility = 'visible';
                    }
                }, 500);
            }
            AudioManager.updateBackgroundMusicState(); // Start BGM after entering
            animatedCards.forEach(card => card.classList.add('visible'));
        });
    }

    // Initial setup calls
    Themes.setTheme('sakura'); // Set initial theme on load
});