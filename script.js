document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // =========================================
    // Splash Section Animation Logic
    // - Plays once on page load in its own section.
    // - Nav links (Work, About) navigate to their anchors
    //   without ever replaying the animation.
    // =========================================
    const player = document.getElementById('lottie-player');
    const splashScrollHint = document.getElementById('splash-scroll-hint');

    if (player) {
        player.addEventListener('complete', () => {
            // Freeze on the last frame (no glitch)
            player.pause();

            // Reveal the scroll-down hint after the animation ends
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (splashScrollHint) {
                        splashScrollHint.classList.add('visible');
                    }
                });
            });
        });
    }

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
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
        toggleMenuIcon();
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
                toggleMenuIcon();
            }
        });
    });

    function toggleMenuIcon() {
        const spans = menuToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

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
});
