/**
 * Main Application Controller for AA Event Decor and Rentals
 * Complete version with multiple image support and auto-detection
 * Includes About slider functionality
 */

// Main Application Class
class MainApp {
  constructor() {
    this.isLoaded = false;
    this.currentServiceSlide = 0;
    this.currentAboutSlide = 0;
    this.serviceSlideInterval = null;
    this.portfolioCurrentSlides = [];
    this.portfolioImageCache = new Map();
    this.init();
  }

  async init() {
    try {
      this.showLoading();
      
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      this.initializeLogo();
      await this.createPortfolioWithImageDetection();
      this.createServicesSlider();
      await this.createAboutSlider();
      this.enhanceFloatingElements();
      this.setupModal();
      this.setupNavigation();
      this.startAutoSliders();
      
      setTimeout(() => {
        this.hideLoading();
        this.isLoaded = true;
        console.log('AA Event Decor and Rentals website loaded successfully');
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

  async createPortfolioWithImageDetection() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '';
    
    const portfolioData = typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : [];
    
    for (let i = 0; i < portfolioData.length; i++) {
      const item = portfolioData[i];
      const detectedImages = await this.detectPortfolioImages(item);
      await this.createPortfolioCard(item, detectedImages, i, portfolioGrid);
    }
    
    this.portfolioCurrentSlides = new Array(portfolioData.length).fill(0);
  }

  async detectPortfolioImages(item) {
    const images = [];
    const folderPath = item.folderPath || `images/portfolio/${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}/`;
    
    const possibleImages = item.possibleImages || [
      `${folderPath}image-1.jpg`,
      `${folderPath}image-2.jpg`,
      `${folderPath}image-3.jpg`,
      `${folderPath}image-4.jpg`,
      `${folderPath}image-5.jpg`,
      `${folderPath}setup-1.jpg`,
      `${folderPath}setup-2.jpg`,
      `${folderPath}decoration-1.jpg`,
      `${folderPath}decoration-2.jpg`,
      `${folderPath}event-1.jpg`,
      `${folderPath}event-2.jpg`
    ];

    for (const imagePath of possibleImages) {
      if (await this.imageExists(imagePath)) {
        images.push(imagePath);
      }
    }

    if (images.length === 0 && item.images) {
      for (const imagePath of item.images) {
        if (await this.imageExists(imagePath)) {
          images.push(imagePath);
        }
      }
    }

    if (images.length === 0) {
      images.push(item.fallback || 'https://via.placeholder.com/400x300?text=No+Image');
    }

    return images;
  }

  async imageExists(url) {
    if (this.portfolioImageCache.has(url)) {
      return this.portfolioImageCache.get(url);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.portfolioImageCache.set(url, true);
        resolve(true);
      };
      img.onerror = () => {
        this.portfolioImageCache.set(url, false);
        resolve(false);
      };
      img.src = url;
    });
  }

  async createPortfolioCard(item, images, index, container) {
    const portfolioCard = document.createElement('article');
    portfolioCard.className = 'portfolio-card';
    portfolioCard.setAttribute('data-portfolio', index);
    
    const hasMultipleImages = images.length > 1;
    
    portfolioCard.innerHTML = `
      <div class="portfolio-image-container">
        ${hasMultipleImages ? this.createImageSlider(images, item, index) : this.createSingleImage(images[0], item)}
        ${hasMultipleImages ? `<div class="image-count">${images.length} Photos</div>` : ''}
      </div>
      <div class="portfolio-info">
        <h3 class="portfolio-name">${item.name}</h3>
        <p class="portfolio-description">${item.description}</p>
      </div>
    `;
    
    container.appendChild(portfolioCard);
  }

  createImageSlider(images, item, index) {
    return `
      <div class="portfolio-slider">
        <div class="portfolio-slides" id="portfolio-slides-${index}">
          ${images.map((img, imgIndex) => `
            <img src="${img}" 
                 alt="${item.name} - Image ${imgIndex + 1}" 
                 class="portfolio-image ${imgIndex === 0 ? 'active' : ''}" 
                 loading="lazy"
                 onerror="this.src='${item.fallback || 'https://via.placeholder.com/400x300'}'"
                 onclick="app.openModal('${img}', '${item.name}', '${item.description}')">
          `).join('')}
        </div>
        <div class="portfolio-nav" style="opacity: 0;">
          <button class="portfolio-nav-btn prev" onclick="app.changePortfolioSlide(${index}, -1)" aria-label="Previous image">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="portfolio-nav-btn next" onclick="app.changePortfolioSlide(${index}, 1)" aria-label="Next image">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="portfolio-dots">
          ${images.map((_, dotIndex) => `
            <div class="portfolio-dot ${dotIndex === 0 ? 'active' : ''}" 
                 onclick="app.goToPortfolioSlide(${index}, ${dotIndex})"
                 aria-label="Go to image ${dotIndex + 1}"></div>
          `).join('')}
        </div>
      </div>
    `;
  }

  createSingleImage(imageSrc, item) {
    return `
      <img src="${imageSrc}" 
           alt="${item.name}" 
           class="portfolio-image single" 
           loading="lazy"
           onerror="this.src='${item.fallback || 'https://via.placeholder.com/400x300'}'"
           onclick="app.openModal('${imageSrc}', '${item.name}', '${item.description}')">
    `;
  }

  changePortfolioSlide(portfolioIndex, direction) {
    if (!this.portfolioCurrentSlides) return;
    
    const portfolioData = typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : [];
    if (portfolioIndex >= portfolioData.length) return;
    
    const slidesContainer = document.getElementById(`portfolio-slides-${portfolioIndex}`);
    if (!slidesContainer) return;
    
    const totalSlides = slidesContainer.children.length;
    if (totalSlides <= 1) return;
    
    let currentSlide = this.portfolioCurrentSlides[portfolioIndex];
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    this.portfolioCurrentSlides[portfolioIndex] = currentSlide;
    this.updatePortfolioSlider(portfolioIndex, currentSlide);
  }

  goToPortfolioSlide(portfolioIndex, slideIndex) {
    if (!this.portfolioCurrentSlides) return;
    
    this.portfolioCurrentSlides[portfolioIndex] = slideIndex;
    this.updatePortfolioSlider(portfolioIndex, slideIndex);
  }

  updatePortfolioSlider(portfolioIndex, activeSlide) {
    const slidesContainer = document.getElementById(`portfolio-slides-${portfolioIndex}`);
    const dots = document.querySelectorAll(`[data-portfolio="${portfolioIndex}"] .portfolio-dot`);
    
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${activeSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeSlide);
    });
  }

  createServicesSlider() {
    const servicesTrack = document.getElementById('services-track');
    const serviceDots = document.getElementById('service-dots');
    
    if (!servicesTrack || !serviceDots) return;
    
    const servicesData = typeof SERVICES_DATA !== 'undefined' ? SERVICES_DATA : [];

    servicesTrack.innerHTML = '';
    serviceDots.innerHTML = '';
    
    servicesData.forEach((service, index) => {
      const serviceSlide = document.createElement('div');
      serviceSlide.className = 'service-slide';
      
      const serviceImage = service.image || service.fallbackImage;
      
      serviceSlide.innerHTML = `
        <div class="service-content">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <ul class="service-features">
            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="service-image-container">
          <img src="${serviceImage}" 
               alt="${service.title}" 
               class="service-image"
               loading="lazy"
               onerror="this.src='${service.fallbackImage}'">
        </div>
      `;
      servicesTrack.appendChild(serviceSlide);

      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.onclick = () => this.goToServiceSlide(index);
      dot.setAttribute('aria-label', `Go to ${service.title}`);
      serviceDots.appendChild(dot);
    });
  }

  async createAboutSlider() {
    const aboutContainer = document.querySelector('.about-gallery');
    if (!aboutContainer) {
      console.log('About gallery container not found, skipping slider');
      return;
    }

    const aboutData = typeof ABOUT_DATA !== 'undefined' ? ABOUT_DATA : null;
    if (!aboutData) {
      console.log('ABOUT_DATA not defined');
      return;
    }

    const detectedImages = await this.detectAboutImages(aboutData);
    
    if (detectedImages.length === 0) {
      aboutContainer.innerHTML = `
        <div class="about-image-single">
          <img src="${aboutData.fallback}" 
               alt="${aboutData.name}" 
               class="about-image"
               loading="lazy">
        </div>
      `;
      return;
    }

    aboutContainer.innerHTML = `
      <div class="about-slider">
        <div class="about-slides" id="about-slides">
          ${detectedImages.map((img, imgIndex) => `
            <img src="${img}" 
                 alt="${aboutData.name} - Image ${imgIndex + 1}" 
                 class="about-slide-image ${imgIndex === 0 ? 'active' : ''}" 
                 loading="lazy"
                 onerror="this.src='${aboutData.fallback}'">
          `).join('')}
        </div>
        ${detectedImages.length > 1 ? `
          <div class="about-nav">
            <button class="about-nav-btn prev" onclick="app.changeAboutSlide(-1)" aria-label="Previous image">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="about-nav-btn next" onclick="app.changeAboutSlide(1)" aria-label="Next image">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="about-dots">
            ${detectedImages.map((_, dotIndex) => `
              <div class="about-dot ${dotIndex === 0 ? 'active' : ''}" 
                   onclick="app.goToAboutSlide(${dotIndex})"
                   aria-label="Go to image ${dotIndex + 1}"></div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    this.currentAboutSlide = 0;
  }

  async detectAboutImages(aboutData) {
    const images = [];
    
    for (const imagePath of aboutData.possibleImages) {
      if (await this.imageExists(imagePath)) {
        images.push(imagePath);
      }
    }

    return images;
  }

  changeAboutSlide(direction) {
    const slidesContainer = document.getElementById('about-slides');
    if (!slidesContainer) return;
    
    const totalSlides = slidesContainer.children.length;
    if (totalSlides <= 1) return;
    
    this.currentAboutSlide = (this.currentAboutSlide || 0) + direction;
    
    if (this.currentAboutSlide >= totalSlides) this.currentAboutSlide = 0;
    if (this.currentAboutSlide < 0) this.currentAboutSlide = totalSlides - 1;
    
    this.updateAboutSlider(this.currentAboutSlide);
  }

  goToAboutSlide(slideIndex) {
    this.currentAboutSlide = slideIndex;
    this.updateAboutSlider(slideIndex);
  }

  updateAboutSlider(activeSlide) {
    const slidesContainer = document.getElementById('about-slides');
    const dots = document.querySelectorAll('.about-dot');
    
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${activeSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeSlide);
    });

    const images = slidesContainer?.querySelectorAll('.about-slide-image');
    images?.forEach((img, index) => {
      img.classList.toggle('active', index === activeSlide);
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
      { emoji: '🎀', color: '#e84393' }
    ];

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
    this.portfolioImageCache.clear();
    this.isLoaded = false;
  }
}

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

  .portfolio-nav {
    transition: opacity 0.3s ease;
  }
  
  .portfolio-card:hover .portfolio-nav {
    opacity: 1 !important;
  }
`;
document.head.appendChild(style);

let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new MainApp();
    window.app = app;
  });
} else {
  app = new MainApp();
  window.app = app;
}

document.addEventListener('visibilitychange', () => {
  if (app) {
    app.handleVisibilityChange();
  }
});

if (typeof PORTFOLIO_DATA !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}

if (typeof SERVICES_DATA !== 'undefined') {
  window.SERVICES_DATA = SERVICES_DATA;
}

if (typeof SITE_CONFIG !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}

if (typeof ABOUT_DATA !== 'undefined') {
  window.ABOUT_DATA = ABOUT_DATA;
}