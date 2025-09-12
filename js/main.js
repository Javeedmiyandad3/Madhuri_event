/**
 * Main Application Controller - Updated for new layout
 */

class MainApp {
  constructor() {
    this.isLoaded = false;
    this.controllers = {};
    this.currentServiceSlide = 0;
    this.isPartyMode = false;
    this.serviceSlideInterval = null;
    
    this.init();
  }

  async init() {
    try {
      this.showLoading();
      this.setupErrorHandling();
      this.setupAccessibilityFeatures();
      
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      await this.initializeComponents();
      this.setupGlobalEventListeners();
      this.hideLoading();
      
      this.isLoaded = true;
      console.log('Elegant Events website loaded successfully');
      
    } catch (error) {
      console.error('Error initializing application:', error);
      this.handleError(error);
    }
  }

  async initializeComponents() {
    // Initialize portfolio
    this.createPortfolio();
    
    // Initialize services slider
    this.createServicesSlider();
    
    // Initialize floating elements
    this.createFloatingElements();
    
    // Setup modal
    this.setupModal();
    
    // Setup navigation
    this.setupNavigation();
    
    // Start auto-sliders
    this.startAutoSliders();
  }

  createPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '';
    
    PORTFOLIO_DATA.forEach(item => {
      const portfolioCard = document.createElement('article');
      portfolioCard.className = 'portfolio-card';
      portfolioCard.innerHTML = `
        <img src="${item.image}" 
             alt="${item.name}" 
             class="portfolio-image" 
             loading="lazy"
             onclick="app.openModal('${item.image}', '${item.name}', '${item.description}')">
        <div class="portfolio-info">
          <h3 class="portfolio-name">${item.name}</h3>
          <p class="portfolio-description">${item.description}</p>
        </div>
      `;
      portfolioGrid.appendChild(portfolioCard);
    });
  }

  createServicesSlider() {
    const servicesTrack = document.getElementById('services-track');
    const serviceDots = document.getElementById('service-dots');
    
    if (!servicesTrack || !serviceDots) return;

    servicesTrack.innerHTML = '';
    serviceDots.innerHTML = '';
    
    SERVICES_DATA.forEach((service, index) => {
      // Create service slide
      const serviceSlide = document.createElement('div');
      serviceSlide.className = 'service-slide';
      
      const currentImage = service.images[0]; // Show first image
      
      serviceSlide.innerHTML = `
        <div class="service-content">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <ul class="service-features">
            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="service-image-container">
          <img src="${currentImage}" 
               alt="${service.title}" 
               class="service-image"
               loading="lazy">
        </div>
      `;
      servicesTrack.appendChild(serviceSlide);

      // Create dot
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.onclick = () => this.goToServiceSlide(index);
      dot.setAttribute('aria-label', `Go to ${service.title}`);
      serviceDots.appendChild(dot);
    });
  }

  changeServiceSlide(direction) {
    this.currentServiceSlide += direction;
    if (this.currentServiceSlide >= SERVICES_DATA.length) this.currentServiceSlide = 0;
    if (this.currentServiceSlide < 0) this.currentServiceSlide = SERVICES_DATA.length - 1;
    this.updateServiceSlider();
  }

  goToServiceSlide(index) {
    this.currentServiceSlide = index;
    this.updateServiceSlider();
  }

  updateServiceSlider() {
    const servicesTrack = document.getElementById('services-track');
    const dots = document.querySelectorAll('#service-dots .dot');
    
    if (servicesTrack) {
      servicesTrack.style.transform = `translateX(-${this.currentServiceSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentServiceSlide);
    });
  }

  startAutoSliders() {
    // Auto-advance services slider
    this.serviceSlideInterval = setInterval(() => {
      this.changeServiceSlide(1);
    }, 6000);
  }

  stopAutoSliders() {
    if (this.serviceSlideInterval) {
      clearInterval(this.serviceSlideInterval);
    }
  }

  createFloatingElements() {
    const container = document.getElementById('floating-elements');
    if (!container) return;

    const elements = ['🎈', '🌸', '🌺', '🎂', '🧁', '⭐', '✨', '🎉', '🎊', '🦋', '🌟'];
    const colors = ['#ff6b9d', '#ffd700', '#6c5ce7', '#a8e6cf'];

    // Create initial static elements
    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      element.textContent = elements[Math.floor(Math.random() * elements.length)];
      element.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 5}s;
        font-size: ${1 + Math.random() * 1.5}rem;
      `;
      element.setAttribute('aria-hidden', 'true');
      container.appendChild(element);
    }

    // Create floating elements periodically
    setInterval(() => {
      if (container.children.length > 30) return; // Limit elements
      
      const element = document.createElement('div');
      element.className = 'floating-element';
      element.textContent = elements[Math.floor(Math.random() * elements.length)];
      element.style.cssText = `
        left: ${Math.random() * 100}%;
        top: 100%;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        animation: balloonRise ${10 + Math.random() * 10}s linear;
        font-size: ${1 + Math.random() * 1.5}rem;
      `;
      element.setAttribute('aria-hidden', 'true');
      container.appendChild(element);
      
      setTimeout(() => {
        if (element.parentNode) element.remove();
      }, 20000);
    }, 3000);
  }

  setupModal() {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalImage || !modalClose) return;

    modalClose.addEventListener('click', () => this.closeModal());
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        this.closeModal();
      }
    });
  }

  openModal(imageSrc, title, description) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    
    if (modal && modalImage) {
      modalImage.src = imageSrc;
      modalImage.alt = title;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  setupNavigation() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        }
      });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight + 60; // Include top bar
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu
          if (navMenu) navMenu.classList.remove('active');
        }
      });
    });

    // Header scroll behavior
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      const topBar = document.querySelector('.top-contact-bar');
      
      if (window.scrollY > 100) {
        header?.classList.add('scrolled');
        if (topBar) topBar.style.transform = 'translateY(-100%)';
      } else {
        header?.classList.remove('scrolled');
        if (topBar) topBar.style.transform = 'translateY(0)';
      }
    });
  }

  togglePartyMode() {
    this.isPartyMode = !this.isPartyMode;
    document.body.classList.toggle('party-mode', this.isPartyMode);
    
    const toggleBtn = document.querySelector('.theme-toggle span');
    if (toggleBtn) {
      toggleBtn.textContent = this.isPartyMode ? 'Normal Mode' : 'Party Mode';
    }
    
    // Add extra floating elements in party mode
    if (this.isPartyMode) {
      this.addPartyElements();
    }
    
    this.announce(this.isPartyMode ? 'Party mode activated!' : 'Normal mode restored');
  }

  addPartyElements() {
    const container = document.getElementById('floating-elements');
    if (!container) return;

    const partyElements = ['🎊', '🎉', '🥳', '🍰', '🎁', '🎭', '🪩'];
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const element = document.createElement('div');
        element.className = 'floating-element party-element';
        element.textContent = partyElements[Math.floor(Math.random() * partyElements.length)];
        element.style.cssText = `
          left: ${Math.random() * 100}%;
          top: 100%;
          color: #ff1493;
          animation: balloonRise 8s linear;
          font-size: ${2 + Math.random()}rem;
        `;
        element.setAttribute('aria-hidden', 'true');
        container.appendChild(element);
        
        setTimeout(() => {
          if (element.parentNode) element.remove();
        }, 8000);
      }, i * 200);
    }
  }

  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason);
    });
  }

  setupAccessibilityFeatures() {
    // Add announcement region
    const announcements = document.createElement('div');
    announcements.id = 'announcements';
    announcements.setAttribute('aria-live', 'polite');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    document.body.appendChild(announcements);

    // Setup focus management
    this.setupFocusManagement();
  }

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal[style*="block"]');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  trapFocus(event, container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }

  setupGlobalEventListeners() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoSliders();
      } else {
        this.startAutoSliders();
      }
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.announce('Connection restored');
    });

    window.addEventListener('offline', () => {
      this.announce('Connection lost');
    });
  }

  // Utility methods
  announce(message) {
    const announcements = document.getElementById('announcements');
    if (announcements) {
      announcements.textContent = message;
    }
  }

  showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('show');
    }
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.remove('show');
      setTimeout(() => {
        loading.style.display = 'none';
      }, 300);
    }
  }

  handleError(error) {
    console.error('Application error:', error);
    this.announce('An error occurred. Please refresh the page if problems persist.');
  }

  handleResize() {
    window.dispatchEvent(new CustomEvent('app:resize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
      }
    }));
  }

  // Public API methods
  isReady() {
    return this.isLoaded;
  }

  destroy() {
    this.stopAutoSliders();
    this.isLoaded = false;
  }
}

