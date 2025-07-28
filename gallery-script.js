let currentImageIndex;
const galleryImages = document.querySelectorAll('.gallery-item img');

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Find the index of the clicked image
    galleryImages.forEach((img, index) => {
        if (img.src === element.src) {
            currentImageIndex = index;
        }
    });

    lightbox.style.display = 'flex';
    lightboxImg.src = element.src;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
    currentImageIndex += direction;

    // Loop back to the first/last image
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }

    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = galleryImages[currentImageIndex].src;
}

// Optional: Close lightbox with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (document.getElementById('lightbox').style.display === 'flex') {
            closeLightbox();
        }
    }
});