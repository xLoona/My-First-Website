// js/features/players.js
import { getElement, SVG_ICONS } from '../utils/helpers.js';
import { updateBackgroundMusicState } from '../core/audio-manager.js'; // Import only necessary functions/references

let playerPrompt;
let mp3Upload;
let playPauseBtn;
let seekBar;
let volumeBar;
let playerMuteButton;
let songTitleDisplay;
let playerControls;

let videoPlayerContainer;
let videoPlayer; // Local reference to custom video player from core
let videoPlayPauseBtn;
let videoSeekBar;
let videoTimeDisplay;
let videoMuteBtn;
let videoVolumeBar;
let fullscreenBtn;
let mp4Upload;

// These are now handled internally within Players module
let currentAudioObjectURL = null;
let currentVideoObjectURL = null;


export function init(playerPromptRef, audioPlayerRef, mp3UploadRef, playPauseBtnRef, seekBarRef, volumeBarRef, playerMuteButtonRef, songTitleDisplayRef, playerControlsRef, videoPlayerContainerRef, videoPlayerRef, videoPlayPauseBtnRef, videoSeekBarRef, videoTimeDisplayRef, videoMuteBtnRef, videoVolumeBarRef, fullscreenBtnRef, mp4UploadRef) {
    playerPrompt = playerPromptRef;
    audioPlayer = audioPlayerRef; // Get reference from main, not import directly.
    mp3Upload = mp3UploadRef;
    playPauseBtn = playPauseBtnRef;
    seekBar = seekBarRef;
    volumeBar = volumeBarRef;
    playerMuteButton = playerMuteButtonRef;
    songTitleDisplay = songTitleDisplayRef;
    playerControls = playerControlsRef;

    videoPlayerContainer = videoPlayerContainerRef;
    videoPlayer = videoPlayerRef; // Get reference from main, not import directly.
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
        mp3Upload.addEventListener('change', async (e) => { // Made async to await fade
            const file = e.target.files[0];
            if (!file) return;

            if (file.type === "audio/mpeg") {
                // Revoke previous object URL if it exists
                if (currentAudioObjectURL) {
                    URL.revokeObjectURL(currentAudioObjectURL);
                }
                currentAudioObjectURL = URL.createObjectURL(file);
                audioPlayer.src = currentAudioObjectURL;
                audioPlayer.load(); // Load the new source

                // Set loop to false for user-uploaded audio
                audioPlayer.loop = false;

                // Update UI elements immediately
                if (playerPrompt) playerPrompt.style.display = 'none';
                if (songTitleDisplay) { songTitleDisplay.textContent = file.name; songTitleDisplay.style.display = 'flex'; }
                if (playerControls) playerControls.style.display = 'flex';
                
                // Play instantly and then fade out BGM in parallel
                audioPlayer.play().catch(error => console.error("MP3 play failed:", error)); 
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
                
                // Set loop to false for user-uploaded video
                videoPlayer.loop = false;

                // Play instantly and then fade out BGM in parallel
                videoPlayer.play().catch(error => { 
                    console.error("Video play failed:", error);
                    alert("Browser autoplay policy blocked video playback. Please click the video area to play.");
                    if (videoPlayerContainer) { videoPlayerContainer.classList.add('paused'); videoPlayerContainer.classList.remove('video-player-loading'); }
                });
                updateBackgroundMusicState(); 
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