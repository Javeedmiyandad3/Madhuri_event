/**
 * Portfolio Controller
 * Manages portfolio gallery and sliders
 */

class PortfolioController {
  constructor() {
    this.portfolioGrid = document.getElementById('portfolio-grid');
    this.currentSlides = {};
    this.autoSlideIntervals = {};
    this.modal = document.getElementById('modal');
    this.modalImage = document.getElementById('modal-image');
    this.modalClose = document.getElementById('modal-close');
    this.modalCaption = document.getElementById('modal-caption');
    
    this.init();
  }

  init() {
    if (!this.portfolioGrid) return;
    
    this.createPortfolioCategories();
    this.setupModal();
    this.setupAutoSlider();
    this.setupImageLazyLoading();
  }

  createPortfolioCategories() {
    this.portfolioGrid.innerHTML = '';
    
    Object.keys(PORTFOLIO_CONFIG).forEach((categoryKey, index) => {
      const category = PORTFOLIO_CONFIG[categoryKey];
      const categoryElement = this.createCategoryElement(categoryKey, category, index);
      this.portfolioGrid.appendChild(categoryElement);
      
      // Initialize slider position
      this.currentSlides[categoryKey] = 0;
    });
  }

  createCategoryElement(categoryKey, category, index) {
    const categoryDiv = document.createElement('article');
    categoryDiv.className = 'portfolio-category';
    categoryDiv.setAttribute('data-category', categoryKey);
    
    const hasImages = category.images && category.images.length > 0;
    const imagesToUse = hasImages ? category.images : [FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]];
    
    categoryDiv.innerHTML = `
      <div class="portfolio-slider">
        <div class="portfolio-slides" id="slides-${categoryKey}">
          ${this.createSlides(imagesToUse, category.title, hasImages)}
        </div>
        ${imagesToUse.length > 1 ? this.createNavigationControls(categoryKey) : ''}
      </div>
      <div class="portfolio-info">
        <h3 class="portfolio-category-title">${category.title}</h3>
        <p class="portfolio-category-desc">${category.description}</p>
        <span class="portfolio-count">${hasImages ? `${category.images.length} Image${category.images.length !== 1 ? 's' : ''}` : 'Sample Image'}</span>
      </div>
    `;
    
    // Add event listeners
    this.setupCategoryEventListeners(categoryDiv, categoryKey, imagesToUse.length);
    
