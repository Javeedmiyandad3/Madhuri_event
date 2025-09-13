/**
 * Animation Controller
 * Manages all animations and floating elements
 */

class AnimationController {
  constructor() {
    this.floatingElements = [];
    this.animationFrame = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    if (this.isReducedMotion) {
      console.log('Reduced motion detected, disabling animations');
      return;
    }

    this.setupFloatingElements();
    this.setupScrollAnimations();
    this.setupServiceCardEffects();
    this.startPeriodicAnimations();
  }

  setupFloatingElements() {
    if (!SITE_CONFIG.enableFloatingElements || this.isReducedMotion) return;

    const container = document.getElementById('floating-elements');
    if (!container) return;

    // Create initial static elements
    this.createStaticElements(container);

    // Start periodic floating element creation
    if (!this.isMobile) {
      setInterval(() => this.createFloatingElement(container), 3000);
    }
  }

  createStaticElements(container) {
    const elements = [
      { type: 'balloon', emoji: '🎈', style: 'left: 10%; top: 20%; color: #ff6b9d; animation-delay: 0s;' },
      { type: 'balloon', emoji: '🎈', style: 'left: 85%; top: 15%; color: #ffd700; animation-delay: 2s;' },
      { type: 'balloon', emoji: '🎈', style: 'left: 75%; top: 60%; color: #6c5ce7; animation-delay: 4s;' },
      { type: 'flower', emoji: '🌸', style: 'left: 15%; top: 30%; color: #ff6b9d; animation-delay: 1s;' },
      { type: 'flower', emoji: '🌺', style: 'left: 70%; top: 25%; color: #ffd700; animation-delay: 3s;' },
      { type: 'flower', emoji: '🌼', style: 'left: 25%; top: 70%; color: #a8e6cf; animation-delay: 5s;' },
      { type: 'star', emoji: '⭐', style: 'left: 20%; top: 10%; animation-delay: 0s;' },
      { type: 'star', emoji: '✨', style: 'left: 50%; top: 15%; animation-delay: 1s;' },
      { type: 'star', emoji: '⭐', style: 'left: 80%; top: 20%; animation-delay: 2s;' },
      { type: 'cake', emoji: '🎂', style: 'left: 5%; top: 40%; color: #ffd700; animation-delay: 3s;' },
      { type: 'cake', emoji: '🧁', style: 'left: 90%; top: 30%; color: #ff6b9d; animation-delay: 6s;' }
    ];

    elements.forEach(element => {
      const div = document.createElement('div');
      div.className = `floating-element ${element.type}`;
      div.textContent = element.emoji;
      div.setAttribute('style', element.style);
      div.setAttribute('aria-hidden', 'true');
      container.appendChild(div);
    });

    // Add confetti elements
    for (let i = 0; i < 8; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'floating-element confetti';
      confetti.style.cssText = `
        left: ${10 + i * 10}%; 
        background: ${FLOATING_ELEMENTS_CONFIG.confetti[i % 4].color}; 
        animation-delay: ${i * 0.5}s;
      `;
      confetti.setAttribute('aria-hidden', 'true');
      container.appendChild(confetti);
    }
  }

