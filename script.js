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
});
