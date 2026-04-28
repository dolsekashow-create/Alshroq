// ============= Al Shorouq Organic - Main Script =============

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Language Switcher ==========
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langSwitcher = document.querySelector('.lang-switcher');
    const currentLangEl = document.getElementById('currentLang');
    
    const langConfig = {
        ar: { dir: 'rtl', code: 'AR', name: 'العربية' },
        en: { dir: 'ltr', code: 'EN', name: 'English' },
        ru: { dir: 'ltr', code: 'RU', name: 'Русский' }
    };
    
    // Toggle dropdown
    if (langBtn) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langSwitcher.classList.toggle('active');
        });
        
        document.addEventListener('click', function() {
            langSwitcher.classList.remove('active');
        });
    }
    
    // Switch language
    document.querySelectorAll('.lang-dropdown li').forEach(item => {
        item.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
            langSwitcher.classList.remove('active');
        });
    });
    
    function switchLanguage(lang) {
        const config = langConfig[lang];
        if (!config) return;
        
        // Set HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = config.dir;
        document.documentElement.dataset.lang = lang;
        
        // Update current language display
        if (currentLangEl) currentLangEl.textContent = config.code;
        
        // Update all translatable elements
        document.querySelectorAll('[data-ar], [data-en], [data-ru]').forEach(el => {
            const text = el.dataset[lang];
            if (text) {
                // Preserve icons inside element
                const icons = el.querySelectorAll('i');
                el.textContent = text;
                icons.forEach(icon => el.appendChild(icon.cloneNode(true)));
            }
        });
        
        // Update placeholders
        document.querySelectorAll('input[placeholder]').forEach(input => {
            if (input.dataset[`placeholder${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]) {
                input.placeholder = input.dataset[`placeholder${lang.charAt(0).toUpperCase()}${lang.slice(1)}`];
            }
        });
        
        // Save preference
        localStorage.setItem('preferred-language', lang);
    }
    
    // Load saved language
    const savedLang = localStorage.getItem('preferred-language') || 'ar';
    if (savedLang !== 'ar') {
        switchLanguage(savedLang);
    }
    
    // ========== Header Scroll Effect ==========
    const header = document.querySelector('.main-header');
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        // Header shadow
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll to top button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ========== Mobile Menu ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const body = document.body;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    body.appendChild(overlay);
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            body.classList.toggle('mobile-menu-open');
            const icon = this.querySelector('i');
            if (body.classList.contains('mobile-menu-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    overlay.addEventListener('click', function() {
        body.classList.remove('mobile-menu-open');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
    
    // Close menu on link click
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (body.classList.contains('mobile-menu-open')) {
                body.classList.remove('mobile-menu-open');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target === '#' || target.length <= 1) return;
            
            const targetEl = document.querySelector(target);
            if (targetEl) {
                e.preventDefault();
                const offset = 100;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });
    
    // ========== Add to Cart Animation ==========
    const cartBtn = document.querySelector('.cart-btn');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = parseInt(localStorage.getItem('cart-count') || '0');
    
    if (cartCount) cartCount.textContent = cartItems;
    
    document.querySelectorAll('.product-actions button[aria-label="Add to Cart"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            cartItems++;
            if (cartCount) {
                cartCount.textContent = cartItems;
                cartCount.style.transform = 'scale(1.4)';
                setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
            }
            localStorage.setItem('cart-count', cartItems);
            
            // Brief feedback
            const original = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.style.background = '#4A7C2E';
            this.style.color = '#fff';
            setTimeout(() => {
                this.innerHTML = original;
                this.style.background = '';
                this.style.color = '';
            }, 1500);
        });
    });
    
    // ========== Wishlist Animation ==========
    document.querySelectorAll('.product-actions button[aria-label="Wishlist"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#C8102E';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
            }
        });
    });
    
    // ========== Intersection Observer for Animations ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in
    document.querySelectorAll('.product-card, .category-card, .stat-card, .contact-card, .feature-item').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
        observer.observe(el);
    });
    
    // ========== Console Welcome ==========
    console.log('%c🌿 Al Shorouq Organic 🌿', 'color: #C8102E; font-size: 24px; font-weight: bold; padding: 10px;');
    console.log('%cWelcome to our natural products store!', 'color: #C9A961; font-size: 14px;');
});
