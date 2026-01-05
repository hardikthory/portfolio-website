// Reveal Animation on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// Lightbox Logic
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <div class="lightbox-prev">&#10094;</div>
    <div class="lightbox-next">&#10095;</div>
    <img src="" alt="Lightbox Image">
    <div class="paper-note">
        <div class="note-content"></div>
    </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const closeBtn = lightbox.querySelector('.lightbox-close');
const prevBtn = lightbox.querySelector('.lightbox-prev');
const nextBtn = lightbox.querySelector('.lightbox-next');
const paperNote = lightbox.querySelector('.paper-note');
const noteContent = lightbox.querySelector('.note-content');

let currentIndex = 0;
let galleryImages = [];
let galleryCaptions = []; // Store captions

// Initialize Gallery
const initGallery = () => {
    // Find all images inside scatter-items
    const items = document.querySelectorAll('.scatter-item img');
    if (items.length === 0) return;

    galleryImages = Array.from(items).map(img => img.src);
    // Read data-caption attribute, fallback to alt, or generic text
    galleryCaptions = Array.from(items).map(img => img.dataset.caption || "A moment frozen in time...");

    items.forEach((img, index) => {
        img.parentElement.parentElement.addEventListener('click', () => {
            openLightbox(index);
        });
    });
};

const openLightbox = (index) => {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    resetZoom();
};

const closeLightbox = () => {
    lightbox.classList.remove('active');
    paperNote.classList.remove('expanded'); // Reset note
    document.body.style.overflow = '';
    resetZoom();
};

const updateLightboxImage = () => {
    lightboxImg.src = galleryImages[currentIndex];
    noteContent.textContent = galleryCaptions[currentIndex];
    paperNote.classList.remove('expanded'); // Collapse note on change
};

const nextImage = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxImage();
    resetZoom();
};

const prevImage = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
    resetZoom();
};

// Event Listeners
closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);
lightbox.addEventListener('click', (e) => {
    // If clicking outside image and outside note, close
    if (e.target === lightbox) closeLightbox();
});

paperNote.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't trigger lightbox close
    paperNote.classList.toggle('expanded');
});

// Zoom Logic
let zoomLevel = 1;

lightbox.addEventListener('wheel', (e) => {
    e.preventDefault();
    // Adjust zoom sensitivity
    zoomLevel += e.deltaY * -0.001;
    // Clamp zoom between 1x and 5x
    zoomLevel = Math.min(Math.max(1, zoomLevel), 5);

    lightboxImg.style.transform = `scale(${zoomLevel})`;
});

// Reset zoom on navigation
const resetZoom = () => {
    zoomLevel = 1;
    lightboxImg.style.transform = `scale(1)`;
};

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
        nextImage(e);
        resetZoom();
    }
    if (e.key === 'ArrowLeft') {
        prevImage(e);
        resetZoom();
    }
});

// Run Init
window.addEventListener('DOMContentLoaded', initGallery);
