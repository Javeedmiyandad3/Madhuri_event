/**
 * Main Application Controller for AA Decor
 * Complete version without syntax errors
 */

// Main Application Class
class MainApp {
  constructor() {
    this.isLoaded = false;
    this.currentServiceSlide = 0;
    this.serviceSlideInterval = null;
    this.init();
  }

  async init() {
    try {
      this.showLoading();
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      // Initialize all components
      this.initializeLogo();
      this.createPortfolio();
      this.createServicesSlider();
      this.enhanceFloatingElements();
      this.setupModal();
      this.setupNavigation();
      this.startAutoSliders();
      
      // Hide loading after initialization
      setTimeout(() => {
        this.hideLoading();
        this.isLoaded = true;
        console.log('AA Decor website loaded successfully');
      }, 500);
      
    } catch (error) {
      console.error('Error initializing application:', error);
      this.hideLoading();
    }
  }

  initializeLogo() {
    const logoImg = document.querySelector('.logo-img');
    const heroLogoBg = document.querySelector('.hero-logo-bg');
    
    if (logoImg) {
      logoImg.onerror = function() {
        this.style.display = 'none';
        const fallback = document.querySelector('.logo-fallback');
        if (fallback) {
          fallback.style.display = 'block';
        }
      };
      
      logoImg.onload = function() {
        const fallback = document.querySelector('.logo-fallback');
        if (fallback) {
          fallback.style.display = 'none';
        }
      };
    }
    
    if (heroLogoBg) {
      heroLogoBg.style.backgroundImage = "url('images/logo/aa-decor-logo.PNG')";
    }
  }

  createPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    // Default portfolio data if PORTFOLIO_DATA is not defined
    const portfolioData = typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : [
      {
        name: "Elegant Wedding Setup",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
        description: "Royal wedding decoration with floral arrangements",
        fallback: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"
      },
      {
        name: "Princess Birthday Party",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
        description: "Magical princess themed birthday celebration",
        fallback: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop"
      },
      {
        name: "Corporate Gala Night",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
        description: "Sophisticated corporate annual celebration",
        fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop"
      },
      {
        name: "Baby Shower Bliss",
        image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop",
        description: "Sweet and adorable baby shower decoration",
        fallback: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop"
      },
      {
        name: "Golden Anniversary",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
        description: "50th anniversary celebration with golden theme",
        fallback: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop"
      },
      {
        name: "Custom Theme Party",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
        description: "Custom themed birthday party",
        fallback: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop"
      }
    ];

    portfolioGrid.innerHTML = '';
    
