/* ========================================================
   DISCOVER TOURS — JavaScript Interactions
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll Animations (Intersection Observer) ──────────
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));


    // ── Theme Toggle ───────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // ── Header Scroll Effect ──────────────────────────────
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });


    // ── Mobile Menu ───────────────────────────────────────
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    // ── Hero Particle System ─────────────────────────────
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (50 + Math.random() * 50) + '%';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';

        // Random color from palette
        const colors = [
            'rgba(0, 212, 170, 0.6)',
            'rgba(0, 153, 255, 0.5)',
            'rgba(124, 58, 237, 0.5)',
            'rgba(255, 140, 66, 0.4)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);
    }


    // ── Counter Animations ───────────────────────────────
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatNumber(target) + '+';
            }
        }

        requestAnimationFrame(update);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
        }
        return num.toString();
    }


    // ── Panorama Slider ──────────────────────────────────
    const track = document.getElementById('panoramaTrack');
    const leftBtn = document.getElementById('panLeft');
    const rightBtn = document.getElementById('panRight');

    let panOffset = 0;
    const panStep = 344; // item width + gap

    function getMaxOffset() {
        const trackWidth = track.scrollWidth;
        const wrapperWidth = track.parentElement.offsetWidth;
        return Math.max(0, trackWidth - wrapperWidth);
    }

    rightBtn.addEventListener('click', () => {
        const max = getMaxOffset();
        panOffset = Math.min(panOffset + panStep, max);
        track.style.transform = `translateX(-${panOffset}px)`;
    });

    leftBtn.addEventListener('click', () => {
        panOffset = Math.max(panOffset - panStep, 0);
        track.style.transform = `translateX(-${panOffset}px)`;
    });

    // Drag to scroll panorama
    let isDragging = false;
    let startX = 0;
    let startOffset = 0;

    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startOffset = panOffset;
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.clientX;
        const max = getMaxOffset();
        panOffset = Math.max(0, Math.min(startOffset + diff, max));
        track.style.transform = `translateX(-${panOffset}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        track.style.cursor = 'grab';
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startOffset = panOffset;
        track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.touches[0].clientX;
        const max = getMaxOffset();
        panOffset = Math.max(0, Math.min(startOffset + diff, max));
        track.style.transform = `translateX(-${panOffset}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });


    // ── Smooth Scroll for Anchor Links ───────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ── Parallax Effect on Hero ──────────────────────────
    const heroContent = document.querySelector('.hero__container');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            const opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            const translateY = scrolled * 0.3;
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
    }, { passive: true });

});
