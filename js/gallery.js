/**
 * Gallery & Carousel Module (Pinehurst Living Collection)
 * Handles auto-rotating room carousels, full-screen gallery modal,
 * keyboard controls, and smooth transitions across all dorm pages.
 */

(function () {
    let currentRoom = '';
    let currentImageIndex = 1;
    let galleryFolder = '';
    let roomImages = {};
    let roomNames = {};

    /**
     * Initialize gallery & carousel for the page
     * @param {Object} config
     * @param {string} config.folder - Image folder name (e.g. 'golfview', 'golfcity')
     * @param {Object} config.roomImages - Map of room type to total image count { standard: 3 }
     * @param {Object} config.roomNames - Map of room type to display title { standard: 'Standard Room' }
     * @param {string[]} [config.carouselRoomTypes] - List of carousel container suffixes
     * @param {number} [config.interval] - Rotation interval in ms (default: 3000)
     */
    window.initGallery = function (config) {
        if (!config) return;
        galleryFolder = config.folder || '';
        roomImages = config.roomImages || {};
        roomNames = config.roomNames || {};

        const carouselTypes = config.carouselRoomTypes || Object.keys(roomImages);
        const interval = config.interval || 3000;
        initCarousels(carouselTypes, interval);
        setupGalleryListeners();
    };

    /**
     * Auto-rotating Carousel logic
     */
    function initCarousels(roomTypes, interval) {
        roomTypes.forEach(type => {
            let currentIndex = 0;
            const container = document.getElementById(`carousel-${type}`);
            if (!container) return;
            const images = container.getElementsByTagName('img');
            if (images.length < 2) return;

            setInterval(() => {
                images[currentIndex].classList.remove('opacity-100');
                images[currentIndex].classList.add('opacity-0');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.remove('opacity-0');
                images[currentIndex].classList.add('opacity-100');
            }, interval);
        });
    }

    /**
     * Open Full-Screen Gallery Modal
     * @param {string} room - room identifier (e.g. 'standard', 'monthly-1bed')
     */
    window.openGallery = function (room) {
        currentRoom = room;
        currentImageIndex = 1;
        updateGalleryImage();

        const modal = document.getElementById('galleryModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        void modal.offsetWidth; // Force reflow for smooth opacity transition
        modal.classList.remove('opacity-0');
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close Gallery Modal
     */
    window.closeGallery = function () {
        const modal = document.getElementById('galleryModal');
        if (!modal) return;
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    /**
     * Update image source and caption in modal
     */
    function updateGalleryImage() {
        const img = document.getElementById('galleryImage');
        const caption = document.getElementById('galleryCaption');
        const indexEl = document.getElementById('currentImageIndex');
        if (!img) return;

        img.style.opacity = '0.5';
        setTimeout(() => {
            img.src = `image/${galleryFolder}/${currentRoom}/${currentImageIndex}.png`;
            if (caption) caption.innerText = roomNames[currentRoom] || currentRoom;
            if (indexEl) indexEl.innerText = currentImageIndex;
            img.onload = () => { img.style.opacity = '1'; };
        }, 150);
    }

    /**
     * Navigate Next / Prev Image
     */
    window.nextImage = function () {
        const total = roomImages[currentRoom] || 1;
        currentImageIndex = currentImageIndex < total ? currentImageIndex + 1 : 1;
        updateGalleryImage();
    };

    window.prevImage = function () {
        const total = roomImages[currentRoom] || 1;
        currentImageIndex = currentImageIndex > 1 ? currentImageIndex - 1 : total;
        updateGalleryImage();
    };

    /**
     * Event Listeners (Backdrop click, ESC, Arrow Keys)
     */
    function setupGalleryListeners() {
        const modal = document.getElementById('galleryModal');
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === this) closeGallery();
            });
        }

        document.addEventListener('keydown', function (e) {
            const modalEl = document.getElementById('galleryModal');
            if (!modalEl || modalEl.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }
})();
