// js/core/themes.js
import { getElement, SVG_ICONS } from '../utils/helpers.js';

let body;
let petalContainer;
let liminalBackgroundVideoContainer;
let liminalBackgroundVideoBlurred;
let liminalBackgroundVideoMain;
let settingsCard;
let settingsTabButtons;
let themeChoiceButtons;
let effectAmountSlider;
let effectSpeedSlider;
let sparkleFrequencySlider;
let cardAnimationSpeedSlider;
let toggleBackgroundEffectsBtn;
let filterChoiceButtons;
let filterIntensitySlider;

// Callbacks/references from other modules
let _updateBackgroundMusicStateCallback;
let _getBackgroundEffectsHiddenStateCallback;
let _setBackgroundEffectsHiddenCallback;

const liminalMusicTracks = [
    "assets/audio/liminalbackgroundmusic1.mp3",
    "assets/audio/liminalbackgroundmusic2.mp3",
    "assets/audio/liminalbackgroundmusic3.mp3",
    "assets/audio/liminalbackgroundmusic4.mp3"
];
const liminalVideoTracks = [
    "assets/videos/LiminalTheme/liminalbackgroundvideo1.mp4",
    "assets/videos/LiminalTheme/liminalbackgroundvideo2.mp4",
    "assets/videos/LiminalTheme/liminalbackgroundvideo3.mp4"
];

export function init(bodyRef, petalContainerRef, liminalVideoContainerRef, liminalVideoBlurredRef, liminalVideoMainRef, settingsCardRef, settingsTabButtonsRef, themeChoiceButtonsRef, effectAmountSliderRef, effectSpeedSliderRef, sparkleFrequencySliderRef, cardAnimationSpeedSliderRef, toggleBackgroundEffectsBtnRef, filterChoiceButtonsRef, filterIntensitySliderRef, updateBackgroundMusicStateFn, getBackgroundEffectsHiddenStateFn, setBackgroundEffectsHiddenFn) {
    body = bodyRef;
    petalContainer = petalContainerRef;
    liminalBackgroundVideoContainer = liminalVideoContainerRef;
    liminalBackgroundVideoBlurred = liminalVideoBlurredRef;
    liminalBackgroundVideoMain = liminalVideoMainRef;
    settingsCard = settingsCardRef;
    settingsTabButtons = settingsTabButtonsRef;
    themeChoiceButtons = themeChoiceButtonsRef;
    effectAmountSlider = effectAmountSliderRef;
    effectSpeedSlider = effectSpeedSliderRef;
    sparkleFrequencySlider = sparkleFrequencySliderRef;
    cardAnimationSpeedSlider = cardAnimationSpeedSliderRef;
    toggleBackgroundEffectsBtn = toggleBackgroundEffectsBtnRef;
    filterChoiceButtons = filterChoiceButtonsRef;
    filterIntensitySlider = filterIntensitySliderRef;

    _updateBackgroundMusicStateCallback = updateBackgroundMusicStateFn;
    _getBackgroundEffectsHiddenStateCallback = getBackgroundEffectsHiddenStateFn;
    _setBackgroundEffectsHiddenCallback = setBackgroundEffectsHiddenFn;

    setupSettingsListeners();
    setupEffectSliders();
    setupFilterControls();

    // Initial theme setting on load
    setTheme('sakura'); 
}

function setupSettingsListeners() {
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

    if (toggleBackgroundEffectsBtn) {
        toggleBackgroundEffectsBtn.addEventListener('click', () => {
            _setBackgroundEffectsHiddenCallback(!_getBackgroundEffectsHiddenStateCallback());
            
            toggleBackgroundEffectsBtn.innerHTML = _getBackgroundEffectsHiddenStateCallback() ?
                `<span>${SVG_ICONS.show} Show Effects</span>` :
                `<span>${SVG_ICONS.hide} Hide Effects</span>`;
            toggleBackgroundEffectsBtn.classList.toggle('active', !_getBackgroundEffectsHiddenStateCallback());

            updateAllBackgroundEffects();
        });
    }
}

function setupEffectSliders() {
    if (effectAmountSlider) {
        effectAmountSlider.addEventListener('input', () => {
            updateAllBackgroundEffects(); 
        });
    }
    if (effectSpeedSlider) {
        effectSpeedSlider.addEventListener('input', () => {
            updateAllBackgroundEffects();
        });
    }
    if (sparkleFrequencySlider) {
        sparkleFrequencySlider.addEventListener('input', (e) => {
            sparkleFrequencySlider.currentSparkleFrequency = parseFloat(e.target.value); // Store on the element itself for simplicity
        });
    }
    if (cardAnimationSpeedSlider) {
        cardAnimationSpeedSlider.addEventListener('input', (e) => {
            const delayValue = (100 - parseFloat(e.target.value)) / 100;
            document.documentElement.style.setProperty('--card-animation-base-delay', `${delayValue * 0.2}s`);
        });
    }
}

function setupFilterControls() {
    if (filterChoiceButtons && filterIntensitySlider) {
        filterChoiceButtons.forEach(button => {
            if (!button) return;
            button.addEventListener('click', () => {
                filterIntensitySlider.currentFilter = button.dataset.filter; // Store on slider for consistency
                applyFilter(filterIntensitySlider.currentFilter, parseFloat(filterIntensitySlider.value));
            });
        });
        filterIntensitySlider.addEventListener('input', (e) => {
            filterIntensitySlider.currentFilterIntensity = parseFloat(e.target.value);
            applyFilter(filterIntensitySlider.currentFilter || 'none', filterIntensitySlider.currentFilterIntensity);
        });
    }
}