// Initialize the application
const app = new MainApp();

// Global functions for onclick handlers
window.changeServiceSlide = (direction) => app.changeServiceSlide(direction);
window.togglePartyMode = () => app.togglePartyMode();
window.openModal = (src, title, desc) => app.openModal(src, title, desc);

// Export for global access
window.app = app;
window.MainApp = MainApp;

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.dev = {
    app,
    data: {
      portfolio: PORTFOLIO_DATA,
      services: SERVICES_DATA
    },
    togglePartyMode: () => app.togglePartyMode(),
    openModal: (src, title, desc) => app.openModal(src, title, desc)
  };
  
  console.log('Development tools available at window.dev');
}/**
 * Main Application Controller
 * Coordinates all components and handles global functionality
 */

class MainApp {
  constructor() {
    this.isLoaded = false;
    this.controllers = {};
    this.utils = {};
    
    this.init();
  }

  async init() {
    try {
      // Show loading indicator
      this.showLoading();
      
      // Initialize core functionality
      this.setupErrorHandling();
      this.setupPerformanceOptimizations();
      this.setupAccessibilityFeatures();
      
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize all controllers
      await this.initializeControllers();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Initialize contact information
      this.initializeContactInfo();
      
      // Hide loading indicator
      this.hideLoading();
      
      this.isLoaded = true;
      console.log('Elegant Events website loaded successfully');
      
    } catch (error) {
      console.error('Error initializing application:', error);
      this.handleError(error);
    }
  }

