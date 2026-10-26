/* ══════════════════════════════════════════════════════
   NAZIRUDDIN S — PORTFOLIO JAVASCRIPT
   Premium interactive animations & effects
   ══════════════════════════════════════════════════════ */

'use strict';

// ─── PARTICLE NETWORK ─────────────────────────────────
class ParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 120 };
        this.animId = null;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const density = 14000;
        const count = Math.floor((this.canvas.width * this.canvas.height) / density);

        for (let i = 0; i < count; i++) {
            const size = Math.random() * 1.5 + 0.5;
            this.particles.push({
                x:  Math.random() * this.canvas.width,
                y:  Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.6 ? '#6366f1' : Math.random() > 0.5 ? '#8b5cf6' : '#818cf8'
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse repulsion
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.hypot(dx, dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x -= (dx / dist) * force * 2.5;
                    p.y -= (dy / dist) * force * 2.5;
                }
            }

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.hypot(dx2, dy2);

                if (dist2 < 110) {
                    const opacity = (1 - dist2 / 110) * 0.25;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 0.6;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        this.animId = requestAnimationFrame(() => this.animate());
    }
}

// ─── TYPING EFFECT ────────────────────────────────────
class TypeWriter {
    constructor(el, titles, opts = {}) {
        this.el        = el;
        this.titles    = titles;
        this.typeSpeed = opts.typeSpeed   || 80;
        this.delSpeed  = opts.delSpeed    || 45;
        this.pauseTime = opts.pauseTime   || 2200;
        this.waitTime  = opts.waitTime    || 400;

        this.idx       = 0;
        this.charIdx   = 0;
        this.deleting  = false;
        this.run();
    }

    run() {
        const current = this.titles[this.idx];
        if (this.deleting) {
            this.el.textContent = current.substring(0, this.charIdx - 1);
            this.charIdx--;
        } else {
            this.el.textContent = current.substring(0, this.charIdx + 1);
            this.charIdx++;
        }

        let delay = this.deleting ? this.delSpeed : this.typeSpeed;

        if (!this.deleting && this.charIdx === current.length) {
            delay = this.pauseTime;
            this.deleting = true;
        } else if (this.deleting && this.charIdx === 0) {
            this.deleting = false;
            this.idx = (this.idx + 1) % this.titles.length;
            delay = this.waitTime;
        }

        setTimeout(() => this.run(), delay);
    }
}

// ─── SCROLL ANIMATIONS ────────────────────────────────
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            this.onIntersect.bind(this),
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        this.observe();
    }

    observe() {
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observer.observe(el);
        });
    }

    onIntersect(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const delay = parseInt(el.dataset.delay || 0);

            setTimeout(() => {
                el.classList.add('animated');
            }, delay);

            this.observer.unobserve(el);
        });
    }
}

