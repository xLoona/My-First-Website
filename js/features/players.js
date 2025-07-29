// js/features/players.js
import { getElement, SVG_ICONS } from '../utils/helpers.js';
import { updateBackgroundMusicState, audioPlayer, videoPlayer } from '../core/audio-manager.js'; // Import audioPlayer and videoPlayer directly

let playerPrompt;
let mp3Upload;
let playPauseBtn;
let seekBar;
let volumeBar;
let playerMuteButton;
let songTitleDisplay;
let playerControls;

let videoPlayerContainer;
let videoPlayPauseBtn;
let videoSeekBar;
let videoTimeDisplay;
let videoMuteBtn;
let videoVolumeBar;
let fullscreenBtn;
let mp4Upload;

let currentAudioObjectURL = null;
let currentVideoObjectURL = null;


export function init(playerPromptRef, audioPlayerRef, mp3UploadRef, playPauseBtnRef, seekBarRef, volumeBarRef, playerMuteButtonRef, songTitleDisplayRef, playerControlsRef, videoPlayerContainerRef, videoPlayerRef, videoPlayPauseBtnRef, videoSeekBarRef, videoTimeDisplayRef, videoMuteBtnRef, videoVolumeBarRef, fullscreenBtnRef, mp4UploadRef) {
    playerPrompt = playerPromptRef;
    // audioPlayer, videoPlayer are imported directly from audio-manager.js now
    mp3Upload = mp3UploadRef;
    playPauseBtn = playPauseBtnRef;
    seekBar = seekBarRef;
    volumeBar = volumeBarRef;
    playerMuteButton = playerMuteButtonRef;
    songTitleDisplay = songTitleDisplayRef;
    playerControls = playerControlsRef;

    videoPlayerContainer = videoPlayerContainerRef;
    // videoPlayer is imported directly
    videoPlayPauseBtn = videoPlayPauseBtnRef;
    videoSeekBar = videoSeekBarRef;
    videoTimeDisplay = videoTimeDisplayRef;
    videoMuteBtn = videoMuteBtnRef;
    videoVolumeBar = videoVolumeBarRef;
    fullscreenBtn = fullscreenBtnRef;
    mp4Upload = mp4UploadRef;

    setupAudioPlayerListeners();
    setupVideoPlayerListeners();

    // Initial setup for UI elements (default states)
    if (playPauseBtn) playPauseBtn.innerHTML = SVG_ICONS.play;
    if (playerMuteButton) playerMuteButton.innerHTML = SVG_ICONS.soundOn;
    if (songTitleDisplay) songTitleDisplay.style.display = 'none';
    if (playerControls) playerControls.style.display = 'none';

    if (videoPlayer) {
        updateVideoPlayPauseButton();
        updateVideoMuteButton();
        updateVideoTimeDisplay();
        if (fullscreenBtn) fullscreenBtn.innerHTML = SVG_ICONS.fullscreen;
    }
}

function setupAudioPlayerListeners() {
    if (mp3Upload) {
        mp3Upload.addEventListener('change', async (e) => {
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

                // Fade out BGM in parallel
                updateBackgroundMusicState(); 
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

function setupVideoPlayerListeners() {
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
                updateBackgroundMusicState(); // Then fade out BGM in parallel
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
        videoPlayer.addEventListener('loadedmetadata', () => { if (videoSeekBar) { videoSeekBar.max = videoPlayer.duration; if (videoVolumeBar) videoPlayer.volume = videoVolumeBar.value; } });
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

// Internal helper functions for players
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
            URL.revokeObjectURL(currentVideoObjectURL);
        }
        videoPlayer.src = '';
        currentVideoObjectURL = null;
    }
}