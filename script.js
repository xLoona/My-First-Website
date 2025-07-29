document.addEventListener('DOMContentLoaded', () => {

    const getElement = (id) => document.getElementById(id);

    const body = document.body;
    const backgroundMusic = getElement('background-music');
    const enterButton = getElement('enter-button');
    const welcomeOverlay = getElement('welcome-overlay');
    const petalContainer = getElement('petal-container');
    const commentForm = getElement('comment-form');
    const commentLog = getElement('comment-log');
    const animatedCards = document.querySelectorAll('.card-animate');
    const cursor = getElement('cursor');
    const sparkleContainer = getElement('sparkle-container');

    const settingsCard = getElement('settings-card');
    const settingsTabButtons = document.querySelectorAll('.settings-tab-btn');

    const themeChoiceButtons = document.querySelectorAll('.theme-choice-btn');
    const effectAmountSlider = getElement('effect-amount');
    const effectSpeedSlider = getElement('effect-speed');
    const sparkleFrequencySlider = getElement('sparkle-frequency');
    const cardAnimationSpeedSlider = getElement('card-animation-speed');
    const toggleBackgroundEffectsBtn = getElement('toggle-background-effects');

    const filterChoiceButtons = document.querySelectorAll('.filter-btn');
    const filterIntensitySlider = getElement('filter-intensity');

    const bgmMuteButton = getElement('bgm-mute-button');
    const sfxVolumeSlider = getElement('sfx-volume');
    const clickSoundToggleBtn = getElement('click-sound-toggle');

    const playerPrompt = getElement('player-prompt');
    const audioPlayer = getElement('audio-player');
    const mp3Upload = getElement('mp3-upload');
    const playPauseBtn = getElement('play-pause-btn');
    const seekBar = getElement('seek-bar');
    const volumeBar = getElement('volume-bar');
    const playerMuteButton = getElement('player-mute-button');
    const songTitleDisplay = getElement('song-title-display');
    const playerControls = getElement('player-controls');

    const videoPlayerContainer = getElement('video-player-container');
    const videoPlayer = getElement('custom-video');
    const videoPlayPauseBtn = getElement('video-play-pause-btn');
    const videoSeekBar = getElement('video-seek-bar');
    const videoTimeDisplay = getElement('video-time');
    const videoMuteBtn = getElement('video-mute-btn');
    const videoVolumeBar = getElement('video-volume-bar');
    const fullscreenBtn = getElement('fullscreen-btn');
    const mp4Upload = getElement('mp4-upload');

    const easterEggButton = getElement('easter-egg-button');
    const easterEggOverlay = getElement('easter-egg-overlay');
    const easterEggContent = getElement('easter-egg-content');
    const easterEggQuestion = getElement('easter-egg-question');
    const easterEggAnswers = getElement('easter-egg-answers');
    const easterEggResultImage = getElement('easter-egg-result-image');
    const easterEggMusic = getElement('easter-egg-music');
    const easterEggRightSfx = getElement('easter-egg-right');
    const easterEggWrongSfx = getElement('easter-egg-wrong');
    const easterEggTwoTrigger = getElement('easter-egg-two-trigger');

    const clickSound = getElement('click-sfx');
    const sparkleSound = getElement('sparkle-sfx');

    const galleryGrid = getElement('gallery-grid');
    const openGalleryBtn = getElement('open-gallery-btn');
    const closeGalleryBtnTop = getElement('close-gallery-btn-top');
    const closeGalleryBtnBottom = getElement('close-gallery-btn-bottom');
    const inPageGalleryModal = getElement('in-page-gallery-modal');
    const mainContentArea = getElement('main-content-area');
    const mainHeader = getElement('main-header');

    const lightboxOverlay = getElement('lightbox-overlay');
    const lightboxImage = getElement('lightbox-image');
    const lightboxCloseBtn = getElement('lightbox-close-btn');

    const liminalBackgroundVideoContainer = getElement('liminal-video-container');
    const liminalBackgroundVideoBlurred = getElement('liminal-background-video-blurred');
    const liminalBackgroundVideoMain = getElement('liminal-background-video-main');
    const liminalBackgroundMusic = getElement('liminal-background-music');
    const toggleUiBtn = getElement('toggle-ui-btn');
    const hideUiHeading = getElement('hide-ui-heading');
    const restoreUiBtn = getElement('restore-ui-btn');

    let fadeInterval;
    let easterEggCounter = 0;
    let galleryImagesLoaded = false;

    let currentAudioObjectURL = null;
    let currentVideoObjectURL = null;

    // Default values (no localStorage)
    let currentSparkleFrequency = 0.5;
    let sfxMuted = false;
    let backgroundEffectsHidden = false; // This reflects the user's toggle preference for effects
    let uiHiddenState = false; // Default: UI is visible

    let currentFilter = 'none';
    let currentFilterIntensity = 0;

    const liminalMusicTracks = [
        "LiminalTheme/liminalbackgroundmusic1.mp3",
        "LiminalTheme/liminalbackgroundmusic2.mp3",
        "LiminalTheme/liminalbackgroundmusic3.mp3",
        "LiminalTheme/liminalbackgroundmusic4.mp3"
    ];
    const liminalVideoTracks = [
        "LiminalTheme/liminalbackgroundvideo1.mp4",
        "LiminalTheme/liminalbackgroundvideo2.mp4",
        "LiminalTheme/liminalbackgroundvideo3.mp4"
    ];

    const SVG_ICONS = {
        play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent-color)"><path d="M8 5v14l11-7z"/></svg>`,
        pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent-color)"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
        soundOn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
        soundOff: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
        sparkle: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMTAuNzUgMi43NWwxLjUgMy43NSA0LjUgMS4yNS0zLjUgMy4yNSA0LjUgNi4yNS02LjUtMS0zIDIuNzUtMy02LjI1IDIuMjUtNS02LjUtMy43NSAyLjUtNC4yNXoiLz48L3N2Zz4=`,
        theme: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"/></svg>`,
        effects: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="19" r="3"/></svg>`,
        fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
        fullscreenExit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16h3v3m-3-3L10 10m11 0h-3V7m3 3L14 14m0 7h-3v-3m3 3l-7-7m-7 7h3v-3m-3 3l7-7"/></svg>`,
        hide: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11.5-6-11.5-6s1.12-2.73 4-5.11M4.93 4.93L9.17 9.17m3.52-1.92a3 3 0 0 1 3.52 3.52M12 11.5a3.5 3.5 0 1 0-3.5 3.5M2 2l20 20"/></svg>`,
        show: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    };

    /**
     * Creates background effect elements (petals, stars, boba) within petalContainer.
     * This function's sole responsibility is to generate elements of a specific type.
     * It does NOT decide whether effects should be visible or which theme is active.
     * @param {string} effectType - 'petal', 'star', or 'boba'.
     * @param {number} amount - The number of effect elements to create.
     */
    function createBackgroundEffects(effectType, amount = 50) {
        if (!petalContainer) return;

        // Always clear container before re-populating with new effects
        petalContainer.innerHTML = ''; 

        const effectCount = parseInt(amount);
        const currentEffectSpeed = effectSpeedSlider ? parseFloat(effectSpeedSlider.value) : 15;

        for (let i = 0; i < effectCount; i++) {
            const effectElement = document.createElement('div');
            effectElement.classList.add(effectType); // Add the specific effect class

            // Apply common properties for all effects
            effectElement.style.setProperty('--delay', `${Math.random() * -20}s`); // Start with a negative delay for staggered start
            effectElement.style.setProperty('--duration', `${(Math.random() * 10 + (28 - currentEffectSpeed))}s`);

            // Apply type-specific properties
            if (effectType === 'star') {
                const isShootingStar = Math.random() > 0.95; // 5% chance for shooting star
                if (isShootingStar) {
                    effectElement.classList.remove('star'); // Remove 'star' to only have 'shooting-star'
                    effectElement.classList.add('shooting-star');
                    effectElement.style.setProperty('--start-x', `${Math.random() * 200 - 50}%`);
                    effectElement.style.setProperty('--start-y', `${Math.random() * 200 - 50}%`);
                    effectElement.style.setProperty('--duration', `${(Math.random() * 2 + (18 - currentEffectSpeed))}s`); // Faster for shooting stars
                    effectElement.style.setProperty('--delay', `${Math.random() * 10}s`);
                } else {
                    effectElement.style.setProperty('--start-x', `${Math.random() * 100}%`);
                    effectElement.style.setProperty('--start-y', `${Math.random() * 100}%`);
                    effectElement.style.setProperty('--size', `${Math.random() * 2 + 1}px`);
                }
            } else if (effectType === 'boba') {
                effectElement.style.setProperty('--start-x', `${Math.random() * 100}vw`);
                effectElement.style.setProperty('--size', `${Math.random() * 15 + 10}px`);
                effectElement.style.setProperty('--sway-amount', `${Math.random() * 20 - 10}px`);
                effectElement.style.setProperty('--rotation-amount', `${Math.random() * 90}deg`);
            } else if (effectType === 'petal') {
                effectElement.style.setProperty('--start-x', `${Math.random() * 100}vw`);
                effectElement.style.setProperty('--size', `${Math.random() * 25 + 20}px`);
                effectElement.style.setProperty('--sway-amount', `${Math.random() * 80 - 40}px`);
                effectElement.style.setProperty('--rotation-amount', `${Math.random() * 360}deg`);
            }
            petalContainer.appendChild(effectElement);
        }
    }

    /**
     * Manages which background effects are currently displayed based on theme and toggle state.
     * This is the central function for background visuals.
     */
    function updateAllBackgroundEffects() {
        const currentThemeClass = body.className.split(' ').find(cls => cls.endsWith('-theme'));
        const effectAmount = effectAmountSlider ? parseFloat(effectAmountSlider.value) : 50; // Ensure float for consistency

        // Step 1: Manage Liminal video vs. particle container visibility
        if (currentThemeClass === 'liminal-theme') {
            if (liminalBackgroundVideoContainer) liminalBackgroundVideoContainer.style.display = 'grid';
            playRandomLiminalVideo();
            // In liminal mode, particle container should always be hidden regardless of toggle
            if (body) body.classList.add('petals-hidden'); 
            if (petalContainer) petalContainer.innerHTML = ''; // Also clear particles
            return; // Exit, as liminal handles its own background entirely
        } else {
            if (liminalBackgroundVideoContainer) liminalBackgroundVideoContainer.style.display = 'none';
            // Clear liminal video sources when switching away
            if (liminalBackgroundVideoMain) liminalBackgroundVideoMain.src = '';
            if (liminalBackgroundVideoBlurred) liminalBackgroundVideoBlurred.src = '';
        }

        // Step 2: Apply/remove the `petals-hidden` class based on `backgroundEffectsHidden` state
        if (backgroundEffectsHidden) {
            // If effects are globally hidden by user, apply class
            if (body) body.classList.add('petals-hidden');
        } else {
            // If effects are NOT globally hidden, remove the class to allow display
            if (body) body.classList.remove('petals-hidden');

            // Step 3: Generate and display the correct particle effect for the current non-liminal theme
            if (currentThemeClass === 'starfield-theme') {
                createBackgroundEffects('star', effectAmount);
            } else if (currentThemeClass === 'bubbletea-theme') {
                createBackgroundEffects('boba', effectAmount);
            } else { // Default to 'petal' for Sakura and Night (and any other unspecified themes)
                createBackgroundEffects('petal', effectAmount);
            }
        }
    }


    /**
     * Fades an audio element in or out over a specified duration.
     * @param {HTMLAudioElement} audioElement - The audio element to fade.
     * @param {'in'|'out'} direction - 'in' to fade up, 'out' to fade down.
     * @param {number} duration - Fade duration in milliseconds (e.g., 2000 for 2 seconds).
     * @returns {Promise<void>} A promise that resolves when the fade is complete.
     */
    function fadeAudio(audioElement, direction, duration = 2000) {
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
            const steps = duration / 50; // Update every 50ms for smoother transition
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
                        audioElement.currentTime = 0; // Reset track after fading out
                    }
                    resolve(); // Resolve the promise
                }
            }, 50);
        });
    }

    function playRandomLiminalMusic() {
        if (!liminalBackgroundMusic || liminalMusicTracks.length === 0 || liminalBackgroundMusic.muted) return;
        const randomIndex = Math.floor(Math.random() * liminalMusicTracks.length);
        liminalBackgroundMusic.src = liminalMusicTracks[randomIndex];
        liminalBackgroundMusic.load(); 
        // Volume will be handled by fadeAudio when called by updateBackgroundMusicState
    }

    function playRandomLiminalVideo() {
        if (!liminalBackgroundVideoMain || !liminalBackgroundVideoBlurred || liminalVideoTracks.length === 0) return;
        const randomIndex = Math.floor(Math.random() * liminalVideoTracks.length);
        const selectedVideoSrc = liminalVideoTracks[randomIndex];

        liminalBackgroundVideoMain.src = selectedVideoSrc;
        liminalBackgroundVideoBlurred.src = selectedVideoSrc;

        liminalBackgroundVideoMain.muted = true;
        liminalBackgroundVideoBlurred.muted = true;
        liminalBackgroundVideoMain.playsInline = true;
        liminalBackgroundVideoBlurred.playsInline = true;

        liminalBackgroundVideoMain.play().catch(e => console.warn("Liminal main video autoplay prevented:", e));
        liminalBackgroundVideoBlurred.play().catch(e => console.warn("Liminal blurred video autoplay prevented:", e));
    }

    /**
     * Stops and resets all primary audio/video elements (background music, liminal music, custom audio/video players).
     * This provides a clean slate before playing new audio.
     */
    async function stopAllAudio() {
        // Fade out and stop background music
        if (backgroundMusic && !backgroundMusic.paused) {
            await fadeAudio(backgroundMusic, 'out', 500); // Quick fade out
        }
        if (backgroundMusic) {
            clearInterval(backgroundMusic._fadeInterval); backgroundMusic._fadeInterval = null;
            backgroundMusic.pause(); backgroundMusic.currentTime = 0; backgroundMusic.volume = 0.5; // Reset to default volume for next play
        }

        // Fade out and stop liminal background music
        if (liminalBackgroundMusic && !liminalBackgroundMusic.paused) {
            await fadeAudio(liminalBackgroundMusic, 'out', 500); // Quick fade out
        }
        if (liminalBackgroundMusic) {
            clearInterval(liminalBackgroundMusic._fadeInterval); liminalBackgroundMusic._fadeInterval = null;
            liminalBackgroundMusic.pause(); liminalBackgroundMusic.currentTime = 0; liminalBackgroundMusic.volume = 0.5; // Reset to default volume for next play
        }

        // Fade out and stop custom audio player
        if (audioPlayer && !audioPlayer.paused) {
            await fadeAudio(audioPlayer, 'out', 500);
        }
        if (audioPlayer) {
            clearInterval(audioPlayer._fadeInterval); audioPlayer._fadeInterval = null;
            audioPlayer.pause(); audioPlayer.currentTime = 0; audioPlayer.volume = 1; // Reset to full volume for next play
            if (currentAudioObjectURL) {
                URL.revokeObjectURL(currentAudioObjectURL);
                currentAudioObjectURL = null;
                audioPlayer.src = '';
            }
            if (playerPrompt) playerPrompt.style.display = 'block';
            if (songTitleDisplay) songTitleDisplay.style.display = 'none';
            if (playerControls) playerControls.style.display = 'none';
        }

        // Fade out and stop custom video player
        if (videoPlayer && !videoPlayer.paused) {
            await fadeAudio(videoPlayer, 'out', 500);
        }
        if (videoPlayer) {
            clearInterval(videoPlayer._fadeInterval); videoPlayer._fadeInterval = null;
            videoPlayer.pause(); videoPlayer.currentTime = 0; videoPlayer.volume = 1;
            if (currentVideoObjectURL) {
                URL.revokeObjectURL(currentVideoObjectURL);
                currentVideoObjectURL = null;
                videoPlayer.src = '';
            }
            if (videoPlayerContainer) {
                videoPlayerContainer.classList.remove('video-player-loading');
                videoPlayerContainer.classList.add('paused');
            }
        }
    }


    /**
     * Manages background music based on current theme and player states.
     * Handles fading in/out when other players start/stop, and when themes change.
     */
    async function updateBackgroundMusicState() {
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
        // Ensure it's actually playing and not just a stopped track with current time > 0
        if (secondaryBgm && !secondaryBgm.paused && secondaryBgm.currentTime > 0) { 
            await fadeAudio(secondaryBgm, 'out', 2000); // Wait for fade out to complete
        }

        // 2. Start/fade in the *primary* background music
        if (primaryBgm) {
            if (isLiminalTheme && !primaryBgm.src) { // For liminal, if src is not set yet, pick a random track
                playRandomLiminalMusic(); // This sets src and loads it
            } 
            
            // Only fade in if it's currently paused or its volume is less than its target (0.5)
            // This allows it to resume smoothly if it was paused.
            if (primaryBgm.paused || primaryBgm.volume < 0.5) {
                fadeAudio(primaryBgm, 'in', 2000);
            }
        }
    }


    function setTheme(theme) {
        try {
            if (!body) return;

            // Store current theme class for later comparison in updateBackgroundMusicState
            const previousThemeClass = body.className.split(' ').find(cls => cls.endsWith('-theme'));
            const wasLiminalTheme = previousThemeClass === 'liminal-theme';
            const willBeLiminalTheme = (theme === 'liminal');

            body.className = ''; // Clear existing themes
            body.classList.add(`${theme}-theme`);

            themeChoiceButtons.forEach(btn => {
                if (btn) btn.classList.toggle('active', btn.dataset.theme === theme);
            });

            const isParticleTheme = (theme === 'sakura' || theme === 'night' || theme === 'starfield' || theme === 'bubbletea');
            
            // Manage the internal `backgroundEffectsHidden` state
            if (isParticleTheme) {
                backgroundEffectsHidden = false; // Always force visible for these themes
            } else if (willBeLiminalTheme) {
                backgroundEffectsHidden = true; // Always force hidden for liminal
            } 
            // For other scenarios (e.g., if we added a new theme type later), `backgroundEffectsHidden` retains its value.

            // Update background music state. This will handle smooth transitions between background tracks.
            // This function is now responsible for deciding which BGM to play/fade.
            updateBackgroundMusicState();

            // Manage UI toggle button visibility for Liminal mode
            if (toggleUiBtn && hideUiHeading) {
                if (willBeLiminalTheme) {
                    toggleUiBtn.style.display = 'block';
                    hideUiHeading.style.display = 'block';
                    uiHiddenState = false; // Default UI visible when entering liminal
                    toggleUI(false); // Ensure UI is visible by default in liminal unless user hides it
                } else {
                    toggleUiBtn.style.display = 'none';
                    hideUiHeading.style.display = 'none';
                    if (body.classList.contains('ui-hidden')) {
                         toggleUI(false); // Force show UI when leaving liminal mode
                    }
                }
            }
            
            // Update the state of the "Toggle Background Effects" button UI
            if (toggleBackgroundEffectsBtn) {
                toggleBackgroundEffectsBtn.innerHTML = backgroundEffectsHidden ?
                    `<span>${SVG_ICONS.show} Show Effects</span>` :
                    `<span>${SVG_ICONS.hide} Hide Effects</span>`;
                // Toggle active class to indicate if effects are currently shown (active state usually means ON)
                toggleBackgroundEffectsBtn.classList.toggle('active', !backgroundEffectsHidden);
            }

            // Finally, update the actual background effects (particles or video)
            updateAllBackgroundEffects();

        } catch (error) {
            console.error("Error in setTheme function:", error);
            throw error;
        }
    }

    function playSfx(audioElement) {
        if (!audioElement || sfxMuted) return;
        if (audioElement.readyState >= 2) {
            audioElement.volume = parseFloat(sfxVolumeSlider ? sfxVolumeSlider.value : 0.5); // Default to 0.5 if slider missing
            audioElement.currentTime = 0;
            audioElement.play().catch(e => console.warn("SFX play failed:", e));
        }
    }

    function displayComments() {
        if (!commentLog) return;
        commentLog.innerHTML = ''; // Always clear the log as comments are not stored
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return '0:00';
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    function updateVideoPlayPauseButton() {
        if (!videoPlayPauseBtn || !videoPlayer) return;
        videoPlayPauseBtn.innerHTML = SVG_ICONS.play.replace(/var\(--accent-color\)/g, 'white');
        if (!videoPlayer.paused) {
            videoPlayPauseBtn.innerHTML = SVG_ICONS.pause.replace(/var\(--accent-color\)/g, 'white');
        }
    }

    function updateVideoMuteButton() {
        if (!videoMuteBtn || !videoPlayer) return;
        videoMuteBtn.innerHTML = SVG_ICONS.soundOn.replace(/var\(--accent-color\)/g, 'white');
        if (videoPlayer.muted || videoPlayer.volume === 0) {
            videoMuteBtn.innerHTML = SVG_ICONS.soundOff.replace(/var\(--accent-color\)/g, 'white');
        }
        if (videoVolumeBar) {
            videoVolumeBar.value = videoPlayer.muted ? 0 : videoPlayer.volume;
        }
    }

    function updateVideoTimeDisplay() {
        if (!videoTimeDisplay || !videoPlayer) return;
        const currentTime = formatTime(videoPlayer.currentTime);
        const totalTime = formatTime(videoPlayer.duration);
        videoTimeDisplay.textContent = `${currentTime} / ${totalTime}`;
    }

    function toggleVideoPlayPause() {
        if (!videoPlayer || !videoPlayer.src) return;
        if (videoPlayer.paused) {
            videoPlayer.play().catch(error => {
                console.error("Video play failed:", error);
                alert("Browser autoplay policy blocked video playback. Please click the video area to play.");
                if (videoPlayerContainer) videoPlayerContainer.classList.add('paused');
            });
        } else {
            videoPlayer.pause();
        }
    }

    function handleVideoLoadError(e) {
        console.error("Video Error:", e);
        let errorMessage = "An unknown video error occurred.";
        if (videoPlayer && videoPlayer.error) {
            switch (videoPlayer.error.code) {
                case MediaError.MEDIA_ERR_ABORTED: errorMessage = "Video playback aborted."; break;
                case MediaError.MEDIA_ERR_NETWORK: errorMessage = "A network error caused the video download to fail."; break;
                case MediaError.MEDIA_ERR_DECODE: errorMessage = "The video format/codec is not supported."; break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMessage = "The video could not be loaded, either because the server or network failed or because the format is not supported."; break;
            }
        }
        alert(`Video playback error: ${errorMessage}. Please try a different file.`);
        if (videoPlayerContainer) {
            videoPlayerContainer.classList.remove('video-player-loading');
            videoPlayerContainer.classList.add('paused');
        }
        if (videoPlayer) {
            if (videoPlayer.src && videoPlayer.src.startsWith('blob:')) {
                URL.revokeObjectURL(currentVideoObjectURL); // Revoke if it was a blob
            }
            videoPlayer.src = '';
            currentVideoObjectURL = null;
        }
    }

    function loadGalleryImages() {
        if (!galleryGrid || galleryImagesLoaded) return;

        const foundImages = [];
        const imageExtensions = ['.jpg', '.png', '.gif', '.jpeg', '.webp', '.avif'];
        const maxImageSearchCount = 100;

        let stopSearching = false;

        galleryGrid.innerHTML = '';

        const loadImageWithExtensions = (index) => {
            return new Promise(resolve => {
                let currentAttempt = 0;
                const tryNextExtension = () => {
                    if (currentAttempt < imageExtensions.length) {
                        const ext = imageExtensions[currentAttempt];
                        const baseFileName = `picture${index}`;
                        const fullPath = `Gallery/${baseFileName}${ext}`;

                        const img = new Image();
                        img.src = fullPath + '?' + new Date().getTime();

                        img.onload = () => {
                            const fullFileNameWithExt = img.src.split('/').pop().split('?')[0];
                            let displayedTitle = fullFileNameWithExt.substring(0, fullFileNameWithExt.lastIndexOf('.'));

                            const prefixRegex = /^picture\d+\s*/;
                            displayedTitle = displayedTitle.replace(prefixRegex, '').trim();

                            if (!displayedTitle) {
                                displayedTitle = baseFileName;
                            }

                            resolve({ src: fullPath, title: displayedTitle });
                        };
                        img.onerror = () => {
                            currentAttempt++;
                            tryNextExtension();
                        };
                    } else {
                        resolve(null);
                    }
                };
                tryNextExtension();
            });
        };

        (async () => {
            for (let i = 1; i <= maxImageSearchCount; i++) {
                if (stopSearching) {
                    break;
                }

                const imageData = await loadImageWithExtensions(i);

                if (imageData) {
                    foundImages.push(imageData);
                } else {
                    stopSearching = true;
                }
            }
            renderGalleryGrid(foundImages);
            galleryImagesLoaded = true;
        })();

        function renderGalleryGrid(imagesToDisplay) {
            if (!galleryGrid) return;

            galleryGrid.innerHTML = '';

            imagesToDisplay.forEach((imageData, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.classList.add('gallery-item');
                galleryItem.classList.add('card-animate');

                const img = document.createElement('img');
                img.src = imageData.src;
                img.alt = imageData.title;
                img.loading = 'lazy';
                img.onerror = () => {
                    if (galleryItem) galleryItem.remove();
                };

                img.addEventListener('click', () => {
                    playSfx(clickSound);
                    openLightbox(imageData.src, imageData.title);
                });

                const title = document.createElement('h3');
                title.textContent = imageData.title;

                galleryItem.append(img, title);
                galleryGrid.appendChild(galleryItem);

                galleryItem.style.setProperty('--card-index-multiplier', index * 0.5);
            });

            setTimeout(() => {
                document.querySelectorAll('#gallery-grid .card-animate').forEach(card => {
                    if (card) card.classList.add('visible');
                });
            }, 100);
        }
    }

    function openLightbox(imageSrc, imageTitle) {
        if (!lightboxOverlay || !lightboxImage) return;

        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageTitle || 'Gallery image';
        lightboxOverlay.classList.add('active');
        if (body) body.classList.add('lightbox-active');
    }

    function closeLightbox() {
        if (!lightboxOverlay) return;
        lightboxOverlay.classList.remove('active');
        if (body) body.classList.remove('lightbox-active');
        if (lightboxImage) lightboxImage.src = '';
    }

    function applyFilter(filterType, intensity) {
        let filterString = 'none';
        const htmlElement = document.documentElement;

        switch (filterType) {
            case 'sepia': filterString = `sepia(${intensity * 100}%)`; break;
            case 'grayscale': filterString = `grayscale(${intensity * 100}%)`; break;
            case 'hue-rotate': filterString = `hue-rotate(${intensity * 360}deg)`; break;
            case 'blur': filterString = `blur(${intensity * 5}px)`; break;
            case 'contrast': filterString = `contrast(${1 + intensity * 0.5}) brightness(${1 - intensity * 0.2})`; break;
            case 'none':
            default: filterString = 'none'; break;
        }
        if (htmlElement) htmlElement.style.setProperty('--global-filter', filterString);
        filterChoiceButtons.forEach(btn => {
            if (btn) btn.classList.toggle('active', btn.dataset.filter === filterType);
        });
    }

    function toggleUI(show) {
        uiHiddenState = typeof show === 'boolean' ? show : !uiHiddenState;

        if (body) {
            body.classList.toggle('ui-hidden', uiHiddenState);
        }

        if (toggleUiBtn) {
            toggleUiBtn.textContent = uiHiddenState ? "Show UI" : "Hide UI";
        }
    }

    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (welcomeOverlay) {
                welcomeOverlay.classList.add('hidden');
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                    if (mainHeader) {
                        mainHeader.style.opacity = '1';
                        mainHeader.style.pointerEvents = 'auto';
                        mainHeader.style.visibility = 'visible';
                    }
                }, 500);
            }
            updateBackgroundMusicState(); // Start BGM after entering
            if (animatedCards) {
                animatedCards.forEach(card => card.classList.add('visible'));
            }
        });
    }

    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.top = `${e.clientY}px`;
            cursor.style.left = `${e.clientX}px`;

            if (Math.random() < currentSparkleFrequency) {
                if (sparkleContainer) {
                    const sparkle = document.createElement('img');
                    sparkle.src = SVG_ICONS.sparkle;
                    sparkle.classList.add('sparkle');
                    sparkle.style.top = `${e.clientY}px`;
                    sparkle.style.left = `${e.clientX}px`;
                    sparkleContainer.appendChild(sparkle);
                    playSfx(sparkleSound);
                    setTimeout(() => sparkle.remove(), 800);
                }
            }
        });

        document.querySelectorAll('a, button, label, input[type="file"], input[type="range"], textarea, #easter-egg-two-trigger, .gallery-item img').forEach(el => {
            if (!el) return;
            el.addEventListener('mouseover', () => {
                if (cursor) {
                    cursor.style.width = '30px';
                    cursor.style.height = '30px';
                    cursor.style.borderWidth = '3px';
                }
            });
            el.addEventListener('mouseout', () => {
                if (cursor) {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                    cursor.style.borderWidth = '2px';
                }
            });
            if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.type === 'file') { // Added type='file' for click SFX
                 el.addEventListener('click', (e) => {
                    // Prevent SFX on range input change as it can be too noisy
                    if (e.currentTarget && e.currentTarget.id !== 'video-player-container' && e.currentTarget.type !== 'range') {
                        playSfx(clickSound);
                    }
                });
            }
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = getElement('comment-name');
            const textInput = getElement('comment-text');

            if (!nameInput || !textInput) return;

            if (!nameInput.value.trim() || !textInput.value.trim()) {
                alert("Please enter both your name and a comment.");
                return;
            }

            displayComments(); // This will just clear the log
            nameInput.value = '';
            textInput.value = '';
        });
    }

    if (audioPlayer) {
        if (mp3Upload) {
            mp3Upload.addEventListener('change', async (e) => { // Made async to await fade
                const file = e.target.files[0];
                if (!file) return;

                if (file.type === "audio/mpeg") {
                    if (currentAudioObjectURL) URL.revokeObjectURL(currentAudioObjectURL);
                    currentAudioObjectURL = URL.createObjectURL(file);
                    audioPlayer.src = currentAudioObjectURL;
                    audioPlayer.load(); // Load the new source

                    // Update UI elements immediately
                    if (playerPrompt) playerPrompt.style.display = 'none';
                    if (songTitleDisplay) { songTitleDisplay.textContent = file.name; songTitleDisplay.style.display = 'flex'; }
                    if (playerControls) playerControls.style.display = 'flex';
                    
                    audioPlayer.play().catch(error => console.error("MP3 play failed:", error)); // Play instantly

                    await updateBackgroundMusicState(); // Then fade out BGM in parallel
                } else {
                    alert("Please select a valid .mp3 file.");
                }
            });
        }
        if (playPauseBtn) playPauseBtn.addEventListener('click', () => { 
            if (!audioPlayer.src) return; 
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause(); 
        });
        audioPlayer.addEventListener('play', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.pause;
            updateBackgroundMusicState(); // This will fade out theme BGM
        });
        audioPlayer.addEventListener('pause', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
            // Only fade in BGM if paused mid-song and not already at start/end
            if (audioPlayer.currentTime > 0 && audioPlayer.currentTime < audioPlayer.duration) {
                updateBackgroundMusicState(); // This will fade in theme BGM
            }
        });
        audioPlayer.addEventListener('ended', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
            updateBackgroundMusicState(); // Resume BGM when custom player ends
        });
        audioPlayer.addEventListener('timeupdate', () => { if (seekBar) seekBar.value = audioPlayer.currentTime; });
        audioPlayer.addEventListener('loadedmetadata', () => { if (seekBar) seekBar.max = audioPlayer.duration; if (volumeBar) audioPlayer.volume = volumeBar.value; });
        audioPlayer.addEventListener('volumechange', () => { if (playerMuteButton) playerMuteButton.innerHTML = (audioPlayer.muted || audioPlayer.volume === 0) ? SVG_ICONS.soundOff : SVG_ICONS.soundOn; });

        if (seekBar) seekBar.addEventListener('input', () => { if (audioPlayer && audioPlayer.duration) audioPlayer.currentTime = seekBar.value; });
        if (volumeBar) volumeBar.addEventListener('input', () => { if (audioPlayer) { audioPlayer.volume = volumeBar.value; audioPlayer.muted = false; } });
        if (playerMuteButton) playerMuteButton.addEventListener('click', () => { if (audioPlayer) audioPlayer.muted = !audioPlayer.muted; });
    }

    if (videoPlayerContainer) {
        if (mp4Upload) {
            mp4Upload.addEventListener('change', async (e) => { // Made async to await fade
                const file = e.target.files[0];
                if (!file) return;

                if (file.type === "video/mp4") {
                    if (currentVideoObjectURL) URL.revokeObjectURL(currentVideoObjectURL);
                    currentVideoObjectURL = URL.createObjectURL(file);
                    videoPlayer.src = currentVideoObjectURL;
                    videoPlayer.load();
                    if (videoPlayerContainer) videoPlayerContainer.classList.add('video-player-loading');
                    
                    videoPlayer.play().catch(error => { // Play instantly
                        console.error("Video play failed:", error);
                        alert("Browser autoplay policy blocked video playback. Please click the video area to play.");
                        if (videoPlayerContainer) { videoPlayerContainer.classList.add('paused'); videoPlayerContainer.classList.remove('video-player-loading'); }
                    });
                    await updateBackgroundMusicState(); // Then fade out BGM in parallel
                } else {
                    alert("Please select a valid .mp4 file.");
                }
            });
        }

        if (videoPlayer) {
            videoPlayer.addEventListener('play', () => {
                updateVideoPlayPauseButton();
                if (videoPlayerContainer) videoPlayerContainer.classList.remove('paused');
                if (videoPlayerContainer) videoPlayerContainer.classList.remove('video-player-loading');
                updateBackgroundMusicState(); // This will fade out theme BGM
            });
            videoPlayer.addEventListener('pause', () => {
                updateVideoPlayPauseButton();
                if (videoPlayerContainer) videoPlayerContainer.classList.add('paused');
                // Only fade in BGM if paused mid-video and not already at start/end
                if (videoPlayer.currentTime > 0 && videoPlayer.currentTime < videoPlayer.duration) {
                    updateBackgroundMusicState(); // This will fade in theme BGM
                }
            });
            videoPlayer.addEventListener('ended', () => {
                updateVideoPlayPauseButton();
                if (videoPlayerContainer) videoPlayerContainer.classList.add('paused');
                updateBackgroundMusicState(); // Resume BGM when custom player ends
            });
            videoPlayer.addEventListener('timeupdate', () => { if (videoSeekBar) { videoSeekBar.value = videoPlayer.currentTime; } ; updateVideoTimeDisplay(); });
            videoPlayer.addEventListener('loadedmetadata', () => { if (videoSeekBar) { videoSeekBar.max = videoPlayer.duration; if (volumeBar) videoPlayer.volume = videoVolumeBar.value; } }); // Fixed: volumeBar was missing on loadedmetadata
            videoPlayer.addEventListener('volumechange', () => { if (videoMuteBtn) videoMuteBtn.innerHTML = (videoPlayer.muted || videoPlayer.volume === 0) ? SVG_ICONS.soundOff : SVG_ICONS.soundOn; });
            videoPlayer.addEventListener('waiting', () => { if (videoPlayerContainer) videoPlayerContainer.classList.add('video-player-loading'); });
            videoPlayer.addEventListener('playing', () => { if (videoPlayerContainer) videoPlayerContainer.classList.remove('video-player-loading'); });
            videoPlayer.addEventListener('error', handleVideoLoadError);
        }

        if (videoPlayPauseBtn) videoPlayPauseBtn.addEventListener('click', toggleVideoPlayPause);
        if (videoPlayerContainer) {
            videoPlayerContainer.addEventListener('click', (e) => {
                const videoControls = getElement('video-controls');
                if (videoPlayer && videoPlayer.src && videoControls && !videoControls.contains(e.target)) {
                    toggleVideoPlayPause();
                }
            });
        }
        if (videoSeekBar) videoSeekBar.addEventListener('input', () => { if (videoPlayer && videoPlayer.src && videoPlayer.duration) videoPlayer.currentTime = videoSeekBar.value; });
        if (videoMuteBtn) videoMuteBtn.addEventListener('click', () => { if (videoPlayer && videoPlayer.src) videoPlayer.muted = !videoPlayer.muted; updateVideoMuteButton(); });
        if (videoVolumeBar) videoVolumeBar.addEventListener('input', () => { if (videoPlayer && videoPlayer.src) { videoPlayer.volume = videoVolumeBar.value; videoPlayer.muted = false; } ; updateVideoMuteButton(); });
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (videoPlayer) {
                    if (document.fullscreenElement) { document.exitFullscreen(); }
                    else if (videoPlayer.requestFullscreen) { videoPlayer.requestFullscreen(); }
                    else if (videoPlayer.webkitRequestFullscreen) { videoPlayer.webkitRequestFullscreen(); }
                    else if (videoPlayer.msRequestFullscreen) { videoPlayer.msRequestFullscreen(); }
                }
            });
            document.addEventListener('fullscreenchange', () => {
                if (fullscreenBtn) {
                    if (document.fullscreenElement) { fullscreenBtn.innerHTML = SVG_ICONS.fullscreenExit; }
                    else { fullscreenBtn.innerHTML = SVG_ICONS.fullscreen; }
                }
            });
        }
    }

    if (easterEggButton) {
        easterEggButton.addEventListener('click', async () => { // Made async to await fades
            easterEggCounter++;
            if (easterEggCounter === 15) {
                // Ensure all audio/video is stopped with fades before easter egg
                await stopAllAudio(); 

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
                    easterEggResultImage.src = 'eastereggright.png';
                    playSfx(easterEggRightSfx);
                    setTimeout(() => { location.reload(); }, 3000);
                } else {
                    easterEggResultImage.src = 'eastereggwrong.png';
                    playSfx(easterEggWrongSfx);
                }
            });
        });
    }

    if (easterEggTwoTrigger && videoPlayer) {
        easterEggTwoTrigger.addEventListener('click', async () => { // Made async to await fades
            // Stop ALL current background and user media before playing secret video
            await stopAllAudio();

            if (currentVideoObjectURL) URL.revokeObjectURL(currentVideoObjectURL);
            videoPlayer.src = 'eastereggtwovideo.mp4';
            currentVideoObjectURL = null;
            videoPlayer.load();
            if (videoPlayerContainer) videoPlayerContainer.classList.add('video-player-loading');
            videoPlayer.play().catch(error => {
                console.error("Error playing Easter Egg 2 video:", error);
                alert("The secret video tried to play but was blocked by your browser's autoplay policy (it probably has sound!). Please click the video area to play.");
                if (videoPlayerContainer) { videoPlayerContainer.classList.add('paused'); videoPlayerContainer.classList.remove('video-player-loading'); }
            });
        });
    }

    settingsTabButtons.forEach(button => {
        if (!button) return;
        button.addEventListener('click', () => {
            const setting = button.dataset.setting;
            const targetPanel = getElement(`${setting}-settings`);

            if (!settingsCard || !targetPanel) return;

            if (button.classList.contains('active')) {
                settingsCard.classList.remove('settings-open');
                button.classList.remove('active');
            } else {
                settingsTabButtons.forEach(btn => { if (btn) btn.classList.remove('active'); });
                button.classList.add('active');

                document.querySelectorAll('.settings-panel').forEach(p => { if (p) p.classList.remove('active'); });
                targetPanel.classList.add('active');
                settingsCard.classList.add('settings-open');
            }
        });
    });

    themeChoiceButtons.forEach(button => {
        if (!button) return;
        button.addEventListener('click', () => setTheme(button.dataset.theme));
    });

    if (effectAmountSlider) {
        effectAmountSlider.addEventListener('input', (e) => {
            updateAllBackgroundEffects(); 
        });
    }
    if (effectSpeedSlider) {
        effectSpeedSlider.addEventListener('input', (e) => {
            updateAllBackgroundEffects();
        });
    }
    if (sparkleFrequencySlider) {
        sparkleFrequencySlider.addEventListener('input', (e) => {
            currentSparkleFrequency = parseFloat(e.target.value);
        });
    }
    if (cardAnimationSpeedSlider) {
        cardAnimationSpeedSlider.addEventListener('input', (e) => {
            const delayValue = (100 - parseFloat(e.target.value)) / 100;
            document.documentElement.style.setProperty('--card-animation-base-delay', `${delayValue * 0.2}s`);
        });
    }
    if (toggleBackgroundEffectsBtn) {
        toggleBackgroundEffectsBtn.addEventListener('click', () => {
            backgroundEffectsHidden = !backgroundEffectsHidden;
            
            toggleBackgroundEffectsBtn.innerHTML = backgroundEffectsHidden ?
                `<span>${SVG_ICONS.show} Show Effects</span>` :
                `<span>${SVG_ICONS.hide} Hide Effects</span>`;
            toggleBackgroundEffectsBtn.classList.toggle('active', !backgroundEffectsHidden);

            updateAllBackgroundEffects();
        });
    }

    if (filterChoiceButtons && filterIntensitySlider) {
        filterChoiceButtons.forEach(button => {
            if (!button) return;
            button.addEventListener('click', () => {
                currentFilter = button.dataset.filter;
                applyFilter(currentFilter, parseFloat(filterIntensitySlider.value));
            });
        });
        filterIntensitySlider.addEventListener('input', (e) => {
            currentFilterIntensity = parseFloat(e.target.value);
            applyFilter(currentFilter, currentFilterIntensity);
        });
    }

    if (bgmMuteButton) {
        bgmMuteButton.addEventListener('click', () => {
            // Toggle muted state directly on audio elements
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

            sfxMuted = (volume === 0);

            if (clickSound) clickSound.volume = volume;
            if (sparkleSound) sparkleSound.volume = volume;
            if (easterEggRightSfx) easterEggRightSfx.volume = volume;
            if (easterEggWrongSfx) easterEggWrongSfx.volume = volume;

            const sfxIcon = sfxMuted ? SVG_ICONS.soundOff : SVG_ICONS.soundOn;
            const sfxText = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
            if (clickSoundToggleBtn) {
                clickSoundToggleBtn.innerHTML = `<span>${sfxIcon} ${sfxText}</span>`;
                clickSoundToggleBtn.classList.toggle('active', !sfxMuted);
            }
        });
    }
    if (clickSoundToggleBtn) {
        clickSoundToggleBtn.addEventListener('click', () => {
            sfxMuted = !sfxMuted;
            const newVolume = sfxMuted ? 0 : (sfxVolumeSlider ? parseFloat(sfxVolumeSlider.value) : 0.5);
            if (sfxVolumeSlider) {
                sfxVolumeSlider.value = newVolume;
                sfxVolumeSlider.dispatchEvent(new Event('input')); // Trigger input event to update volume and UI
            }
        });
    }

    if (openGalleryBtn && inPageGalleryModal && mainContentArea && mainHeader) {
        openGalleryBtn.addEventListener('click', () => {
            playSfx(clickSound);
            if (mainContentArea) {
                mainContentArea.style.opacity = '0';
                mainContentArea.style.pointerEvents = 'none';
            }
            if (mainHeader) {
                mainHeader.style.opacity = '0';
                mainHeader.style.pointerEvents = 'none';
                mainHeader.style.visibility = 'hidden';
            }

            if (body) body.classList.add('gallery-active');

            if (inPageGalleryModal) {
                setTimeout(() => {
                    inPageGalleryModal.classList.add('active');
                    if (!galleryImagesLoaded) {
                        loadGalleryImages();
                    }
                    inPageGalleryModal.scrollTop = 0;
                }, 500);
            }
        });
    }

    if (closeGalleryBtnTop && closeGalleryBtnBottom && inPageGalleryModal && mainContentArea && mainHeader) {
        const closeGallery = () => {
            playSfx(clickSound);
            if (inPageGalleryModal) inPageGalleryModal.classList.remove('active');
            if (body) body.classList.remove('gallery-active');

            if (mainContentArea && mainHeader) {
                setTimeout(() => {
                    mainContentArea.style.opacity = '1';
                    mainContentArea.style.pointerEvents = 'auto';
                    mainHeader.style.opacity = '1';
                    mainHeader.style.pointerEvents = 'auto';
                    mainHeader.style.visibility = 'visible';
                }, 500);
            }
        };
        if (closeGalleryBtnTop) closeGalleryBtnTop.addEventListener('click', closeGallery);
        if (closeGalleryBtnBottom) closeGalleryBtnBottom.addEventListener('click', closeGallery);
    }

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', () => {
            playSfx(clickSound);
            closeLightbox();
        });
    }
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                playSfx(clickSound);
                closeLightbox();
            }
        });
    }

    if (liminalBackgroundMusic) {
        liminalBackgroundMusic.addEventListener('ended', playRandomLiminalMusic);
    }
    if (liminalBackgroundVideoMain && liminalBackgroundVideoBlurred) {
        liminalBackgroundVideoMain.addEventListener('ended', playRandomLiminalVideo);
        liminalBackgroundVideoMain.addEventListener('error', playRandomLiminalVideo);
        liminalBackgroundVideoMain.addEventListener('timeupdate', () => {
            if (Math.abs(liminalBackgroundVideoMain.currentTime - liminalBackgroundVideoBlurred.currentTime) > 0.1) {
                liminalBackgroundVideoBlurred.currentTime = liminalBackgroundVideoMain.currentTime;
            }
        });
    }

    if (toggleUiBtn) {
        toggleUiBtn.addEventListener('click', () => {
            playSfx(clickSound);
            toggleUI();
        });
    }
    if (restoreUiBtn) {
        restoreUiBtn.addEventListener('click', () => {
            playSfx(clickSound);
            toggleUI(false);
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body && body.classList.contains('liminal-theme')) {
            playSfx(clickSound);
            toggleUI();
        }
    });

    function init() {
        try {
            // Initialize with default values
            if (effectAmountSlider) {
                effectAmountSlider.value = 50;
            }
            if (effectSpeedSlider) {
                effectSpeedSlider.value = 15;
            }
            currentSparkleFrequency = 0.5;
            if (sparkleFrequencySlider) sparkleFrequencySlider.value = currentSparkleFrequency;

            if (cardAnimationSpeedSlider) {
                cardAnimationSpeedSlider.value = 50;
                const delayValue = (100 - parseFloat(cardAnimationSpeedSlider.value)) / 100;
                document.documentElement.style.setProperty('--card-animation-base-delay', `${delayValue * 0.2}s`);
            } else {
                document.documentElement.style.setProperty('--card-animation-base-delay', `0.1s`);
            }

            // Set default theme (this will trigger updateAllBackgroundEffects and BGM logic)
            setTheme('sakura'); 

            // Initialize background effects hidden state and button UI
            if (toggleBackgroundEffectsBtn) {
                toggleBackgroundEffectsBtn.innerHTML = backgroundEffectsHidden ?
                    `<span>${SVG_ICONS.show} Show Effects</span>` :
                    `<span>${SVG_ICONS.hide} Hide Effects</span>`;
                toggleBackgroundEffectsBtn.classList.toggle('active', !backgroundEffectsHidden);
            }

            // Initialize filter settings
            currentFilter = 'none';
            currentFilterIntensity = 0;
            if (filterIntensitySlider) filterIntensitySlider.value = currentFilterIntensity;
            applyFilter(currentFilter, currentFilterIntensity);

            // Initialize sound settings
            if (backgroundMusic) backgroundMusic.muted = false; // Default: BGM unmuted
            if (liminalBackgroundMusic) liminalBackgroundMusic.muted = false; // Default: BGM unmuted
            if (bgmMuteButton) {
                bgmMuteButton.innerHTML = `<span>${SVG_ICONS.soundOn} Mute</span>`;
                bgmMuteButton.classList.remove('active');
            }

            sfxMuted = false; // Default: SFX unmuted
            if (sfxVolumeSlider) sfxVolumeSlider.value = 0.5; // Default SFX volume

            if (clickSound || sparkleSound || easterEggRightSfx || easterEggWrongSfx) {
                setTimeout(() => {
                    const volume = sfxMuted ? 0 : (sfxVolumeSlider ? parseFloat(sfxVolumeSlider.value) : 0.5);
                    if (clickSound) clickSound.volume = volume;
                    if (sparkleSound) sparkleSound.volume = volume;
                    if (easterEggRightSfx) easterEggRightSfx.volume = volume;
                    if (easterEggWrongSfx) easterEggWrongSfx.volume = volume;

                    if (clickSoundToggleBtn) {
                        const sfxIcon = sfxMuted ? SVG_ICONS.soundOff : SVG_ICONS.soundOn;
                        const sfxText = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
                        clickSoundToggleBtn.innerHTML = `<span>${sfxIcon} ${sfxText}</span>`;
                        clickSoundToggleBtn.classList.toggle('active', !sfxMuted);
                    }
                }, 100);
            }

            // Initialize audio player buttons/display
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
            if (playerMuteButton) playerMuteButton.innerHTML = SVG_ICONS.soundOn;
            if (songTitleDisplay) songTitleDisplay.style.display = 'none';
            if (playerControls) playerControls.style.display = 'none';

            // Initialize video player buttons/display
            if (videoPlayer) {
                updateVideoPlayPauseButton();
                updateVideoMuteButton();
                updateVideoTimeDisplay();
                if (fullscreenBtn) fullscreenBtn.innerHTML = SVG_ICONS.fullscreen;
            }

            // Set SVG icons for settings tab buttons
            const themeBtn = document.querySelector('[data-setting="theme"]');
            if (themeBtn) themeBtn.innerHTML = SVG_ICONS.theme;
            const effectsBtn = document.querySelector('[data-setting="effects"]');
            if (effectsBtn) effectsBtn.innerHTML = SVG_ICONS.effects;
            const soundBtn = document.querySelector('[data-setting="sound"]');
            if (soundBtn) soundBtn.innerHTML = SVG_ICONS.soundOn;

            // Ensure the gallery modal and lightbox are initially hidden on load
            if (inPageGalleryModal) inPageGalleryModal.classList.remove('active');
            if (lightboxOverlay) lightboxOverlay.classList.remove('active');
        } catch (error) {
            console.error("CRITICAL ERROR during init() function:", error);
            if (welcomeOverlay) {
                welcomeOverlay.innerHTML = `
                    <div style="text-align: center; color: red; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
                        <h2>Oops! Website could not load.</h2>
                        <p>There was an error initializing the page features: <strong>${error.message}</strong></p>
                        <p>Please ensure all files are correctly saved and located, and check the browser console (F12) for details.</p>
                        <p>If you don't see anything, it might be a caching issue. Please <button onclick="window.location.reload(true)" style="margin-top: 10px; padding: 8px 15px; cursor: pointer; background-color: var(--accent-color); color: white; border-radius: 5px;">Force Reload</button> or clear your browser cache.</p>
                    </div>
                `;
                welcomeOverlay.classList.remove('hidden');
                welcomeOverlay.style.display = 'flex';
                welcomeOverlay.style.pointerEvents = 'auto';
            }
        }
    }

    init();

    window.addEventListener('beforeunload', () => {
        if (currentAudioObjectURL) URL.revokeObjectURL(currentAudioObjectURL);
        if (currentVideoObjectURL) URL.revokeObjectURL(currentVideoObjectURL);
    });
});