// Exported function to apply the theme
export function setTheme(theme) {
    try {
        if (!body) return;

        body.className = ''; // Clear existing themes
        body.classList.add(`${theme}-theme`);

        themeChoiceButtons.forEach(btn => {
            if (btn) btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        const isLiminalTheme = (theme === 'liminal');
        const isParticleTheme = (theme === 'sakura' || theme === 'night' || theme === 'starfield' || theme === 'bubbletea');
        
        // Update the global state for background effects visibility
        if (isParticleTheme) {
            _setBackgroundEffectsHiddenCallback(false); // Effects are visible by default for these themes
        } else if (isLiminalTheme) {
            _setBackgroundEffectsHiddenCallback(true); // Effects are hidden by default for liminal
        } 

        // Update background music state (this will handle smooth transitions between background tracks)
        _updateBackgroundMusicStateCallback();

        // Manage UI toggle button visibility for Liminal mode
        if (getElement('toggle-ui-btn') && getElement('hide-ui-heading')) { // Re-check elements just in case
            if (isLiminalTheme) {
                getElement('toggle-ui-btn').style.display = 'block';
                getElement('hide-ui-heading').style.display = 'block';
                // No direct toggleUI here, let the toggle button init/state handle it
            } else {
                getElement('toggle-ui-btn').style.display = 'none';
                getElement('hide-ui-heading').style.display = 'none';
                // If UI was hidden from liminal mode, ensure it's shown when leaving
                if (body.classList.contains('ui-hidden')) {
                     getElement('toggle-ui-btn').toggleUI(false); // Assuming toggleUI is attached to the element
                }
            }
        }
        
        // Update the state of the "Toggle Background Effects" button UI
        if (toggleBackgroundEffectsBtn) {
            toggleBackgroundEffectsBtn.innerHTML = _getBackgroundEffectsHiddenStateCallback() ?
                `<span>${SVG_ICONS.show} Show Effects</span>` :
                `<span>${SVG_ICONS.hide} Hide Effects</span>`;
            toggleBackgroundEffectsBtn.classList.toggle('active', !_getBackgroundEffectsHiddenStateCallback());
        }

        // Finally, update the actual background effects (particles or video)
        updateAllBackgroundEffects();

    } catch (error) {
        console.error("Error in setTheme function:", error);
        throw error;
    }
}

// Internal function for theme module
function createBackgroundEffects(effectType, amount = 50) {
    if (!petalContainer) return;

    petalContainer.innerHTML = ''; 

    const effectCount = parseInt(amount);
    const currentEffectSpeed = effectSpeedSlider ? parseFloat(effectSpeedSlider.value) : 15;

    for (let i = 0; i < effectCount; i++) {
        const effectElement = document.createElement('div');
        effectElement.classList.add(effectType);

        effectElement.style.setProperty('--delay', `${Math.random() * -20}s`);
        effectElement.style.setProperty('--duration', `${(Math.random() * 10 + (28 - currentEffectSpeed))}s`);

        if (effectType === 'star') {
            const isShootingStar = Math.random() > 0.95;
            if (isShootingStar) {
                effectElement.classList.remove('star');
                effectElement.classList.add('shooting-star');
                effectElement.style.setProperty('--start-x', `${Math.random() * 200 - 50}%`);
                effectElement.style.setProperty('--start-y', `${Math.random() * 200 - 50}%`);
                effectElement.style.setProperty('--duration', `${(Math.random() * 2 + (18 - currentEffectSpeed))}s`);
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

// Internal function for theme module
function updateAllBackgroundEffects() {
    const currentThemeClass = body.className.split(' ').find(cls => cls.endsWith('-theme'));
    const effectAmount = effectAmountSlider ? parseFloat(effectAmountSlider.value) : 50;

    // Step 1: Manage Liminal video vs. particle container visibility
    if (currentThemeClass === 'liminal-theme') {
        if (liminalBackgroundVideoContainer) liminalBackgroundVideoContainer.style.display = 'grid';
        playRandomLiminalVideo();
        if (body) body.classList.add('petals-hidden'); 
        if (petalContainer) petalContainer.innerHTML = '';
        return;
    } else {
        if (liminalBackgroundVideoContainer) liminalBackgroundVideoContainer.style.display = 'none';
        if (liminalBackgroundVideoMain) liminalBackgroundVideoMain.src = '';
        if (liminalBackgroundVideoBlurred) liminalBackgroundVideoBlurred.src = '';
    }

    // Step 2: Apply/remove the `petals-hidden` class based on `backgroundEffectsHidden` state
    if (_getBackgroundEffectsHiddenStateCallback()) { // Use callback for consistency
        if (body) body.classList.add('petals-hidden');
    } else {
        if (body) body.classList.remove('petals-hidden');
    }

    // Step 3: Generate and display the correct particle effect for the current non-liminal theme
    if (currentThemeClass === 'starfield-theme') {
        createBackgroundEffects('star', effectAmount);
    } else if (currentThemeClass === 'bubbletea-theme') {
        createBackgroundEffects('boba', effectAmount);
    } else { // Default to 'petal' for Sakura and Night (and any other unspecified themes)
        createBackgroundEffects('petal', effectAmount);
    }
}

// Internal function for theme module
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
    liminalBackgroundVideoMain.loop = true; // Video should loop
    liminalBackgroundVideoBlurred.loop = true; // Blurred video should loop

    liminalBackgroundVideoMain.play().catch(e => console.warn("Liminal main video autoplay prevented:", e));
    liminalBackgroundVideoBlurred.play().catch(e => console.warn("Liminal blurred video autoplay prevented:", e));
}

// Internal function for theme module
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