    return categoryDiv;
  }

  createSlides(images, categoryTitle, hasImages) {
    return images.map((imageSrc, index) => {
      const imageData = typeof imageSrc === 'string' ? 
        { src: imageSrc, title: `${categoryTitle} - Image ${index + 1}`, description: 'Professional decoration setup' } :
        imageSrc;
      
      return `
        <div class="portfolio-slide">
          <img src="${imageData.src}" 
               alt="${imageData.title}" 
               loading="lazy"
               onerror="this.src='${FALLBACK_IMAGES[index % FALLBACK_IMAGES.length].src}'"
               data-title="${imageData.title}"
               data-description="${imageData.description}">
          <div class="portfolio-slide-overlay">
            <h4>${imageData.title}</h4>
            <p>${imageData.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  createNavigationControls(categoryKey) {
    return `
      <button class="portfolio-nav prev" onclick="portfolioController.changeSlide('${categoryKey}', -1)" aria-label="Previous image">
        ❮
      </button>
      <button class="portfolio-nav next" onclick="portfolioController.changeSlide('${categoryKey}', 1)" aria-label="Next image">
        ❯
      </button>
      <div class="portfolio-dots" role="tablist" aria-label="Image navigation">
        ${PORTFOLIO_CONFIG[categoryKey].images ? PORTFOLIO_CONFIG[categoryKey].images.map((_, dotIndex) => `
          <div class="portfolio-dot ${dotIndex === 0 ? 'active' : ''}" 
               onclick="portfolioController.goToSlide('${categoryKey}', ${dotIndex})"
               role="tab"
               aria-label="Go to image ${dotIndex + 1}"
               tabindex="${dotIndex === 0 ? '0' : '-1'}"></div>
        `).join('') : ''}
      </div>
    `;
  }

  setupCategoryEventListeners(categoryElement, categoryKey, imageCount) {
    // Image click events for modal
    const images = categoryElement.querySelectorAll('.portfolio-slide img');
    images.forEach(img => {
      img.addEventListener('click', (e) => {
        this.openModal(e.target);
      });
      
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openModal(e.target);
        }
      });
    });

    // Keyboard navigation for slides
    const slider = categoryElement.querySelector('.portfolio-slider');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.changeSlide(categoryKey, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.changeSlide(categoryKey, 1);
      }
    });

    // Touch/swipe support
    this.setupTouchNavigation(slider, categoryKey);
  }

  setupTouchNavigation(slider, categoryKey) {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let threshold = 50;
    let restraint = 100;
    let allowedTime = 300;
    let elapsedTime = 0;
    let startTime = 0;

    slider.addEventListener('touchstart', (e) => {
      const touchobj = e.changedTouches[0];
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    }, { passive: false });

    slider.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    slider.addEventListener('touchend', (e) => {
      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;

      if (elapsedTime <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX > 0) {
          this.changeSlide(categoryKey, -1);
        } else {
          this.changeSlide(categoryKey, 1);
        }
      }
      e.preventDefault();
    }, { passive: false });
  }

  changeSlide(categoryKey, direction) {
    const slides = document.getElementById(`slides-${categoryKey}`);
    if (!slides) return;

    const category = PORTFOLIO_CONFIG[categoryKey];
    const totalSlides = category.images ? category.images.length : 1;
    
    if (totalSlides <= 1) return;

    const currentSlide = this.currentSlides[categoryKey];
    let newSlide = currentSlide + direction;

    if (newSlide >= totalSlides) newSlide = 0;
    if (newSlide < 0) newSlide = totalSlides - 1;

    this.currentSlides[categoryKey] = newSlide;
    slides.style.transform = `translateX(-${newSlide * 100}%)`;

    // Update dots
    this.updateDots(categoryKey, newSlide);

    // Update accessibility
    slides.setAttribute('aria-live', 'polite');
    
    // Reset auto-slide timer
    this.resetAutoSlide(categoryKey);
  }

  goToSlide(categoryKey, slideIndex) {
    const slides = document.getElementById(`slides-${categoryKey}`);
    if (!slides) return;

    this.currentSlides[categoryKey] = slideIndex;
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;

    this.updateDots(categoryKey, slideIndex);
    this.resetAutoSlide(categoryKey);
  }

  updateDots(categoryKey, activeIndex) {
    const container = document.querySelector(`[data-category="${categoryKey}"]`);
    if (!container) return;

    const dots = container.querySelectorAll('.portfolio-dot');
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  setupModal() {
    if (!this.modal) return;

    // Close modal events
    this.modalClose?.addEventListener('click', () => this.closeModal());
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (this.modal.style.display === 'block') {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      }
    });

    // Prevent background scroll when modal is open
    this.modal.addEventListener('show', () => {
      document.body.style.overflow = 'hidden';
    });

    this.modal.addEventListener('hide', () => {
      document.body.style.overflow = '';
    });
  }

  openModal(img) {
    if (!this.modal || !this.modalImage) return;

    this.modalImage.src = img.src;
    this.modalImage.alt = img.alt;
    
    if (this.modalCaption) {
      this.modalCaption.innerHTML = `
        <h3>${img.dataset.title || img.alt}</h3>
        <p>${img.dataset.description || ''}</p>
      `;
    }

    this.modal.style.display = 'block';
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.modalClose?.focus();
    
    // Dispatch custom event
    this.modal.dispatchEvent(new CustomEvent('show'));
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Dispatch custom event
    this.modal.dispatchEvent(new CustomEvent('hide'));
  }

  setupAutoSlider() {
    if (!SITE_CONFIG.enableAutoSlider) return;

    Object.keys(PORTFOLIO_CONFIG).forEach(categoryKey => {
      const category = PORTFOLIO_CONFIG[categoryKey];
      if (category.images && category.images.length > 1) {
        this.startAutoSlide(categoryKey);
      }
    });
  }

  startAutoSlide(categoryKey) {
    this.stopAutoSlide(categoryKey);
    
    this.autoSlideIntervals[categoryKey] = setInterval(() => {
      this.changeSlide(categoryKey, 1);
    }, SITE_CONFIG.autoSlideInterval || 5000);
  }

  stopAutoSlide(categoryKey) {
    if (this.autoSlideIntervals[categoryKey]) {
      clearInterval(this.autoSlideIntervals[categoryKey]);
      delete this.autoSlideIntervals[categoryKey];
    }
  }

  resetAutoSlide(categoryKey) {
    this.stopAutoSlide(categoryKey);
    
    // Restart after a delay to give user time to interact
    setTimeout(() => {
      this.startAutoSlide(categoryKey);
    }, 2000);
  }

  setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Public methods for external control
  pauseAllSliders() {
    Object.keys(this.autoSlideIntervals).forEach(categoryKey => {
      this.stopAutoSlide(categoryKey);
    });
  }

  resumeAllSliders() {
    Object.keys(PORTFOLIO_CONFIG).forEach(categoryKey => {
      const category = PORTFOLIO_CONFIG[categoryKey];
      if (category.images && category.images.length > 1) {
        this.startAutoSlide(categoryKey);
      }
    });
  }

  addCategory(categoryKey, categoryData) {
    PORTFOLIO_CONFIG[categoryKey] = categoryData;
    this.createPortfolioCategories();
  }

  removeCategory(categoryKey) {
    delete PORTFOLIO_CONFIG[categoryKey];
    this.stopAutoSlide(categoryKey);
    delete this.currentSlides[categoryKey];
    this.createPortfolioCategories();
  }

  updateCategory(categoryKey, newData) {
    if (PORTFOLIO_CONFIG[categoryKey]) {
      PORTFOLIO_CONFIG[categoryKey] = { ...PORTFOLIO_CONFIG[categoryKey], ...newData };
      this.createPortfolioCategories();
    }
  }

  destroy() {
    // Clean up intervals
    Object.keys(this.autoSlideIntervals).forEach(categoryKey => {
      this.stopAutoSlide(categoryKey);
    });
    
    // Clean up modal
    this.closeModal();
    document.body.style.overflow = '';
  }
}

// Initialize portfolio controller
let portfolioController;

document.addEventListener('DOMContentLoaded', () => {
  portfolioController = new PortfolioController();
});

// Handle visibility change to pause/resume sliders
document.addEventListener('visibilitychange', () => {
  if (portfolioController) {
    if (document.hidden) {
      portfolioController.pauseAllSliders();
    } else {
      portfolioController.resumeAllSliders();
    }
  }
});

// Export for global access
window.PortfolioController = PortfolioController;
window.portfolioController = portfolioController;