  createFloatingElement(container) {
    if (this.floatingElements.length > 25) {
      this.cleanupFloatingElements();
    }

    const elements = [
      { emoji: '🎈', type: 'balloon', speed: 15 },
      { emoji: '🎂', type: 'cake', speed: 18 },
      { emoji: '🧁', type: 'cake', speed: 16 },
      { emoji: '🌸', type: 'flower', speed: 20 },
      { emoji: '🌺', type: 'flower', speed: 22 },
      { emoji: '🌼', type: 'flower', speed: 19 },
      { emoji: '🌷', type: 'flower', speed: 21 },
      { emoji: '🌻', type: 'flower', speed: 17 },
      { emoji: '⭐', type: 'star', speed: 25 },
      { emoji: '✨', type: 'star', speed: 23 },
      { emoji: '🎉', type: 'confetti', speed: 12 },
      { emoji: '🎊', type: 'confetti', speed: 14 },
      { emoji: '🦋', type: 'butterfly', speed: 30 },
      { emoji: '🌟', type: 'star', speed: 28 }
    ];
    
    const elementConfig = elements[Math.floor(Math.random() * elements.length)];
    const colors = ['#8E2DE2', '#FF4F81', '#FF8C42', '#FDCB2E', '#1ABC9C', '#2ECC71'];
    
    const element = document.createElement('div');
    element.className = `floating-element ${elementConfig.type} rising-animation`;
    element.textContent = elementConfig.emoji;
    element.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -50px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      font-size: ${1.2 + Math.random() * 1.8}rem;
      animation: elegantRise ${elementConfig.speed + Math.random() * 10}s linear infinite;
      opacity: ${0.7 + Math.random() * 0.3};
    `;
    element.setAttribute('aria-hidden', 'true');
    
    container.appendChild(element);
    this.floatingElements.push(element);

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.floatingElements = this.floatingElements.filter(el => el !== element);
    }, (elementConfig.speed + 10) * 1000);
  }

  cleanupFloatingElements() {
    this.floatingElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.floatingElements = [];
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Stagger child animations
          const children = entry.target.querySelectorAll('.service-card, .portfolio-category, .about-text > *, .contact-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-fade-in-up');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });

    // Observe individual elements for more granular control
    document.querySelectorAll('.service-card, .portfolio-category').forEach(element => {
      observer.observe(element);
    });
  }

  setupServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.createSparkleEffect(card);
      });
    });
  }

  createSparkleEffect(card) {
    if (this.isReducedMotion) return;

    const sparklesContainer = document.createElement('div');
    sparklesContainer.className = 'service-sparkles';
    card.appendChild(sparklesContainer);

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        sparkle.setAttribute('aria-hidden', 'true');
        
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.remove();
          }
        }, 1000);
      }, i * 100);
    }

    // Remove sparkles container after all animations
    setTimeout(() => {
      if (sparklesContainer.parentNode) {
        sparklesContainer.remove();
      }
    }, 1500);
  }

  startPeriodicAnimations() {
    if (this.isReducedMotion) return;

    // Animate section titles periodically
    setInterval(() => {
      const titles = document.querySelectorAll('.section-title');
      titles.forEach(title => {
        title.style.animation = 'none';
        title.offsetHeight; // Trigger reflow
        title.style.animation = null;
      });
    }, 10000);
  }

  // Public methods for external control
  pauseAnimations() {
    document.body.classList.add('pause-animation');
  }

  resumeAnimations() {
    document.body.classList.remove('pause-animation');
  }

  toggleAnimations() {
    document.body.classList.toggle('pause-animation');
  }

  destroy() {
    this.cleanupFloatingElements();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.isMonitoring = false;
  }

  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.monitor();
  }

  monitor() {
    const now = performance.now();
    this.frameCount++;

    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      // Reduce animations if performance is poor
      if (this.fps < 30) {
        document.body.classList.add('low-performance');
        console.warn('Low FPS detected, reducing animations');
      } else if (this.fps > 45) {
        document.body.classList.remove('low-performance');
      }
    }

    if (this.isMonitoring) {
      requestAnimationFrame(() => this.monitor());
    }
  }

  stop() {
    this.isMonitoring = false;
  }

  getFPS() {
    return this.fps;
  }
}

// Initialize when DOM is loaded
let animationController;
let performanceMonitor;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize animation controller
  animationController = new AnimationController();
  
  // Start performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    performanceMonitor = new PerformanceMonitor();
    performanceMonitor.start();
    
    // Add FPS display for debugging
    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fps-display';
    fpsDisplay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(fpsDisplay);
    
    setInterval(() => {
      fpsDisplay.textContent = `FPS: ${performanceMonitor.getFPS()}`;
    }, 1000);
  }
});

// Handle visibility change to pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
  if (animationController) {
    if (document.hidden) {
      animationController.pauseAnimations();
    } else {
      animationController.resumeAnimations();
    }
  }
});

// Handle resize to adjust animations for mobile
window.addEventListener('resize', () => {
  const wasMobile = animationController?.isMobile;
  const isMobile = window.innerWidth <= 768;
  
  if (wasMobile !== isMobile && animationController) {
    animationController.isMobile = isMobile;
    
    if (isMobile) {
      animationController.cleanupFloatingElements();
      document.body.classList.add('mobile-optimized');
    } else {
      document.body.classList.remove('mobile-optimized');
    }
  }
});

// Export for global access
window.AnimationController = AnimationController;
window.animationController = animationController;