  async initializeControllers() {
    try {
      // Controllers will be initialized by their respective files
      // This is just to ensure they're ready
      await this.waitForControllers();
      
      // Store references for easy access
      this.controllers = {
        navigation: window.navigationController,
        portfolio: window.portfolioController,
        animation: window.animationController
      };
      
    } catch (error) {
      console.error('Error initializing controllers:', error);
    }
  }

  waitForControllers() {
    return new Promise((resolve) => {
      const checkControllers = () => {
        if (window.navigationController && window.portfolioController && window.animationController) {
          resolve();
        } else {
          setTimeout(checkControllers, 100);
        }
      };
      checkControllers();
    });
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason);
    });
  }

  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Setup intersection observer for performance
    this.setupIntersectionObserver();
    
    // Optimize images
    this.optimizeImages();
    
    // Setup service worker if available
    this.setupServiceWorker();
  }

  preloadCriticalResources() {
    const criticalImages = [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=400&fit=crop&auto=format'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      rootMargin: '50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
          
          // Trigger any lazy loading or animations
          this.handleElementInView(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections and major elements
    document.querySelectorAll('section, .service-card, .portfolio-category').forEach(el => {
      observer.observe(el);
    });
  }

  handleElementInView(element) {
    // Trigger lazy loading for images
    const images = element.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }

  optimizeImages() {
    // Add loading="lazy" to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.loading = 'lazy';
    });
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  setupAccessibilityFeatures() {
    // Add skip links
    this.addSkipLinks();
    
    // Setup focus management
    this.setupFocusManagement();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    // Setup ARIA live regions
    this.setupLiveRegions();
  }

  addSkipLinks() {
    const skipLinks = [
      { href: '#main', text: 'Skip to main content' },
      { href: '#portfolio', text: 'Skip to portfolio' },
      { href: '#contact', text: 'Skip to contact' }
    ];

    const skipNav = document.createElement('nav');
    skipNav.className = 'skip-links';
    skipNav.setAttribute('aria-label', 'Skip links');

    skipLinks.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.className = 'skip-link';
      skipNav.appendChild(a);
    });

    document.body.insertBefore(skipNav, document.body.firstChild);
  }

  setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal[style*="block"]');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  trapFocus(event, container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }

  setupKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + H for home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        this.scrollToSection('#home');
      }
      
      // Alt + P for portfolio
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        this.scrollToSection('#portfolio');
      }
      
      // Alt + C for contact
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        this.scrollToSection('#contact');
      }
    });
  }

  setupLiveRegions() {
    // Create announcement region
    const announcements = document.createElement('div');
    announcements.id = 'announcements';
    announcements.setAttribute('aria-live', 'polite');
    announcements.setAttribute('aria-atomic', 'true');
    announcements.className = 'sr-only';
    document.body.appendChild(announcements);
  }

  setupGlobalEventListeners() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 100);
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.announce('Connection restored');
    });

    window.addEventListener('offline', () => {
      this.announce('Connection lost');
    });

    // Handle print
    window.addEventListener('beforeprint', () => {
      this.handlePrint();
    });
  }

  initializeContactInfo() {
    // Update contact information throughout the site
    const phoneElements = document.querySelectorAll('[href^="tel:"]');
    phoneElements.forEach(el => {
      if (el.href === 'tel:+1234567890') {
        el.href = `tel:${CONTACT_CONFIG.phone}`;
      }
    });

    const emailElements = document.querySelectorAll('[href^="mailto:"]');
    emailElements.forEach(el => {
      if (el.href.includes('your-email@example.com')) {
        el.href = `mailto:${CONTACT_CONFIG.email}?subject=Event Decoration Inquiry`;
      }
    });

    const whatsappElements = document.querySelectorAll('[href*="wa.me"]');
    whatsappElements.forEach(el => {
      if (el.href.includes('1234567890')) {
        el.href = `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${encodeURIComponent(CONTACT_CONFIG.whatsapp.message)}`;
      }
    });
  }

  // Utility methods
  scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element && this.controllers.navigation) {
      this.controllers.navigation.scrollToSection(selector);
    }
  }

  announce(message) {
    const announcements = document.getElementById('announcements');
    if (announcements) {
      announcements.textContent = message;
    }
  }

  showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('show');
    }
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.remove('show');
      setTimeout(() => {
        loading.style.display = 'none';
      }, 300);
    }
  }

  handleError(error) {
    console.error('Application error:', error);
    
    // Show user-friendly error message
    this.announce('An error occurred. Please refresh the page if problems persist.');
    
    // In production, you might want to send error reports to a service
    // this.sendErrorReport(error);
  }

  handleResize() {
    // Emit custom resize event for components
    window.dispatchEvent(new CustomEvent('app:resize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
      }
    }));
  }

  handleScroll() {
    // Emit custom scroll event for components
    window.dispatchEvent(new CustomEvent('app:scroll', {
      detail: {
        scrollY: window.scrollY,
        scrollDirection: this.getScrollDirection()
      }
    }));
  }

  getScrollDirection() {
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > (this.lastScrollY || 0) ? 'down' : 'up';
    this.lastScrollY = currentScrollY;
    return direction;
  }

  handlePrint() {
    // Add print-specific classes
    document.body.classList.add('printing');
    
    // Clean up after print
    setTimeout(() => {
      document.body.classList.remove('printing');
    }, 1000);
  }

  // Public API methods
  getController(name) {
    return this.controllers[name];
  }

  isReady() {
    return this.isLoaded;
  }

  destroy() {
    // Clean up all controllers
    Object.values(this.controllers).forEach(controller => {
      if (controller && typeof controller.destroy === 'function') {
        controller.destroy();
      }
    });
    
    // Remove event listeners
    // (In a real app, you'd store references to remove them properly)
    
    this.isLoaded = false;
  }
}

// Initialize the application
const app = new MainApp();

// Export for global access
window.app = app;
window.MainApp = MainApp;

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.dev = {
    app,
    controllers: () => app.controllers,
    config: {
      portfolio: PORTFOLIO_CONFIG,
      contact: CONTACT_CONFIG,
      site: SITE_CONFIG
    }
  };
  
  console.log('Development tools available at window.dev');
}