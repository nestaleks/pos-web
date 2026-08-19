(function () {
    'use strict';

    let initialized = false;

    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navigation = document.querySelector('.mobile-navigation');
        const overlay = document.querySelector('.mobile-menu-overlay');
        if (!toggle || !navigation || !overlay) return;

        const focusable = () => navigation.querySelectorAll('a[href], button:not([disabled])');

        function setOpen(open, restoreFocus = true) {
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            navigation.classList.toggle('mobile-menu-open', open);
            navigation.setAttribute('aria-hidden', String(!open));
            overlay.classList.toggle('active', open);
            overlay.setAttribute('aria-hidden', String(!open));
            document.body.classList.toggle('menu-open', open);
            if (open) focusable()[0]?.focus();
            else if (restoreFocus) toggle.focus();
        }

        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
        overlay.addEventListener('click', () => setOpen(false));
        navigation.addEventListener('click', (event) => {
            if (event.target.closest('a')) setOpen(false, false);
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
            if (event.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
            const items = [...focusable()];
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1100 && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, false);
        }, { passive: true });
    }

    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const id = link.getAttribute('href');
                if (!id || id === '#') return;
                const target = document.querySelector(id);
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                history.replaceState(null, '', id);
            });
        });
    }

    function initScrollAnimations() {
        const elements = document.querySelectorAll('.section-header, .overview-card, .feature-card, .industry-card, .product-card, .pricing-card, .support-card, .knowledge-card, .case-card');
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            elements.forEach((element) => element.classList.add('animate'));
            return;
        }
        elements.forEach((element) => element.classList.add('animate-on-scroll'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            });
        }, { threshold: .08, rootMargin: '0px 0px -40px' });
        elements.forEach((element) => observer.observe(element));
    }

    function initHeaderScrollEffect() {
        const header = document.querySelector('.header');
        if (!header) return;
        const update = () => header.classList.toggle('header-scrolled', window.scrollY > 20);
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    function initContactForm() {
        document.querySelectorAll('.contact-form').forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!form.reportValidity()) return;
                const button = form.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = 'Sending…';
                window.setTimeout(() => {
                    let status = form.querySelector('.form-status');
                    if (!status) {
                        status = document.createElement('p');
                        status.className = 'form-status';
                        status.setAttribute('role', 'status');
                        form.append(status);
                    }
                    status.textContent = 'Message prepared. The Vectis team will reply within one business day.';
                    button.textContent = originalText;
                    button.disabled = false;
                    form.reset();
                    status.focus?.();
                }, 650);
            });
        });
    }

    function initRoiCalculator() {
        const form = document.querySelector('.roi-form');
        if (!form) return;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const data = new FormData(form);
            const revenue = Number(data.get('revenue'));
            const locations = Math.max(1, Number(data.get('locations')) || 1);
            const foodCost = Number(data.get('foodCost')) / 100;
            const waste = Number(data.get('waste')) / 100;
            const estimatedMonthlySavings = revenue * foodCost * waste * .21;
            let output = form.querySelector('.roi-result');
            if (!output) {
                output = document.createElement('output');
                output.className = 'roi-result';
                output.setAttribute('aria-live', 'polite');
                form.append(output);
            }
            const formatted = new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(estimatedMonthlySavings);
            output.textContent = `Illustrative inventory savings: ${formatted} per month across ${locations} ${locations === 1 ? 'location' : 'locations'}.`;
        });
    }

    function init() {
        if (initialized) return;
        initialized = true;
        initMobileMenu();
        initSmoothScrolling();
        initScrollAnimations();
        initHeaderScrollEffect();
        initContactForm();
        initRoiCalculator();
    }

    window.Vectis = { init };
})();
