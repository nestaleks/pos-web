// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    initMobileMenu();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Header scroll effect
    initHeaderScrollEffect();
    
    // Stats counter animation
    initStatsCounter();
    
    // Parallax effects
    initParallaxEffects();
    
    // Form handling
    initFormHandling();
    
    // Typing animation for hero title
    initTypingAnimation();
    
    // Sticky call-to-action
    initGlobalCTA();
});

// Mobile Menu
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.mobile-navigation');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuToggle && navigation && overlay) {
        function openMenu() {
            mobileMenuToggle.classList.add('active');
            navigation.classList.add('mobile-menu-open');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
        }
        
        function closeMenu() {
            mobileMenuToggle.classList.remove('active');
            navigation.classList.remove('mobile-menu-open');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
        
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navigation.classList.contains('mobile-menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking outside navigation
        document.addEventListener('click', function(e) {
            if (!navigation.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu when clicking on navigation links
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) {
        return;
    }
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }
            
            e.preventDefault();
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length || !('IntersectionObserver' in window)) {
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add stagger effect for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const cards = document.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-scaleIn');
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add scroll classes to elements
    const sections = document.querySelectorAll('.section-header, .feature-card, .pricing-card, .about-content');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) {
        return;
    }
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        header.classList.toggle('header-scrolled', scrollTop > 100);
        header.style.transform = 'translateY(0)';
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const counters = document.querySelectorAll('.metric-value');
    if (!counters.length || !('IntersectionObserver' in window)) {
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            
            const target = entry.target;
            animateCounter(target, target.dataset.target || target.textContent.trim(), 2000);
            observer.unobserve(target);
        });
    }, { threshold: 0.4 });
    
    counters.forEach(counter => {
        counter.dataset.target = counter.textContent.trim();
        observer.observe(counter);
    });
}

function animateCounter(element, finalValue, duration) {
    const numericValue = parseInt(finalValue.replace(/[^\d-]/g, ''), 10);
    if (Number.isNaN(numericValue)) {
        element.textContent = finalValue;
        return;
    }
    
    const suffix = finalValue.replace(/[\d,-]/g, '');
    let currentValue = 0;
    const increment = numericValue / Math.max(duration / 16, 1);
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }
        element.classList.add('animate');
    }, 16);
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.dashboard-img, .hero-image');
    if (!parallaxElements.length) {
        return;
    }
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('parallax-element')) {
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    });
}

// Form Handling
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    if (!forms.length) {
        return;
    }
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type=\"submit\"], .btn');
            if (!submitBtn) {
                return;
            }
            
            const originalText = submitBtn.textContent.trim();
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Sent';
                submitBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-success');
                    form.reset();
                }, 2000);
            }, 1500);
        });
    });
}
// Typing animation for hero title (skipped for long headlines)
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) {
        return;
    }
    
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const text = heroTitle.textContent.trim();
    
    if (prefersReducedMotion || text.length > 70) {
        return;
    }
    
    heroTitle.textContent = '';
    heroTitle.classList.add('typing-animation');
    
    let index = 0;
    const typeWriter = () => {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 25);
        } else {
            heroTitle.classList.remove('typing-animation');
        }
    };
    
    setTimeout(typeWriter, 100);
}
// Global CTA visibility
function initGlobalCTA() {
    const bar = document.querySelector('.global-cta-bar');
    if (!bar) {
        return;
    }

    const hideClass = 'cta-hidden';
    const hideTargets = document.querySelectorAll('#contacts, .footer');

    if ('IntersectionObserver' in window && hideTargets.length) {
        const observer = new IntersectionObserver((entries) => {
            const shouldHide = entries.some(entry => entry.isIntersecting);
            bar.classList.toggle(hideClass, shouldHide);
        }, { threshold: 0.1 });

        hideTargets.forEach(target => observer.observe(target));
    }
}

// Button Ripple Effect
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const btn = e.target;
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '&uarr;';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(100px)';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
initScrollToTop();

// Preloader
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    preloader.innerHTML = '<div class="loading-spinner" style="width: 50px; height: 50px; border-width: 5px;"></div>';
    document.body.appendChild(preloader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    });
}

// Initialize preloader
initPreloader();

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navigation = document.querySelector('.navigation');
        
        if (mobileMenuToggle && navigation) {
            mobileMenuToggle.classList.remove('active');
            navigation.classList.remove('mobile-menu-open');
            document.body.classList.remove('menu-open');
        }
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    // Handle scroll events here if needed
}, 16); // 60fps

window.addEventListener('scroll', throttledScrollHandler);
