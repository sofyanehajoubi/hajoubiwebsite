document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // =========================================
    // Wistia Player: Freeze on Last Frame
    // =========================================
    window._wq = window._wq || [];
    window._wq.push({
        id: 'xyi7envvly',
        onReady: function (video) {
            video.bind('end', function () {
                var duration = video.duration();
                video.time(Math.max(0, duration - 0.5));
                video.pause();
                return video.unbind;
            });
        }
    });



    // Custom Cursor Movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover Effect for Links
    const links = document.querySelectorAll('a, button, .scroll-indicator');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // Mobile Menu Toggle
    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close mobile menu when tapping outside (on the overlay)
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-text, .fade-up');
    animatedElements.forEach(el => observer.observe(el));

    // =========================================
    // Gallery Slide-In Observer
    // Watches each .gallery-item; when it enters
    // the viewport, fires .in-view on both the
    // image link and the text block simultaneously.
    // The text's CSS transition-delay creates the
    // synchronized stagger automatically.
    // =========================================
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                item.querySelectorAll('.g-slide-left, .g-slide-right').forEach(el => {
                    el.classList.add('in-view');
                });
                galleryObserver.unobserve(item); // animate once
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.gallery-item').forEach(item => {
        galleryObserver.observe(item);
    });

    // Back to Top functionality for Mobile
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll Spy for Navigation Links
    const sections = document.querySelectorAll('section[id], main[id]');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (sections.length > 0 && navItems.length > 0) {
        window.addEventListener('scroll', () => {
            let current = 'home'; // Default to home at the very top
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Use a smaller threshold or allow top detection
                if (window.scrollY >= (sectionTop - window.innerHeight / 2)) {
                    if (section.getAttribute('id')) {
                        current = section.getAttribute('id');
                    }
                }
            });

            navItems.forEach(a => {
                a.classList.remove('active');
                const href = a.getAttribute('href') || '';
                if (href.includes(`#${current}`)) {
                    a.classList.add('active');
                }
            });
        });
        
        // Trigger initial check
        window.dispatchEvent(new Event('scroll'));
    }
});


