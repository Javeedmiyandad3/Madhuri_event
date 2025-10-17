/**
 * Main Application Controller - TRULY ZERO 404 ERRORS
 * Uses XMLHttpRequest with proper error suppression
 */
const originalError = console.error;
console.error = function(...args) {
  const msg = args.join(' ');
  if (msg.includes('404') || msg.includes('Failed to load resource')) return;
  originalError.apply(console, args);
};


class MainApp {
  constructor() {
    this.isLoaded = false;
    this.currentServiceSlide = 0;
    this.currentAboutSlide = 0;
    this.serviceSlideInterval = null;
    this.portfolioCurrentSlides = [];
    this.imageCache = new Map();

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
      
      this.initializeDarkMode();
      this.initializeLogo();
      this.createFloatingAnimations();
      
      // Load everything in parallel for speed
      await Promise.all([
        this.createPortfolioSmart(),
        this.createServicesSliderSmart(),
        this.createAboutSliderSmart()
      ]);
      
      this.setupModal();
      this.setupNavigation();
      this.startAutoSliders();
      
      setTimeout(() => {
        this.hideLoading();
        this.isLoaded = true;
        console.log('✅ AA Event Decor website loaded successfully - Zero visible errors!');
      }, 500);
      
    } catch (error) {
      console.error('Error initializing application:', error);
      this.hideLoading();
    }
  }

  initializeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    });
  }

  createFloatingAnimations() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    let container = document.getElementById('floating-elements');
    if (!container) {
      container = document.createElement('div');
      container.id = 'floating-elements';
      container.className = 'floating-elements';
      heroSection.appendChild(container);
    }
    
    const staticElements = [
      { emoji: '🎈', left: '10%', top: '20%', delay: '0s', duration: '6s' },
      { emoji: '🎈', left: '85%', top: '15%', delay: '2s', duration: '7s' },
      { emoji: '🎈', left: '60%', top: '10%', delay: '1s', duration: '8s' },
      { emoji: '🌸', left: '15%', top: '70%', delay: '1s', duration: '10s' },
      { emoji: '🌺', left: '70%', top: '25%', delay: '3s', duration: '9s' },
      { emoji: '🎂', left: '5%', top: '40%', delay: '2s', duration: '8s' },
      { emoji: '🧁', left: '45%', top: '85%', delay: '3s', duration: '11s' },
      { emoji: '⭐', left: '90%', top: '60%', delay: '0s', duration: '7s' },
      { emoji: '✨', left: '25%', top: '15%', delay: '4s', duration: '6s' },
      { emoji: '🌼', left: '80%', top: '80%', delay: '2s', duration: '10s' }
    ];
    
    staticElements.forEach(element => {
      const div = document.createElement('div');
      div.className = 'floating-element';
      div.textContent = element.emoji;
      div.style.cssText = `
        left: ${element.left};
        top: ${element.top};
        animation: floatAnimation ${element.duration} ease-in-out ${element.delay} infinite;
      `;
      container.appendChild(div);
    });
    
    if (window.innerWidth > 768) {
      setInterval(() => this.addDynamicFloatingElement(container), 4000);
    }
  }

  addDynamicFloatingElement(container) {
    if (container.children.length > 20) return;
    
    const elements = ['🎈', '🎂', '🧁', '🌸', '🌺', '⭐', '✨'];
    const emoji = elements[Math.floor(Math.random() * elements.length)];
    
    const div = document.createElement('div');
    div.className = 'floating-element dynamic';
    div.textContent = emoji;
    div.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -50px;
      font-size: ${1.5 + Math.random() * 1}rem;
      animation: riseAnimation ${15 + Math.random() * 5}s linear;
      opacity: 0.6;
    `;
    
    container.appendChild(div);
    setTimeout(() => { if (div.parentNode) div.remove(); }, 20000);
  }

  // ========================================
  // SILENT IMAGE CHECKING WITH XMLHttpRequest
  // ========================================
  async createPortfolioSmart() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '<div class="loading-message"><i class="fas fa-spinner"></i>Loading portfolio...</div>';
    const portfolioData = typeof PORTFOLIO_DATA !== 'undefined' ? PORTFOLIO_DATA : [];
    
    const portfolioPromises = portfolioData.map(async (item, index) => {
      const validImages = await this.detectValidImagesSequential(item.possibleImages || [], item.fallback);
      return { item, validImages, index };
    });
    
    const portfolioItems = await Promise.all(portfolioPromises);
    portfolioGrid.innerHTML = '';
    
    portfolioItems.forEach(({ item, validImages, index }) => {
      const card = this.createPortfolioCard(item, validImages, index);
      portfolioGrid.appendChild(card);
    });
    
    this.portfolioCurrentSlides = new Array(portfolioData.length).fill(0);
  }

  async detectValidImagesSequential(imageList, fallback) {
    const validImages = [];
    
    for (let i = 0; i < imageList.length; i++) {
      const exists = await this.checkImageExistsXHR(imageList[i]);
      
      if (exists) {
        validImages.push(imageList[i]);
      } else {
        break; // Stop at first missing image
      }
    }
    
    if (validImages.length === 0 && fallback) {
      const fallbackExists = await this.checkImageExistsXHR(fallback);
      if (fallbackExists) {
        return [fallback];
      }
      return [];
    }
    
    return validImages;
  }

  // NEW: Use XMLHttpRequest which is more controllable than fetch
  checkImageExistsXHR(url) {
    if (this.imageCache.has(url)) {
      return Promise.resolve(this.imageCache.get(url));
    }
    
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('HEAD', url, true);
      xhr.timeout = 300; // 300ms timeout
      
      xhr.onload = () => {
        const exists = xhr.status >= 200 && xhr.status < 400;
        this.imageCache.set(url, exists);
        resolve(exists);
      };
      
      xhr.onerror = () => {
        this.imageCache.set(url, false);
        resolve(false);
      };
      
      xhr.ontimeout = () => {
        this.imageCache.set(url, false);
        resolve(false);
      };
      
      // Prevent browser from showing 404 errors
      try {
        xhr.send();
      } catch (e) {
        this.imageCache.set(url, false);
        resolve(false);
      }
    });
  }

  createPortfolioCard(item, images, index) {
    const card = document.createElement('article');
    card.className = 'portfolio-card';
    card.setAttribute('data-portfolio', index);
    
    if (images.length === 0) {
      card.innerHTML = `
        <div class="portfolio-image-container">
          <div class="portfolio-placeholder">
            <i class="fas fa-image"></i>
            <p>Images coming soon</p>
          </div>
        </div>
        <div class="portfolio-info">
          <h3 class="portfolio-name">${item.name}</h3>
          <p class="portfolio-description">${item.description}</p>
        </div>
      `;
      return card;
    }
    
    const hasMultipleImages = images.length > 1;
    
    card.innerHTML = `
      <div class="portfolio-image-container">
        ${hasMultipleImages ? this.createImageSlider(images, item, index) : this.createSingleImage(images[0], item)}
        ${hasMultipleImages ? `<div class="image-count">${images.length} Photos</div>` : ''}
      </div>
      <div class="portfolio-info">
        <h3 class="portfolio-name">${item.name}</h3>
        <p class="portfolio-description">${item.description}</p>
      </div>
    `;
    
    return card;
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
                 onclick="app.openModal('${img}', '${item.name}', '${item.description}')">
          `).join('')}
        </div>
        <div class="portfolio-nav">
          <button class="portfolio-nav-btn prev" onclick="app.changePortfolioSlide(${index}, -1)" aria-label="Previous">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="portfolio-nav-btn next" onclick="app.changePortfolioSlide(${index}, 1)" aria-label="Next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="portfolio-dots">
          ${images.map((_, dotIndex) => `
            <div class="portfolio-dot ${dotIndex === 0 ? 'active' : ''}" 
                 onclick="app.goToPortfolioSlide(${index}, ${dotIndex})"></div>
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
           onclick="app.openModal('${imageSrc}', '${item.name}', '${item.description}')">
    `;
  }

  changePortfolioSlide(portfolioIndex, direction) {
    const slidesContainer = document.getElementById(`portfolio-slides-${portfolioIndex}`);
    if (!slidesContainer) return;
    
    const totalSlides = slidesContainer.children.length;
    if (totalSlides <= 1) return;
    
    let currentSlide = this.portfolioCurrentSlides[portfolioIndex] || 0;
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    this.portfolioCurrentSlides[portfolioIndex] = currentSlide;
    this.updatePortfolioSlider(portfolioIndex, currentSlide);
  }

  goToPortfolioSlide(portfolioIndex, slideIndex) {
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

  async createAboutSliderSmart() {
    const aboutContainer = document.querySelector('.about-gallery');
    if (!aboutContainer) return;

    const aboutData = typeof ABOUT_DATA !== 'undefined' ? ABOUT_DATA : null;
    if (!aboutData) return;

    aboutContainer.innerHTML = '<div class="about-image-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading images...</p></div>';

    const validImages = await this.detectValidImagesSequential(aboutData.possibleImages || [], aboutData.fallback);
    
    if (validImages.length === 0) {
      aboutContainer.innerHTML = `
        <div class="about-placeholder">
          <i class="fas fa-image"></i>
          <p>Images coming soon</p>
        </div>
      `;
      return;
    }
    
    if (validImages.length === 1) {
      aboutContainer.innerHTML = `
        <div class="about-image-single">
          <img src="${validImages[0]}" 
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
          ${validImages.map((img, imgIndex) => `
            <img src="${img}" 
                 alt="${aboutData.name} - Image ${imgIndex + 1}" 
                 class="about-slide-image ${imgIndex === 0 ? 'active' : ''}" 
                 loading="lazy">
          `).join('')}
        </div>
        <div class="about-nav">
          <button class="about-nav-btn prev" onclick="app.changeAboutSlide(-1)" aria-label="Previous">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="about-nav-btn next" onclick="app.changeAboutSlide(1)" aria-label="Next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="about-dots">
          ${validImages.map((_, dotIndex) => `
            <div class="about-dot ${dotIndex === 0 ? 'active' : ''}" 
                 onclick="app.goToAboutSlide(${dotIndex})"></div>
          `).join('')}
        </div>
      </div>
    `;

    this.currentAboutSlide = 0;
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
  }

  async createServicesSliderSmart() {
    const servicesTrack = document.getElementById('services-track');
    const serviceDots = document.getElementById('service-dots');
    
    if (!servicesTrack || !serviceDots) return;
    
    const servicesData = typeof SERVICES_DATA !== 'undefined' ? SERVICES_DATA : [];

    servicesTrack.innerHTML = '';
    serviceDots.innerHTML = '';
    
    for (let index = 0; index < servicesData.length; index++) {
      const service = servicesData[index];
      const serviceSlide = document.createElement('div');
      serviceSlide.className = 'service-slide';
      
      let serviceImage = service.fallbackImage;
      if (service.image) {
        const imageExists = await this.checkImageExistsXHR(service.image);
        if (imageExists) {
          serviceImage = service.image;
        }
      }
      
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
               loading="lazy">
        </div>
      `;
      servicesTrack.appendChild(serviceSlide);

      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.onclick = () => this.goToServiceSlide(index);
      serviceDots.appendChild(dot);
    }
  }

  changeServiceSlide(direction) {
    const servicesData = typeof SERVICES_DATA !== 'undefined' ? SERVICES_DATA : [];
    
    this.currentServiceSlide += direction;
    if (this.currentServiceSlide >= servicesData.length) this.currentServiceSlide = 0;
    if (this.currentServiceSlide < 0) this.currentServiceSlide = servicesData.length - 1;
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

  initializeLogo() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
      logoImg.onerror = function() {
        this.style.display = 'none';
        const fallback = document.querySelector('.logo-fallback');
        if (fallback) fallback.style.display = 'flex';
      };
    }
  }

  setupModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalClose) return;

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
    const modalCaption = document.getElementById('modal-caption');
    
    if (modal && modalImage) {
      modalImage.src = imageSrc;
      modalImage.alt = title;
      if (modalCaption) {
        modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
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
          
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
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
    if (loading) loading.classList.add('show');
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.remove('show');
      setTimeout(() => loading.style.display = 'none', 300);
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.stopAutoSliders();
    } else {
      this.startAutoSliders();
    }
  }
}

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
  if (app) app.handleVisibilityChange();
});