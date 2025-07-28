document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT REFERENCES ---
    const body = document.body;
    const backgroundMusic = document.getElementById('background-music');
    const enterButton = document.getElementById('enter-button');
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const petalContainer = document.getElementById('petal-container');
    const commentForm = document.getElementById('comment-form');
    const commentLog = document.getElementById('comment-log');
    const animatedCards = document.querySelectorAll('.card-animate');
    const cursor = document.getElementById('cursor');
    const sparkleContainer = document.getElementById('sparkle-container');

    // Settings Card Elements
    const settingsCard = document.getElementById('settings-card');
    const settingsTabButtons = document.querySelectorAll('.settings-tab-btn');
    const themeChoiceButtons = document.querySelectorAll('.theme-choice-btn');
    const effectAmountSlider = document.getElementById('effect-amount');
    const effectSpeedSlider = document.getElementById('effect-speed');
    const bgmMuteButton = document.getElementById('bgm-mute-button');

    // Music Player Elements
    const playerPrompt = document.getElementById('player-prompt');
    const audioPlayer = document.getElementById('audio-player');
    const mp3Upload = document.getElementById('mp3-upload');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const volumeBar = document.getElementById('volume-bar');
    const playerMuteButton = document.getElementById('player-mute-button');
    const songTitleDisplay = document.getElementById('song-title-display');
    const playerControls = document.getElementById('player-controls');

    // Video Player Elements
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoPlayer = document.getElementById('custom-video');
    const videoPlayPauseBtn = document.getElementById('video-play-pause-btn');
    const videoSeekBar = document.getElementById('video-seek-bar');
    const videoTimeDisplay = document.getElementById('video-time');
    const videoMuteBtn = document.getElementById('video-mute-btn');
    const videoVolumeBar = document.getElementById('video-volume-bar');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const mp4Upload = document.getElementById('mp4-upload');

    // Easter Egg Elements
    const easterEggButton = document.getElementById('easter-egg-button');
    const easterEggOverlay = document.getElementById('easter-egg-overlay');
    const easterEggContent = document.getElementById('easter-egg-content');
    const easterEggQuestion = document.getElementById('easter-egg-question');
    const easterEggAnswers = document.getElementById('easter-egg-answers');
    const easterEggResultImage = document.getElementById('easter-egg-result-image');
    const easterEggMusic = document.getElementById('easter-egg-music');
    const easterEggRightSfx = document.getElementById('easter-egg-right');
    const easterEggWrongSfx = document.getElementById('easter-egg-wrong');
    const easterEggTwoTrigger = document.getElementById('easter-egg-two-trigger');

    // Music Box Elements (assuming these are still part of the site, even if not directly impacted by current task)
    const musicBoxCrank = document.getElementById('music-box-crank');
    const musicBoxAudio = document.getElementById('music-box-audio');
    const musicBoxSparkles = document.getElementById('music-box-sparkles');
    const musicBoxBase = document.getElementById('music-box-base');

    // --- 2. STATE AND CONFIG VARIABLES ---
    let fadeInterval;
    let easterEggCounter = 0;
    // Music Box related states, keeping them for completeness but they are not used in this prompt's scope
    let isWinding = false;
    let windUpProgress = 0;
    const WIND_UP_TARGET = 360;
    let windInterval;

    const SVG_ICONS = {
        play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent-color)"><path d="M8 5v14l11-7z"/></svg>`,
        pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--accent-color)"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
        soundOn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
        soundOff: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
        sparkle: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNMTAuNzUgMi43NWwxLjUgMy43NSA0LjUgMS4yNS0zLjUgMy4yNSA0LjUgNi4yNS02LjUtMS0zIDIuNzUtMy02LjI1IDIuMjUtNS02LjUtMy43NSAyLjUtNC4yNXoiLz48L3N2Zz4=`,
        theme: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"/></svg>`,
        effects: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm0 14a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"/></svg>`,
        musicBoxBase: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxwYXRoIGZpbGw9InZhcigtLWlucHV0LWJnLWNvbG9yKSIgZD0iTTAgMTBoMTAwdjUwSDB6Ii8+PHBhdGggZmlsbD0idmFyKC0tY2FyZC1iZykiIHN0cm9rZT0idmFyKC0tYWNjZW50LWNvbG9yKSIgc3Ryb2tlLXdpZHRoPSIzIiBkPSJNNSA1aDkwdjUwSDV6Ii8+PC9zdmc+`,
        musicBoxCrank: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGNpcmNsZSBjeD0iOCIgY3k9IjI1IiByPSI4IiBmaWxsPSJ2YXIoLS1hY2NlbnQtY29sb3IpIi8+PHBhdGggZD0iTTggMjVoMzIiIHN0cm9rZT0idmFyKC0tYWNjZW50LWNvbG9yKSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIyNSIgcj0iMTAiIGZpbGw9InZhcigtLWlucHV0LWJnLWNvbG9yKSIgc3Ryb2tlPSJ2YXIoLS1hY2NlbnQtY29sb3IpIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=`,
        fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
        fullscreenExit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16h3v3m-3-3L10 10m11 0h-3V7m3 3L14 14m0 7h-3v-3m3 3l-7-7m-7 7h3v-3m-3 3l7-7"/></svg>`
    };

    // --- 3. CORE FUNCTIONS ---
    function createBackgroundEffects(amount = 50) {
        if (!petalContainer) return;
        petalContainer.innerHTML = '';
        const isStarfield = body.classList.contains('starfield-theme');
        const effectCount = parseInt(amount);

        for (let i = 0; i < effectCount; i++) {
            const effectElement = document.createElement('div');
            if (isStarfield) {
                const isShootingStar = Math.random() > 0.95;
                if (isShootingStar) {
                    effectElement.classList.add('shooting-star');
                    const speed = parseFloat(effectSpeedSlider.value);
                    effectElement.style.setProperty('--start-x', `${Math.random() * 200 - 50}%`); // Start off-screen
                    effectElement.style.setProperty('--start-y', `${Math.random() * 200 - 50}%`); // Start off-screen
                    effectElement.style.setProperty('--duration', `${(Math.random() * 2 + (18 - speed))}s`);
                    effectElement.style.setProperty('--delay', `${Math.random() * 10}s`);
                } else {
                    effectElement.classList.add('star');
                    effectElement.style.setProperty('--start-x', `${Math.random() * 100}%`);
                    effectElement.style.setProperty('--start-y', `${Math.random() * 100}%`);
                    effectElement.style.setProperty('--size', `${Math.random() * 2 + 1}px`);
                    effectElement.style.setProperty('--delay', `${Math.random() * 4}s`);
                }
            } else {
                effectElement.classList.add('petal');
                const speed = parseFloat(effectSpeedSlider.value);
                effectElement.style.setProperty('--start-x', `${Math.random() * 100}vw`);
                effectElement.style.setProperty('--duration', `${(Math.random() * 10 + (28 - speed))}s`);
                effectElement.style.setProperty('--delay', `${Math.random() * -20}s`);
                effectElement.style.setProperty('--size', `${Math.random() * 25 + 20}px`);
                effectElement.style.setProperty('--sway-amount', `${Math.random() * 80 - 40}px`);
                effectElement.style.setProperty('--rotation-amount', `${Math.random() * 360}deg`);
            }
            petalContainer.appendChild(effectElement);
        }
    }

    function setTheme(theme) {
        if (!body) return;
        body.className = ''; // Remove all existing theme classes
        body.classList.add(`${theme}-theme`);
        themeChoiceButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        createBackgroundEffects(effectAmountSlider.value);
    }

    function fadeAudio(audioElement, direction) {
        if (!audioElement || (audioElement.muted && direction === 'in')) return;
        clearInterval(fadeInterval);

        const isFadingIn = direction === 'in';
        const targetVolume = isFadingIn ? 0.5 : 0;
        let currentVolume = audioElement.volume;

        if ((isFadingIn && currentVolume >= targetVolume) || (!isFadingIn && currentVolume <= targetVolume)) {
            if (isFadingIn && audioElement.paused) audioElement.play().catch(e => console.error("Audio play failed:", e));
            return;
        }

        if (isFadingIn && audioElement.paused) audioElement.play().catch(e => console.error("Audio play failed:", e));

        const step = (targetVolume - currentVolume) / 40; // 40 steps for smoother fade over ~2 seconds (40 * 50ms)

        fadeInterval = setInterval(() => {
            currentVolume += step;
            if ((step > 0 && currentVolume >= targetVolume) || (step < 0 && currentVolume <= targetVolume)) {
                audioElement.volume = targetVolume;
                if (!isFadingIn) audioElement.pause();
                clearInterval(fadeInterval);
            } else {
                audioElement.volume = currentVolume;
            }
        }, 50); // Every 50ms
    }

    function displayComments() {
        if (!commentLog) return;
        const saved = JSON.parse(localStorage.getItem('comments')) || [];
        commentLog.innerHTML = ''; // Clear existing comments

        saved.forEach(commentData => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            const text = document.createElement('p');
            text.textContent = commentData.text;

            const meta = document.createElement('p');
            meta.className = 'comment-meta';
            const author = document.createElement('span');
            author.className = 'comment-author';
            author.textContent = commentData.name;
            meta.append('Posted by ', author);

            commentElement.append(text, meta);
            commentLog.appendChild(commentElement);
        });
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return '0:00';
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // --- Video Player Functions (Rewritten/Enhanced) ---
    function updateVideoPlayPauseButton() {
        if (!videoPlayPauseBtn) return;
        videoPlayPauseBtn.innerHTML = videoPlayer.paused ?
            SVG_ICONS.play.replace(/var\(--accent-color\)/g, 'white') :
            SVG_ICONS.pause.replace(/var\(--accent-color\)/g, 'white');
    }

    function updateVideoMuteButton() {
        if (!videoMuteBtn) return;
        videoMuteBtn.innerHTML = (videoPlayer.muted || videoPlayer.volume === 0) ?
            SVG_ICONS.soundOff.replace(/var\(--accent-color\)/g, 'white') :
            SVG_ICONS.soundOn.replace(/var\(--accent-color\)/g, 'white');
        if (videoVolumeBar) {
            videoVolumeBar.value = videoPlayer.muted ? 0 : videoPlayer.volume;
        }
    }

    function updateVideoTimeDisplay() {
        if (!videoTimeDisplay) return;
        const currentTime = formatTime(videoPlayer.currentTime);
        const totalTime = formatTime(videoPlayer.duration);
        videoTimeDisplay.textContent = `${currentTime} / ${totalTime}`;
    }

    function toggleVideoPlayPause() {
        if (!videoPlayer.src) return; // Can't play if no source
        if (videoPlayer.paused) {
            videoPlayer.play().catch(error => {
                console.error("Video play failed:", error);
                alert("Browser autoplay policy blocked video playback. Please click the video area to play.");
                videoPlayerContainer.classList.add('paused'); // Ensure overlay remains visible
            });
        } else {
            videoPlayer.pause();
        }
    }

    function handleVideoLoadError(e) {
        console.error("Video Error:", e);
        // MediaError.code: 1=MEDIA_ERR_ABORTED, 2=MEDIA_ERR_NETWORK, 3=MEDIA_ERR_DECODE, 4=MEDIA_ERR_SRC_NOT_SUPPORTED
        let errorMessage = "An unknown video error occurred.";
        if (videoPlayer.error) {
            switch (videoPlayer.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorMessage = "Video playback aborted.";
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    errorMessage = "A network error caused the video download to fail.";
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    errorMessage = "The video format/codec is not supported.";
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = "The video could not be loaded, either because the server or network failed or because the format is not supported.";
                    break;
            }
        }
        alert(`Video playback error: ${errorMessage}. Please try a different file.`);
        videoPlayerContainer.classList.remove('video-player-loading');
        videoPlayerContainer.classList.add('paused'); // Show overlay
        videoPlayer.src = ''; // Clear source to prevent retries
    }

    // --- 4. EVENT LISTENERS ---
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (welcomeOverlay) {
                welcomeOverlay.style.opacity = '0';
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                }, 500);
            }
            fadeAudio(backgroundMusic, 'in');
            if (animatedCards) {
                animatedCards.forEach(card => {
                    card.classList.add('visible');
                });
            }
        });
    }

    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.top = `${e.clientY}px`;
            cursor.style.left = `${e.clientX}px`;

            const sparkle = document.createElement('img');
            sparkle.src = SVG_ICONS.sparkle;
            sparkle.classList.add('sparkle');
            sparkle.style.top = `${e.clientY}px`;
            sparkle.style.left = `${e.clientX}px`;
            if (sparkleContainer) sparkleContainer.appendChild(sparkle);
            setTimeout(() => {
                sparkle.remove();
            }, 800);
        });

        document.querySelectorAll('a, button, label, input, textarea').forEach(el => {
            el.addEventListener('mouseover', () => {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.borderWidth = '3px';
            });
            el.addEventListener('mouseout', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderWidth = '2px';
            });
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('comment-name');
            const textInput = document.getElementById('comment-text');

            if (!nameInput.value.trim() || !textInput.value.trim()) {
                alert("Please enter both your name and a comment.");
                return;
            }

            const comments = JSON.parse(localStorage.getItem('comments')) || [];
            comments.push({
                name: nameInput.value,
                text: textInput.value
            });
            localStorage.setItem('comments', JSON.stringify(comments));
            displayComments();
            nameInput.value = '';
            textInput.value = '';
        });
    }

    // Music Player Event Listeners
    if (mp3Upload) {
        mp3Upload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === "audio/mpeg") {
                audioPlayer.src = URL.createObjectURL(file);
                audioPlayer.load(); // Load the new audio
                audioPlayer.play().catch(error => console.error("MP3 play failed:", error));
                if (playerPrompt) playerPrompt.style.display = 'none';
                if (songTitleDisplay) {
                    songTitleDisplay.textContent = file.name;
                    songTitleDisplay.style.display = 'flex';
                }
                if (playerControls) playerControls.style.display = 'flex';
            } else if (file) {
                alert("Please select a valid .mp3 file.");
            }
        });
    }
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (!audioPlayer.src) return;
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
        });
    }
    if (audioPlayer) {
        audioPlayer.addEventListener('play', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.pause;
            fadeAudio(backgroundMusic, 'out');
        });
        audioPlayer.addEventListener('pause', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
            // Only fade background music back in if the audio player wasn't just stopped at the beginning
            if (audioPlayer.currentTime < audioPlayer.duration && audioPlayer.currentTime > 0) {
                fadeAudio(backgroundMusic, 'in');
            }
        });
        audioPlayer.addEventListener('ended', () => {
            if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
            fadeAudio(backgroundMusic, 'in');
        });
        audioPlayer.addEventListener('timeupdate', () => {
            if (seekBar) seekBar.value = audioPlayer.currentTime;
        });
        audioPlayer.addEventListener('loadedmetadata', () => {
            if (seekBar) seekBar.max = audioPlayer.duration;
            audioPlayer.volume = volumeBar.value; // Apply current volume after metadata loads
        });
        audioPlayer.addEventListener('volumechange', () => {
            if (playerMuteButton) playerMuteButton.innerHTML = (audioPlayer.muted || audioPlayer.volume === 0) ? SVG_ICONS.soundOff : SVG_ICONS.soundOn;
            if (volumeBar) volumeBar.value = audioPlayer.muted ? 0 : audioPlayer.volume;
        });
    }
    if (seekBar) {
        seekBar.addEventListener('input', () => {
            if (audioPlayer && audioPlayer.duration) audioPlayer.currentTime = seekBar.value;
        });
    }
    if (volumeBar) {
        volumeBar.addEventListener('input', () => {
            if (audioPlayer) {
                audioPlayer.volume = volumeBar.value;
                audioPlayer.muted = false;
            }
        });
    }
    if (playerMuteButton) {
        playerMuteButton.addEventListener('click', () => {
            if (audioPlayer) audioPlayer.muted = !audioPlayer.muted;
        });
    }

    // Video Player Event Listeners (Rewritten/Enhanced)
    if (mp4Upload) {
        mp4Upload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === "video/mp4") {
                videoPlayer.src = URL.createObjectURL(file);
                videoPlayer.load(); // Request new video to load
                videoPlayerContainer.classList.add('video-player-loading'); // Show loading spinner
                videoPlayer.play().catch(error => {
                    console.error("Video play failed on upload:", error);
                    alert("Browser autoplay policy blocked video playback. Please click the video area to play.");
                    videoPlayerContainer.classList.add('paused'); // Ensure overlay remains visible
                    videoPlayerContainer.classList.remove('video-player-loading');
                });
            } else if (file) {
                alert("Please select a valid .mp4 file.");
            }
        });
    }

    if (videoPlayer) {
        videoPlayer.addEventListener('play', () => {
            updateVideoPlayPauseButton();
            videoPlayerContainer.classList.remove('paused');
            videoPlayerContainer.classList.remove('video-player-loading'); // Hide loading spinner
            fadeAudio(backgroundMusic, 'out');
            if (!audioPlayer.paused) { // Also pause custom MP3 if playing
                audioPlayer.pause();
            }
        });

        videoPlayer.addEventListener('pause', () => {
            updateVideoPlayPauseButton();
            videoPlayerContainer.classList.add('paused');
            fadeAudio(backgroundMusic, 'in');
        });

        videoPlayer.addEventListener('ended', () => {
            updateVideoPlayPauseButton(); // Show play icon
            videoPlayerContainer.classList.add('paused'); // Show overlay
            fadeAudio(backgroundMusic, 'in');
            videoPlayer.currentTime = 0; // Reset video to start
            if (videoSeekBar) videoSeekBar.value = 0;
            updateVideoTimeDisplay();
        });

        videoPlayer.addEventListener('timeupdate', () => {
            if (videoSeekBar && videoPlayer.duration) { // Ensure duration is valid before updating
                videoSeekBar.value = videoPlayer.currentTime;
            }
            updateVideoTimeDisplay();
        });

        videoPlayer.addEventListener('loadedmetadata', () => {
            if (videoSeekBar) {
                videoSeekBar.max = videoPlayer.duration;
            }
            updateVideoTimeDisplay();
            videoPlayer.volume = videoVolumeBar.value; // Apply current volume after metadata loads
            videoPlayerContainer.classList.remove('video-player-loading'); // Hide loading spinner once metadata is loaded
        });

        videoPlayer.addEventListener('progress', () => {
            // Can update a buffer indicator if desired
        });

        videoPlayer.addEventListener('waiting', () => {
            videoPlayerContainer.classList.add('video-player-loading'); // Show loading spinner when buffering
        });

        videoPlayer.addEventListener('playing', () => {
            videoPlayerContainer.classList.remove('video-player-loading'); // Hide loading spinner when playing resumes
        });

        videoPlayer.addEventListener('error', handleVideoLoadError);
    }

    if (videoPlayPauseBtn) {
        videoPlayPauseBtn.addEventListener('click', toggleVideoPlayPause);
    }

    if (videoPlayerContainer) {
        // Toggle play/pause by clicking the video area itself
        videoPlayerContainer.addEventListener('click', (e) => {
            // Only toggle if the click isn't on the controls themselves
            if (!videoControls.contains(e.target)) {
                toggleVideoPlayPause();
            }
        });
    }

    if (videoSeekBar) {
        videoSeekBar.addEventListener('input', () => {
            if (videoPlayer.src && videoPlayer.duration) videoPlayer.currentTime = videoSeekBar.value;
        });
    }

    if (videoMuteBtn) {
        videoMuteBtn.addEventListener('click', () => {
            if (videoPlayer.src) videoPlayer.muted = !videoPlayer.muted;
            updateVideoMuteButton(); // Ensure button icon updates
        });
    }

    if (videoVolumeBar) {
        videoVolumeBar.addEventListener('input', () => {
            if (videoPlayer.src) {
                videoPlayer.volume = videoVolumeBar.value;
                videoPlayer.muted = false; // Unmute if volume is adjusted
            }
            updateVideoMuteButton(); // Update mute icon based on new volume
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) { /* Safari */
                videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) { /* IE11 */
                videoPlayer.msRequestFullscreen();
            }
        });

        // Update fullscreen button icon based on fullscreen state
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                fullscreenBtn.innerHTML = SVG_ICONS.fullscreenExit;
            } else {
                fullscreenBtn.innerHTML = SVG_ICONS.fullscreen;
            }
        });
    }


    // Easter Egg 1 Logic
    if (easterEggButton) {
        easterEggButton.addEventListener('click', () => {
            easterEggCounter++;
            if (easterEggCounter === 15) {
                // Pause all other media
                if (backgroundMusic) { backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
                if (audioPlayer) { audioPlayer.pause(); audioPlayer.currentTime = 0; }
                if (videoPlayer) { videoPlayer.pause(); videoPlayer.currentTime = 0; } // Ensure main video player is paused

                if (easterEggOverlay) {
                    easterEggOverlay.classList.add('visible');
                    setTimeout(() => {
                        if (easterEggContent) easterEggContent.classList.add('visible');
                        if (easterEggMusic) easterEggMusic.play().catch(e => console.error("Easter egg music play failed:", e));
                    }, 5000); // Delay content and music
                }
            }
        });
    }
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (easterEggMusic) { easterEggMusic.pause(); easterEggMusic.currentTime = 0; }
            if (easterEggQuestion) easterEggQuestion.style.display = 'none';
            if (easterEggAnswers) easterEggAnswers.style.display = 'none';
            if (easterEggResultImage) easterEggResultImage.style.display = 'block';

            if (button.id === 'correct-answer') {
                easterEggResultImage.src = 'eastereggright.png';
                if (easterEggRightSfx) easterEggRightSfx.play();
                setTimeout(() => {
                    location.reload(); // Reload page after success
                }, 3000);
            } else {
                easterEggResultImage.src = 'eastereggwrong.png';
                if (easterEggWrongSfx) easterEggWrongSfx.play();
                // Optionally reload or allow retries for wrong answers
            }
        });
    });

    // Easter Egg 2 (Heart Button) Implementation (Rewritten)
    if (easterEggTwoTrigger && videoPlayer) {
        easterEggTwoTrigger.addEventListener('click', () => {
            // Stop/fade out all other media to give focus to the easter egg video
            if (backgroundMusic) {
                fadeAudio(backgroundMusic, 'out');
            }
            if (audioPlayer && !audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            if (easterEggMusic && !easterEggMusic.paused) { // If other easter egg music is playing
                easterEggMusic.pause();
                easterEggMusic.currentTime = 0;
            }

            // Set and attempt to play the easter egg video
            videoPlayer.src = 'eastereggtwovideo.mp4';
            videoPlayer.load(); // Load the new video source
            videoPlayerContainer.classList.add('video-player-loading'); // Show loading spinner
            videoPlayer.play().catch(error => {
                console.error("Error playing Easter Egg 2 video:", error);
                // User interaction required or other error
                alert("The secret video tried to play but was blocked by your browser's autoplay policy (it probably has sound!). Please click the video player to start it.");
                videoPlayerContainer.classList.add('paused'); // Ensure play overlay is visible
                videoPlayerContainer.classList.remove('video-player-loading'); // Hide spinner
            });
        });
    }

    // Settings Panel Event Listeners
    settingsTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const setting = button.dataset.setting;
            const targetPanel = document.getElementById(`${setting}-settings`);

            if (button.classList.contains('active')) {
                // If active, close it
                settingsCard.classList.remove('settings-open');
                button.classList.remove('active');
            } else {
                // Deactivate all others and activate this one
                settingsTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
                if (targetPanel) targetPanel.classList.add('active');
                settingsCard.classList.add('settings-open');
            }
        });
    });
    themeChoiceButtons.forEach(button => {
        button.addEventListener('click', () => setTheme(button.dataset.theme));
    });
    if (effectAmountSlider) {
        effectAmountSlider.addEventListener('input', (e) => createBackgroundEffects(e.target.value));
    }
    if (effectSpeedSlider) {
        effectSpeedSlider.addEventListener('input', () => createBackgroundEffects(effectAmountSlider.value));
    }
    if (bgmMuteButton) {
        bgmMuteButton.addEventListener('click', () => {
            backgroundMusic.muted = !backgroundMusic.muted;
            bgmMuteButton.innerHTML = backgroundMusic.muted ? `<span>${SVG_ICONS.soundOff} Unmute</span>` : `<span>${SVG_ICONS.soundOn} Mute</span>`;
            bgmMuteButton.classList.toggle('active', backgroundMusic.muted);
        });
    }

    // --- 5. INITIALIZATION ---
    function init() {
        setTheme('sakura'); // Default theme
        displayComments();

        // Initialize audio player buttons/display
        if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
        if (playerMuteButton) playerMuteButton.innerHTML = SVG_ICONS.soundOn;
        if (songTitleDisplay) songTitleDisplay.style.display = 'none'; // Initially hidden
        if (playerControls) playerControls.style.display = 'none'; // Initially hidden

        // Initialize video player buttons/display
        if (videoPlayPauseBtn) updateVideoPlayPauseButton(); // Initial state for video play/pause button
        if (videoMuteBtn) updateVideoMuteButton(); // Initial state for video mute button
        if (videoTimeDisplay) updateVideoTimeDisplay(); // Initial state for video time display
        if (fullscreenBtn) fullscreenBtn.innerHTML = SVG_ICONS.fullscreen; // Initial state for fullscreen button

        // Set SVG icons for settings tab buttons
        const themeBtn = document.querySelector('[data-setting="theme"]');
        if (themeBtn) themeBtn.innerHTML = SVG_ICONS.theme;
        const effectsBtn = document.querySelector('[data-setting="effects"]');
        if (effectsBtn) effectsBtn.innerHTML = SVG_ICONS.effects;
        const soundBtn = document.querySelector('[data-setting="sound"]');
        if (soundBtn) soundBtn.innerHTML = SVG_ICONS.soundOn;
        if (bgmMuteButton) bgmMuteButton.innerHTML = `<span>${SVG_ICONS.soundOn} Mute</span>`;

        // Set music box SVG sources (if they exist)
        if (musicBoxBase) musicBoxBase.src = SVG_ICONS.musicBoxBase;
        if (musicBoxCrank) musicBoxCrank.src = SVG_ICONS.musicBoxCrank;
    }

    init();
});