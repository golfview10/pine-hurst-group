// Theme Logic: Scroll Animations & Interactions (2026 Edition)

document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for Scroll Reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Target elements with .fade-up or .fade-in
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in');
    animatedElements.forEach(el => observer.observe(el));


    // 2. Navbar Scroll Effect (Glassmorphism)
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('glass', 'shadow-md');
                navbar.classList.remove('bg-transparent', 'md:bg-transparent');
                // Note: Specific background removal depends on the page's initial state
            } else {
                navbar.classList.remove('glass', 'shadow-md');
                // Optional: Revert to transparent if needed, or let HTML classes handle it
            }
        });
    }

    // 3. Mobile Menu Logic
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            // Toggle Visibility
            if (mobileMenu.classList.contains('hidden')) {
                // OPEN
                mobileMenu.classList.remove('hidden');
                // Small delay to allow display:flex to apply before opacity transition
                setTimeout(() => {
                    mobileMenu.classList.remove('scale-y-0', 'opacity-0');
                }, 10);
            } else {
                // CLOSE
                mobileMenu.classList.add('scale-y-0', 'opacity-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300); // Match transition duration
            }
        });
    }

    // Global toggle function for links
    window.toggleMobileMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('scale-y-0', 'opacity-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    };
});
