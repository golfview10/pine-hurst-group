// Theme Logic: Scroll Animations & Interactions (2026 Edition)

(function () {
    'use strict';

    let observer = null;

    const observerOptions = {
        root: null,
        rootMargin: '50px 0px 50px 0px', // Preload slightly before appearing
        threshold: 0.05
    };

    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
    }

    /**
     * Scan and register elements for scroll animations
     * Immediately reveals elements that are already in/near viewport.
     */
    window.initScrollAnimations = function (container) {
        const root = container || document;
        const selector = '.fade-up:not(.is-visible), .fade-in:not(.is-visible)';
        let elements = [];

        if (root.matches && root.matches(selector)) {
            elements.push(root);
        }
        if (root.querySelectorAll) {
            elements = elements.concat(Array.from(root.querySelectorAll(selector)));
        }

        if (elements.length === 0) return;

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // If already visible or near top of viewport, reveal immediately
            if (!observer || rect.top <= viewportHeight + 100) {
                el.classList.add('is-visible');
            } else {
                observer.observe(el);
            }
        });
    };

    // Auto-watch for dynamic DOM insertions (e.g. Firebase Live Sync, dorm-renderer)
    if ('MutationObserver' in window) {
        const domObserver = new MutationObserver((mutations) => {
            let shouldScan = false;
            mutations.forEach(m => {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    shouldScan = true;
                }
            });
            if (shouldScan) {
                window.initScrollAnimations();
            }
        });

        const startObserving = () => {
            if (document.body) {
                domObserver.observe(document.body, { childList: true, subtree: true });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserving);
        } else {
            startObserving();
        }
    }

    // Safety fallback: ensure nothing stays permanently hidden after 1.5s
    setTimeout(() => {
        const hidden = document.querySelectorAll('.fade-up:not(.is-visible), .fade-in:not(.is-visible)');
        hidden.forEach(el => el.classList.add('is-visible'));
    }, 1500);

    const initTheme = () => {
        // 1. Initial animation scan
        window.initScrollAnimations();

        // 2. Navbar Scroll Effect (Glassmorphism)
        const navbar = document.querySelector('nav');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('glass', 'shadow-md');
                    navbar.classList.remove('bg-transparent', 'md:bg-transparent');
                } else {
                    navbar.classList.remove('glass', 'shadow-md');
                }
            });
        }

        // 3. Mobile Menu Logic (with Click-Outside support)
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        const closeMobileMenu = () => {
            if (!mobileMenu || mobileMenu.classList.contains('hidden')) return;
            mobileMenu.classList.add('scale-y-0', 'opacity-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        };

        const openMobileMenu = () => {
            if (!mobileMenu) return;
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.remove('scale-y-0', 'opacity-0');
            }, 10);
        };

        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (mobileMenu.classList.contains('hidden')) {
                    openMobileMenu();
                } else {
                    closeMobileMenu();
                }
            });

            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeMobileMenu();
                }
            });
        }

        window.toggleMobileMenu = () => {
            closeMobileMenu();
        };
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
