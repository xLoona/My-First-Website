// js/utils/helpers.js

/**
 * Helper function to get a DOM element by ID.
 * @param {string} id - The ID of the element.
 * @returns {HTMLElement|null} The DOM element or null if not found.
 */
export function getElement(id) {
    const element = document.getElementById(id);
    // You can add a console.warn here if an element is critical and missing,
    // but for general helpers, less console noise is better.
    return element;
}

// Common SVG Icons used across the site
export const SVG_ICONS = {
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