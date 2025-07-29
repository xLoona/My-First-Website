// js/features/gallery.js
import { getElement } from '../utils/helpers.js';

let galleryGrid;
let openGalleryBtn;
let closeGalleryBtnTop;
let closeGalleryBtnBottom;
let inPageGalleryModal;
let mainContentArea;
let mainHeader;
let lightboxOverlay;
let lightboxImage;
let lightboxCloseBtn;

let galleryImagesLoaded = false;
let _playSfxCallback;
let _clickSoundElement;

export function init(galleryGridRef, openGalleryBtnRef, closeGalleryBtnTopRef, closeGalleryBtnBottomRef, inPageGalleryModalRef, mainContentAreaRef, mainHeaderRef, lightboxOverlayRef, lightboxImageRef, lightboxCloseBtnRef, playSfxFn, clickSoundEl) {
    galleryGrid = galleryGridRef;
    openGalleryBtn = openGalleryBtnRef;
    closeGalleryBtnTop = closeGalleryBtnTopRef;
    closeGalleryBtnBottom = closeGalleryBtnBottomRef;
    inPageGalleryModal = inPageGalleryModalRef;
    mainContentArea = mainContentAreaRef;
    mainHeader = mainHeaderRef;
    lightboxOverlay = lightboxOverlayRef;
    lightboxImage = lightboxImageRef;
    lightboxCloseBtn = lightboxCloseBtnRef;
    _playSfxCallback = playSfxFn;
    _clickSoundElement = clickSoundEl;

    setupGalleryListeners();
}

function setupGalleryListeners() {
    if (openGalleryBtn && inPageGalleryModal && mainContentArea && mainHeader) {
        openGalleryBtn.addEventListener('click', () => {
            if (_playSfxCallback && _clickSoundElement) {
                _playSfxCallback(_clickSoundElement);
            }
            if (mainContentArea) {
                mainContentArea.style.opacity = '0';
                mainContentArea.style.pointerEvents = 'none';
            }
            if (mainHeader) {
                mainHeader.style.opacity = '0';
                mainHeader.style.pointerEvents = 'none';
                mainHeader.style.visibility = 'hidden';
            }

            if (document.body) document.body.classList.add('gallery-active');

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
            if (_playSfxCallback && _clickSoundElement) {
                _playSfxCallback(_clickSoundElement);
            }
            if (inPageGalleryModal) inPageGalleryModal.classList.remove('active');
            if (document.body) document.body.classList.remove('gallery-active');

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

    // Lightbox close listener
    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', () => {
            if (_playSfxCallback && _clickSoundElement) {
                _playSfxCallback(_clickSoundElement);
            }
            closeLightbox();
        });
    }
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) { // Only close if clicking the background, not the image itself
                if (_playSfxCallback && _clickSoundElement) {
                    _playSfxCallback(_clickSoundElement);
                }
                closeLightbox();
            }
        });
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
                    // Assuming gallery images are in assets/images/Gallery/
                    const fullPath = `assets/images/Gallery/${baseFileName}${ext}`;

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
                if (_playSfxCallback && _clickSoundElement) {
                    _playSfxCallback(_clickSoundElement);
                }
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
    if (document.body) document.body.classList.add('lightbox-active');
}

function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    if (document.body) document.body.classList.remove('lightbox-active');
    if (lightboxImage) lightboxImage.src = '';
}