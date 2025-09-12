/**
 * Navigation Controller
 * Handles all navigation-related functionality
 */

class NavigationController {
  constructor() {
    this.header = document.getElementById('header');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    this.contactDropdown = document.querySelector('.contact-dropdown');
    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 100;
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollBehavior();
    this.setupSmoothScrolling();
    this.setupContactDropdown();
    this.setupActiveNavigation();
    this.setupKeyboardNavigation();
  }

  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.navMenu) return;

    this.mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target) && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    this.navMenu.classList.toggle('active');
    this.mobileMenuBtn.classList.toggle('active');
    
    // Update ARIA attributes
    this.mobileMenuBtn.setAttribute('aria-expanded', this.isMenuOpen);
    this.navMenu.setAttribute('aria-hidden', !this.isMenuOpen);
    
    // Update icon
    const icon = this.mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.className = this.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Focus management
    if (this.isMenuOpen) {
      this.navMenu.querySelector('a')?.focus();
    } else {
      this.mobileMenuBtn.focus();
    }
  }

  closeMobileMenu() {
    if (!this.isMenuOpen) return;
    
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.mobileMenuBtn.classList.remove('active');
    
    // Update ARIA attributes
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    this.navMenu.setAttribute('aria-hidden', 'true');
    
    // Reset icon
    const icon = this.mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-bars';
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  setupScrollBehavior() {
    let ticking = false;
    
    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      // Add/remove scrolled class
      if (currentScrollY > this.scrollThreshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll (optional)
      if (Math.abs(currentScrollY - this.lastScrollY) > 5) {
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
          // Scrolling down
          this.header.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up
          this.header.style.transform = 'translateY(0)';
        }
        this.lastScrollY = currentScrollY;
      }
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = this.header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu after navigation
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }
          
          // Update URL without triggering scroll
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  setupContactDropdown() {
    if (!this.contactDropdown) return;

    const contactBtn = document.querySelector('.header-contact-btn');
    let hideTimeout;

    const showDropdown = () => {
      clearTimeout(hideTimeout);
      this.contactDropdown.style.opacity = '1';
      this.contactDropdown.style.visibility = 'visible';
      this.contactDropdown.style.transform = 'translateY(0)';
    };

    const hideDropdown = () => {
      hideTimeout = setTimeout(() => {
        this.contactDropdown.style.opacity = '0';
        this.contactDropdown.style.visibility = 'hidden';
        this.contactDropdown.style.transform = 'translateY(-10px)';
      }, 150);
    };

    if (contactBtn) {
      contactBtn.addEventListener('mouseenter', showDropdown);
      contactBtn.addEventListener('mouseleave', hideDropdown);
      contactBtn.addEventListener('focus', showDropdown);
      contactBtn.addEventListener('blur', hideDropdown);
    }

    this.contactDropdown.addEventListener('mouseenter', showDropdown);
    this.contactDropdown.addEventListener('mouseleave', hideDropdown);

    // Handle keyboard navigation in dropdown
    const dropdownItems = this.contactDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextItem = dropdownItems[index + 1] || dropdownItems[0];
          nextItem.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevItem = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
          prevItem.focus();
        } else if (e.key === 'Escape') {
          hideDropdown();
          contactBtn?.focus();
        }
      });
    });
  }

  setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    const observerOptions = {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to current link
          const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  setupKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main';
    }

    // Tab trap for mobile menu
    this.setupTabTrap();
  }

  setupTabTrap() {
    const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
    
    document.addEventListener('keydown', (e) => {
      if (!this.isMenuOpen || e.key !== 'Tab') return;
      
      const focusableContent = this.navMenu.querySelectorAll(focusableElements);
      const firstFocusable = focusableContent[0];
      const lastFocusable = focusableContent[focusableContent.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  // Public methods
  scrollToSection(sectionId) {
    const targetElement = document.querySelector(sectionId);
    if (targetElement) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  highlightNavItem(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === sectionId);
    });
  }

  destroy() {
    // Clean up event listeners if needed
    document.body.style.overflow = '';
    this.closeMobileMenu();
  }
}

// Initialize navigation controller
let navigationController;

document.addEventListener('DOMContentLoaded', () => {
  navigationController = new NavigationController();
});

// Export for global access
window.NavigationController = NavigationController;
window.navigationController = navigationController;