// js/core/ui-elements.js
import { getElement, SVG_ICONS } from '../utils/helpers.js';

let body;
let cursor;
let sparkleContainer;
let toggleUiBtn;
let hideUiHeading;
let restoreUiBtn;
let mainHeader; // Reference to main header for UI hiding
let mainContentArea; // Reference to main content for UI hiding

let currentSparkleFrequency = 0.5;
let _playSfxCallback; // Callback from AudioManager
let _clickSoundElement; // Reference to click sound audio element

// Internal state for background effects visibility
// This state is shared with themes.js and audio-manager.js for consistent behavior
let backgroundEffectsHidden = false; // Default: effects are visible
let uiHiddenState = false; // Default: UI is visible

export function init(bodyRef, cursorRef, sparkleContainerRef, toggleUiBtnRef, hideUiHeadingRef, restoreUiBtnRef, mainHeaderRef, mainContentAreaRef, playSfxFn, clickSoundEl) {
    body = bodyRef;
    cursor = cursorRef;
    sparkleContainer = sparkleContainerRef;
    toggleUiBtn = toggleUiBtnRef;
    hideUiHeading = hideUiHeadingRef;
    restoreUiBtn = restoreUiBtnRef;
    mainHeader = mainHeaderRef;
    mainContentArea = mainContentAreaRef;
    _playSfxCallback = playSfxFn;
    _clickSoundElement = clickSoundEl;


    setupCursorEffects();
    setupUiToggle();

    // Set initial SVG icons for settings tab buttons
    const themeBtn = document.querySelector('[data-setting="theme"]');
    if (themeBtn) themeBtn.innerHTML = SVG_ICONS.theme;
    const effectsBtn = document.querySelector('[data-setting="effects"]');
    if (effectsBtn) effectsBtn.innerHTML = SVG_ICONS.effects;
    const soundBtn = document.querySelector('[data-setting="sound"]');
    if (soundBtn) soundBtn.innerHTML = SVG_ICONS.soundOn;
}

function setupCursorEffects() {
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
                    if (_playSfxCallback && _clickSoundElement) { // Play sparkle SFX
                        _playSfxCallback(_clickSoundElement); // Re-using click sound for sparkle
                    }
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
            if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.type === 'file') {
                 el.addEventListener('click', (e) => {
                    // Prevent SFX on range input change as it can be too noisy
                    if (e.currentTarget && e.currentTarget.id !== 'video-player-container' && e.currentTarget.type !== 'range') {
                        if (_playSfxCallback && _clickSoundElement) {
                            _playSfxCallback(_clickSoundElement);
                        }
                    }
                });
            }
        });
    }
}

function setupUiToggle() {
    if (toggleUiBtn) {
        // Attach toggleUI to the element itself so setTheme can call it
        toggleUiBtn.toggleUI = (show) => { // Adding the method to the element
            uiHiddenState = typeof show === 'boolean' ? show : !uiHiddenState;

            if (body) {
                body.classList.toggle('ui-hidden', uiHiddenState);
            }

            if (toggleUiBtn) {
                toggleUiBtn.textContent = uiHiddenState ? "Show UI" : "Hide UI";
            }
        };
        toggleUiBtn.addEventListener('click', () => {
            if (_playSfxCallback && _clickSoundElement) {
                _playSfxCallback(_clickSoundElement);
            }
            toggleUiBtn.toggleUI(); // Call the attached method
        });
    }
    if (restoreUiBtn) {
        restoreUiBtn.addEventListener('click', () => {
            if (_playSfxCallback && _clickSoundElement) {
                _playSfxCallback(_clickSoundElement);
            }
            if (toggleUiBtn) toggleUiBtn.toggleUI(false); // Call the attached method
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body && body.classList.contains('liminal-theme')) {
            if (_playSfxCallback && _clickSoundElement) {
                _playSfxCallback(_clickSoundElement);
            }
            if (toggleUiBtn) toggleUiBtn.toggleUI(); // Call the attached method
        }
    });
}

// Exported functions for other modules to use
// Exporting the direct state variable and its setter/getter for themes.js
export function setBackgroundEffectsHidden(hidden) {
    backgroundEffectsHidden = hidden;
}

export function getBackgroundEffectsHiddenState() {
    return backgroundEffectsHidden;
}

export function setSparkleFrequency(frequency) {
    currentSparkleFrequency = frequency;
}

// NOTE: toggleUI is now exposed via `toggleUiBtn.toggleUI()` in main.js after init.
// No direct export here to enforce usage through the element itself.