    portfolioData.forEach(item => {
      const portfolioCard = document.createElement('article');
      portfolioCard.className = 'portfolio-card';
      
      const imageSrc = item.fallback || item.image;
      
      portfolioCard.innerHTML = `
        <img src="${imageSrc}" 
             alt="${item.name}" 
             class="portfolio-image" 
             loading="lazy"
             onerror="this.src='${item.fallback || 'https://via.placeholder.com/400x300'}'"
             onclick="app.openModal('${imageSrc}', '${item.name}', '${item.description}')">
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
    
    // Default services data if SERVICES_DATA is not defined
    const servicesData = typeof SERVICES_DATA !== 'undefined' ? SERVICES_DATA : [
      {
        title: "Wedding Decorations",
        description: "Transform your wedding into a fairytale with our elegant decoration services",
        features: ["Bridal Stage Decoration", "Reception Hall Setup", "Floral Arrangements", "Lighting & Draping"],
        fallbackImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop"
      },
      {
        title: "Birthday Parties",
        description: "Make birthdays unforgettable with themed decorations for all ages",
        features: ["Balloon Decorations", "Theme-based Setup", "Kids Party Special", "Cake Table Design"],
        fallbackImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop"
      },
      {
        title: "Corporate Events",
        description: "Professional decoration services for corporate functions and galas",
        features: ["Conference Setup", "Product Launch Events", "Annual Day Celebrations", "Award Ceremonies"],
        fallbackImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop"
      }
    ];

    servicesTrack.innerHTML = '';
    serviceDots.innerHTML = '';
    
    servicesData.forEach((service, index) => {
      const serviceSlide = document.createElement('div');
      serviceSlide.className = 'service-slide';
      
      const currentImage = service.fallbackImage || service.images?.[0] || 'https://via.placeholder.com/600x400';
      
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
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/600x400'">
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
    const servicesData = typeof SERVICES_DATA !== 'undefined' ? SERVICES_DATA : [{}, {}, {}];
    
    this.currentServiceSlide += direction;
    if (this.currentServiceSlide >= servicesData.length) {
      this.currentServiceSlide = 0;
    }
    if (this.currentServiceSlide < 0) {
      this.currentServiceSlide = servicesData.length - 1;
    }
    this.updateServiceSlider();
    
    // Reset auto-slide timer
    this.stopAutoSliders();
    this.startAutoSliders();
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
    const enableAutoSlider = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.enableAutoSlider : true;
    const autoSlideInterval = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.autoSlideInterval : 5000;
    
    if (!enableAutoSlider) return;
    
    this.serviceSlideInterval = setInterval(() => {
      this.changeServiceSlide(1);
    }, autoSlideInterval);
  }

  stopAutoSliders() {
    if (this.serviceSlideInterval) {
      clearInterval(this.serviceSlideInterval);
      this.serviceSlideInterval = null;
    }
  }

  enhanceFloatingElements() {
    const container = document.getElementById('floating-elements');
    if (!container) return;

    const elements = [
      { emoji: '🎈', color: '#ff6b9d' },
      { emoji: '🌸', color: '#ff6b9d' },
      { emoji: '🌺', color: '#ffd700' },
      { emoji: '🎂', color: '#ffd700' },
      { emoji: '🧁', color: '#ff6b9d' },
      { emoji: '⭐', color: '#ffd700' },
      { emoji: '✨', color: '#ffd700' },
      { emoji: '🎉', color: '#6c5ce7' },
      { emoji: '🎊', color: '#a8e6cf' },
      { emoji: '🦋', color: '#6c5ce7' },
      { emoji: '🌟', color: '#ffd700' },
      { emoji: '🌼', color: '#a8e6cf' },
      { emoji: '🌷', color: '#ff6b9d' },
      { emoji: '🍰', color: '#fdcb6e' },
      { emoji: '🎁', color: '#e84393' }
    ];

    // Create dynamic floating elements periodically
    setInterval(() => {
      if (container.children.length > 30) return;
      
      const elementData = elements[Math.floor(Math.random() * elements.length)];
      const element = document.createElement('div');
      element.className = 'floating-element dynamic';
      element.textContent = elementData.emoji;
      element.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: -50px;
        color: ${elementData.color};
        font-size: ${1.5 + Math.random() * 1.5}rem;
        animation: riseAnimation ${15 + Math.random() * 10}s linear;
        opacity: ${0.7 + Math.random() * 0.3};
      `;
      element.setAttribute('aria-hidden', 'true');
      container.appendChild(element);
      
      setTimeout(() => {
        if (element.parentNode) {
          element.remove();
        }
      }, 25000);
    }, 2000);
  }

  setupModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalClose) return;

    modalClose.addEventListener('click', () => this.closeModal());
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
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
    const modalCaption = document.getElementById('modal-caption');
    
    if (modal && modalImage) {
      modalImage.src = imageSrc;
      modalImage.alt = title;
      
      if (modalCaption) {
        modalCaption.innerHTML = `
          <h3>${title}</h3>
          <p>${description}</p>
        `;
      }
      
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

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
              icon.className = 'fas fa-bars';
            }
          }
        }
      });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 100) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });
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

  handleVisibilityChange() {
    if (document.hidden) {
      this.stopAutoSliders();
    } else {
      this.startAutoSliders();
    }
  }

  destroy() {
    this.stopAutoSliders();
    this.isLoaded = false;
  }
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes riseAnimation {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  .nav-menu.active {
    display: flex !important;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    padding: 1rem 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
  }
`;
document.head.appendChild(style);

// Initialize the application
let app;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new MainApp();
    window.app = app;
  });
} else {
  app = new MainApp();
  window.app = app;
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (app) {
    app.handleVisibilityChange();
  }
});

// Make sure PORTFOLIO_DATA and SERVICES_DATA are available globally if defined
if (typeof PORTFOLIO_DATA !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}

if (typeof SERVICES_DATA !== 'undefined') {
  window.SERVICES_DATA = SERVICES_DATA;
}

if (typeof SITE_CONFIG !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}