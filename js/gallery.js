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
    let customRoomImageLists = {};

    /**
     * Update room images dynamically (from Firebase or live data)
     * Replaces carousel <img> elements and registers URLs for the gallery modal
     */
    window.updateRoomImages = function (room, urls) {
        if (!room || !Array.isArray(urls) || urls.length === 0) return;
        const normalized = room.toLowerCase().replace(/[\s_]+/g, '-');
        
        // Register in storage for both raw and normalized keys
        customRoomImageLists[normalized] = urls;
        customRoomImageLists[room] = urls;
        roomImages[normalized] = urls.length;
        roomImages[room] = urls.length;

        // Common dorm aliases
        if (normalized === 'fan') { customRoomImageLists['studio-fan'] = urls; roomImages['studio-fan'] = urls.length; }
        if (normalized === 'air') { customRoomImageLists['studio-air'] = urls; roomImages['studio-air'] = urls.length; }
        if (normalized === 'renew' || normalized === 're-new') {
            customRoomImageLists['re-new'] = urls;
            customRoomImageLists['renew'] = urls;
            roomImages['re-new'] = urls.length;
            roomImages['renew'] = urls.length;
        }
        if (normalized === 'standard') { customRoomImageLists['monthly-1bed'] = urls; roomImages['monthly-1bed'] = urls.length; }
        if (normalized === 'suite') { customRoomImageLists['monthly-2bed'] = urls; roomImages['monthly-2bed'] = urls.length; }
        if (normalized === 'monthly1bed') { customRoomImageLists['monthly-1bed'] = urls; roomImages['monthly-1bed'] = urls.length; }
        if (normalized === 'monthly2bed') { customRoomImageLists['monthly-2bed'] = urls; roomImages['monthly-2bed'] = urls.length; }
        if (normalized === 'daily1bed') { customRoomImageLists['daily-1bed'] = urls; roomImages['daily-1bed'] = urls.length; }
        if (normalized === 'daily2bed') { customRoomImageLists['daily-2bed'] = urls; roomImages['daily-2bed'] = urls.length; }

        // Find carousel container
        const container = document.getElementById(`carousel-${normalized}`) ||
                          document.getElementById(`carousel-${room}`) ||
                          document.getElementById(`carousel-studio-${normalized}`) ||
                          (normalized === 'fan' && document.getElementById('carousel-studio-fan')) ||
                          (normalized === 'air' && document.getElementById('carousel-studio-air')) ||
                          (normalized === 'standard' && document.getElementById('carousel-monthly-1bed')) ||
                          (normalized === 'suite' && document.getElementById('carousel-monthly-2bed')) ||
                          (normalized === 'monthly1bed' && document.getElementById('carousel-monthly-1bed')) ||
                          (normalized === 'monthly2bed' && document.getElementById('carousel-monthly-2bed')) ||
                          (normalized === 'daily1bed' && document.getElementById('carousel-daily-1bed')) ||
                          (normalized === 'daily2bed' && document.getElementById('carousel-daily-2bed'));

        if (container) {
            const overlay = container.querySelector('.group-hover\\:opacity-100') || container.querySelector('div:last-child');
            const existingImgs = container.querySelectorAll('img');
            existingImgs.forEach(img => img.remove());

            urls.forEach((url, i) => {
                const newImg = document.createElement('img');
                newImg.src = url;
                newImg.className = `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === 0 ? 'opacity-100' : 'opacity-0'}`;
                if (overlay) {
                    container.insertBefore(newImg, overlay);
                } else {
                    container.appendChild(newImg);
                }
            });

            // Restart interval for this container
            startSingleCarousel(container, 3000);
        }
    };

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

    const activeIntervals = {};

    function startSingleCarousel(container, interval) {
        if (!container) return;
        const id = container.id || Math.random().toString();
        if (activeIntervals[id]) {
            clearInterval(activeIntervals[id]);
            delete activeIntervals[id];
        }

        const images = container.getElementsByTagName('img');
        if (images.length < 2) return;

        let currentIndex = 0;
        activeIntervals[id] = setInterval(() => {
            const currentImgs = container.getElementsByTagName('img');
            if (currentImgs.length < 2) return;
            currentImgs[currentIndex % currentImgs.length].classList.remove('opacity-100');
            currentImgs[currentIndex % currentImgs.length].classList.add('opacity-0');
            currentIndex = (currentIndex + 1) % currentImgs.length;
            currentImgs[currentIndex % currentImgs.length].classList.remove('opacity-0');
            currentImgs[currentIndex % currentImgs.length].classList.add('opacity-100');
        }, interval || 3000);
    }

    /**
     * Auto-rotating Carousel logic
     */
    function initCarousels(roomTypes, interval) {
        roomTypes.forEach(type => {
            const container = document.getElementById(`carousel-${type}`);
            if (container) startSingleCarousel(container, interval);
        });
    }

    function getTotalRoomImages(room) {
        if (!room) return 1;
        const norm = room.toLowerCase().replace(/[\s_]+/g, '-');
        if (customRoomImageLists[room] && customRoomImageLists[room].length) return customRoomImageLists[room].length;
        if (customRoomImageLists[norm] && customRoomImageLists[norm].length) return customRoomImageLists[norm].length;
        return roomImages[room] || roomImages[norm] || 1;
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

        const total = getTotalRoomImages(currentRoom);

        img.style.opacity = '0.5';
        setTimeout(() => {
            const normalized = currentRoom.toLowerCase().replace(/[\s_]+/g, '-');
            if (customRoomImageLists[normalized] && customRoomImageLists[normalized][currentImageIndex - 1]) {
                img.src = customRoomImageLists[normalized][currentImageIndex - 1];
            } else if (customRoomImageLists[currentRoom] && customRoomImageLists[currentRoom][currentImageIndex - 1]) {
                img.src = customRoomImageLists[currentRoom][currentImageIndex - 1];
            } else {
                img.src = `image/${galleryFolder}/${currentRoom}/${currentImageIndex}.png`;
            }
            if (caption) caption.innerText = roomNames[currentRoom] || currentRoom;
            if (indexEl) {
                indexEl.innerText = currentImageIndex;
                if (indexEl.parentNode) {
                    const parent = indexEl.parentNode;
                    const match = parent.innerHTML.match(/\/\s*(\d+)/);
                    if (match && match[1] !== String(total)) {
                        parent.innerHTML = `(<span id="currentImageIndex">${currentImageIndex}</span>/${total})`;
                    }
                }
            }
            img.onload = () => { img.style.opacity = '1'; };
        }, 150);
    }

    /**
     * Navigate Next / Prev Image
     */
    window.nextImage = function () {
        const total = getTotalRoomImages(currentRoom);
        currentImageIndex = currentImageIndex < total ? currentImageIndex + 1 : 1;
        updateGalleryImage();
    };

    window.prevImage = function () {
        const total = getTotalRoomImages(currentRoom);
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