// ─── NAVBAR ───────────────────────────────────────────
class Navbar {
    constructor() {
        this.nav       = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.menu      = document.getElementById('navMenu');
        this.links     = document.querySelectorAll('.nav-link');
        this.sections  = document.querySelectorAll('section[id]');

        this.bindEvents();
        this.onScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });

        this.hamburger.addEventListener('click', () => this.toggleMenu());

        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                this.closeMenu();
            });
        });

        // Close on backdrop click
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target)) this.closeMenu();
        });
    }

    toggleMenu() {
        const open = this.menu.classList.toggle('open');
        this.hamburger.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    closeMenu() {
        this.menu.classList.remove('open');
        this.hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    onScroll() {
        const scrolled = window.scrollY > 60;
        this.nav.classList.toggle('scrolled', scrolled);
        this.updateActiveLink();
    }

    updateActiveLink() {
        let current = '';
        this.sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.id;
        });

        this.links.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${current}`);
        });
    }
}

// ─── BACK TO TOP ──────────────────────────────────────
class BackToTop {
    constructor() {
        this.btn = document.getElementById('backToTop');
        if (!this.btn) return;

        window.addEventListener('scroll', () => {
            this.btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        this.btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ─── CONTACT FORM ─────────────────────────────────────
class ContactForm {
    constructor() {
        this.form    = document.getElementById('contactForm');
        this.msg     = document.getElementById('formMessage');
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const btn = this.form.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(this.form).entries());

        btn.disabled    = true;
        btn.innerHTML   = '<span>Sending...</span>';

        try {
            const res    = await fetch('/contact', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                this.showMsg('success', result.message || '✓ Message sent! Check your email for confirmation.');
                this.form.reset();
            } else {
                this.showMsg('error', result.error || 'Something went wrong. Please try again.');
            }
        } catch {
            this.showMsg('error', 'Network error. Please check your connection.');
        } finally {
            btn.disabled  = false;
            btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
        }
    }

    showMsg(type, text) {
        this.msg.textContent = text;
        this.msg.className   = `form-message ${type}`;
        setTimeout(() => {
            this.msg.className = 'form-message';
        }, 6000);
    }
}

// ─── SMOOTH ANCHOR LINKS ──────────────────────────────
function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href   = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ─── CARD HOVER TILT ─────────────────────────────────
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .education-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const tiltX  = ((y - cy) / cy) * 5;
            const tiltY  = ((x - cx) / cx) * -5;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ─── COUNTER ANIMATION (Stat Cards) ──────────────────
function animateCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const end   = parseFloat(el.dataset.count || el.textContent);
            const isInt = Number.isInteger(end);
            let start   = 0;
            const steps = 50;
            const step  = end / steps;

            const tick = setInterval(() => {
                start += step;
                if (start >= end) {
                    el.textContent = isInt ? end : end.toFixed(1);
                    clearInterval(tick);
                } else {
                    el.textContent = isInt ? Math.floor(start) : start.toFixed(1);
                }
            }, 30);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
}

// ─── CURSOR GLOW ──────────────────────────────────────
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
        border-radius: 50%; transform: translate(-50%, -50%);
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
        glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
}

// ─── HERO REVEAL ANIMATION ────────────────────────────
function initHeroReveal() {
    const heroText  = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-40px)';
        setTimeout(() => {
            heroText.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
        }, 200);
    }

    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateX(40px)';
        setTimeout(() => {
            heroVisual.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateX(0)';
        }, 400);
    }
}

// ─── SKILLS STAGGER ──────────────────────────────────
function initSkillTagHover() {
    document.querySelectorAll('.skill-panel').forEach(panel => {
        const tags = panel.querySelectorAll('.skill-tag');
        panel.addEventListener('mouseenter', () => {
            tags.forEach((tag, i) => {
                setTimeout(() => {
                    tag.style.transition = 'all 0.25s ease';
                    tag.style.background  = 'rgba(99,102,241,0.1)';
                    tag.style.borderColor = 'rgba(99,102,241,0.25)';
                    tag.style.color       = 'var(--indigo-light)';
                }, i * 30);
            });
        });
        panel.addEventListener('mouseleave', () => {
            tags.forEach(tag => {
                tag.style.background  = '';
                tag.style.borderColor = '';
                tag.style.color       = '';
            });
        });
    });
}

// ─── THEME TOGGLE ────────────────────────────────────
class ThemeToggle {
    constructor() {
        this.btn  = document.getElementById('themeToggle');
        this.body = document.body;
        if (!this.btn) return;

        // Restore saved preference
        const saved = localStorage.getItem('portfolio-theme');
        if (saved === 'light') this.body.classList.add('light-theme');

        this.btn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        const isLight = this.body.classList.toggle('light-theme');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');

        // Ripple pulse on button
        this.btn.style.transform = 'scale(0.88) translateY(-1px)';
        setTimeout(() => { this.btn.style.transform = ''; }, 200);
    }
}

// ─── IFRAME SCROLL CURSOR ────────────────────────────
function initScrollCursor() {
    // Handle multiple featured projects
    const featuredPreviews = document.querySelectorAll('.featured-preview');

    featuredPreviews.forEach((preview, index) => {
        const content  = preview.querySelector('.browser-content');
        const cursor   = preview.querySelector('.custom-scroll-cursor');
        const iframe   = preview.querySelector('.site-iframe');
        if (!preview || !content || !cursor || !iframe) return;

        let iframeScrollY = 0;
        let isDown        = false;
        let lastY         = 0;

        // Track mouse inside browser-content → move custom cursor
        content.addEventListener('mousemove', (e) => {
            const rect = content.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cursor.style.left = x + 'px';
            cursor.style.top  = y + 'px';
        });

        // Wheel → simulate scroll inside iframe via CSS transform
        content.addEventListener('wheel', (e) => {
            e.preventDefault();
            iframeScrollY = Math.max(0, iframeScrollY + e.deltaY);
            iframe.style.transform = `translateY(-${iframeScrollY * 0.55}px)`;
            iframe.style.transition = 'transform 0.15s ease-out';

            // Show scrolling state
            preview.classList.add('is-scrolling');
            clearTimeout(preview._scrollTimer);
            preview._scrollTimer = setTimeout(() => preview.classList.remove('is-scrolling'), 400);
        }, { passive: false });

        // Drag-to-scroll
        content.addEventListener('mousedown', (e) => {
            isDown = true;
            lastY  = e.clientY;
            content.style.cursor = 'none';
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const dy = lastY - e.clientY;
            lastY    = e.clientY;
            iframeScrollY = Math.max(0, iframeScrollY + dy * 1.5);
            iframe.style.transform = `translateY(-${iframeScrollY * 0.55}px)`;
            iframe.style.transition = 'none';
            preview.classList.add('is-scrolling');
        });

        // Reset on mouse leave
        content.addEventListener('mouseleave', () => {
            preview.classList.remove('is-scrolling');
        });
    });
}

// ─── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    new ParticleNetwork();

    // Typing effect
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        new TypeWriter(typingEl, [
            'Enterprise Software Consultant',
            'DevOps Engineer',
            'ERP Support Specialist',
            'Cloud Infrastructure Engineer',
            'CI/CD Pipeline Architect'
        ], { typeSpeed: 75, delSpeed: 40, pauseTime: 2400 });
    }

    // Core modules
    new Navbar();
    new ScrollAnimator();
    new BackToTop();
    new ContactForm();
    new ThemeToggle();

    // Enhancements
    bindSmoothScroll();
    initCursorGlow();
    initHeroReveal();
    animateCounters();
    initSkillTagHover();
    initScrollCursor();

    // Tilt on desktop only
    if (window.innerWidth > 768) {
        initTiltEffect();
    }

    // Progress bars: trigger when visible
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.style.getPropertyValue('--progress') || getComputedStyle(bar).getPropertyValue('--progress');
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
        progressObserver.observe(bar);
    });
});
