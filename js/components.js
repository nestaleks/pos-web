class ComponentLoader {
    constructor() {
        this.cache = new Map();
    }

    async load(selector, path) {
        const target = document.querySelector(selector);
        if (!target) return;

        try {
            let html = this.cache.get(path);
            if (!html) {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
                html = await response.text();
                this.cache.set(path, html);
            }
            target.innerHTML = html;
        } catch (error) {
            target.innerHTML = '<div class="component-error" role="alert">Navigation is temporarily unavailable. Refresh the page or contact support.</div>';
            throw new Error(`Unable to load ${path}: ${error.message}`);
        }
    }

    setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
            const linkPage = (link.getAttribute('href') || '').split('#')[0];
            const isActive = linkPage === currentPage || (currentPage === 'index.html' && linkPage === 'index.html');
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    async init() {
        await Promise.all([
            this.load('#header-placeholder', 'components/header.html'),
            this.load('#mobile-menu-placeholder', 'components/mobile-menu.html'),
            this.load('#footer-placeholder', 'components/footer.html')
        ]);
        this.setActiveNavigation();
        if (window.Vectis) window.Vectis.init();
        document.documentElement.classList.add('components-ready');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader().init().catch((error) => console.error(error));
});
