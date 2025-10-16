/**
 * Portfolio Configuration for AA Event Decor and Rentals
 * Final Merged Version - Optimized Configuration
 * Updated: Services = single image, About = multiple images with slider, Portfolio = multiple images
 */

// Portfolio data - Multiple images with slider support
const PORTFOLIO_DATA = [
  {
    name: "Wedding and Bridal Shower",
    folderPath: "images/portfolio/wedding/",
    possibleImages: [
      "images/portfolio/wedding/wedding-setup-1.jpg",
      "images/portfolio/wedding/wedding-setup-2.jpg",
      "images/portfolio/wedding/wedding-setup-3.jpg",
      "images/portfolio/wedding/wedding-setup-4.jpg",
      "images/portfolio/wedding/wedding-setup-5.jpg",
      "images/portfolio/wedding/wedding-setup-6.jpg",
      "images/portfolio/wedding/wedding-setup-7.jpg",
      "images/portfolio/wedding/wedding-setup-8.jpg",
      "images/portfolio/wedding/wedding-setup-9.jpg",
      "images/portfolio/wedding/wedding-setup-10.jpg"
    ],
    description: "Elegant wedding and bridal shower decorations with stunning backdrops",
    fallback: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Birthday Theme Setups",
    folderPath: "images/portfolio/birthday/",
    possibleImages: [
      "images/portfolio/birthday/birthday-theme-1.jpg",
      "images/portfolio/birthday/birthday-theme-2.jpg",
      "images/portfolio/birthday/birthday-theme-3.jpg",
      "images/portfolio/birthday/birthday-theme-4.jpg",
      "images/portfolio/birthday/birthday-theme-5.jpg",
      "images/portfolio/birthday/birthday-theme-6.jpg",
      "images/portfolio/birthday/birthday-theme-7.jpg",
      "images/portfolio/birthday/birthday-theme-8.jpg",
      "images/portfolio/birthday/birthday-theme-9.jpg",
      "images/portfolio/birthday/birthday-theme-10.jpg"
    ],
    description: "Custom birthday party themes with balloon décor and styling",
    fallback: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Baby Shower and Gender Reveal",
    folderPath: "images/portfolio/babyshower/",
    possibleImages: [
      "images/portfolio/babyshower/baby-shower-1.jpg",
      "images/portfolio/babyshower/baby-shower-2.jpg",
      "images/portfolio/babyshower/baby-shower-3.jpg",
      "images/portfolio/babyshower/baby-shower-4.jpg",
      "images/portfolio/babyshower/baby-shower-5.jpg",
      "images/portfolio/babyshower/baby-shower-6.jpg",
      "images/portfolio/babyshower/baby-shower-7.jpg",
      "images/portfolio/babyshower/baby-shower-8.jpg",
      "images/portfolio/babyshower/baby-shower-9.jpg",
      "images/portfolio/babyshower/baby-shower-10.jpg"
    ],
    description: "Beautiful baby shower and gender reveal decorations",
    fallback: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Retirement Events",
    folderPath: "images/portfolio/retirement/",
    possibleImages: [
      "images/portfolio/retirement/retirement-party-1.jpg",
      "images/portfolio/retirement/retirement-party-2.jpg",
      "images/portfolio/retirement/retirement-party-3.jpg",
      "images/portfolio/retirement/retirement-party-4.jpg",
      "images/portfolio/retirement/retirement-party-5.jpg",
      "images/portfolio/retirement/retirement-party-6.jpg",
      "images/portfolio/retirement/retirement-party-7.jpg",
      "images/portfolio/retirement/retirement-party-8.jpg",
      "images/portfolio/retirement/retirement-party-9.jpg",
      "images/portfolio/retirement/retirement-party-10.jpg"
    ],
    description: "Elegant retirement celebration setups and décor",
    fallback: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Corporate Events",
    folderPath: "images/portfolio/corporate/",
    possibleImages: [
      "images/portfolio/corporate/corporate-gala-1.jpg",
      "images/portfolio/corporate/corporate-gala-2.jpg",
      "images/portfolio/corporate/corporate-gala-3.jpg",
      "images/portfolio/corporate/corporate-gala-4.jpg",
      "images/portfolio/corporate/corporate-gala-5.jpg",
      "images/portfolio/corporate/corporate-gala-6.jpg",
      "images/portfolio/corporate/corporate-gala-7.jpg",
      "images/portfolio/corporate/corporate-gala-8.jpg",
      "images/portfolio/corporate/corporate-gala-9.jpg",
      "images/portfolio/corporate/corporate-gala-10.jpg"
    ],
    description: "Professional corporate event décor and styling",
    fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Rentals",
    folderPath: "images/portfolio/rentals/",
    possibleImages: [
      "images/portfolio/rentals/rental-items-1.jpg",
      "images/portfolio/rentals/rental-items-2.jpg",
      "images/portfolio/rentals/rental-items-3.jpg",
      "images/portfolio/rentals/rental-items-4.jpg",
      "images/portfolio/rentals/rental-items-5.jpg",
      "images/portfolio/rentals/rental-items-6.jpg",
      "images/portfolio/rentals/rental-items-7.jpg",
      "images/portfolio/rentals/rental-items-8.jpg",
      "images/portfolio/rentals/rental-items-9.jpg",
      "images/portfolio/rentals/rental-items-10.jpg"
    ],
    description: "Premium event rental items and prop collections",
    fallback: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&auto=format"
  }
];

// Services data - Single image per service with fallback
const SERVICES_DATA = [
  {
    title: "💍 Wedding and Bridal Showers",
    description: "Create your dream wedding with stunning backdrops, elegant table décor, and beautiful balloon garlands",
    features: [
      "Custom backdrops & photo walls",
      "Bridal table styling & centerpieces",
      "Balloon garlands & arches",
      "Ceremony & reception décor"
    ],
    image: "images/services/wedding-services/service-image.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🎂 Birthday Theme Setups",
    description: "Transform birthday celebrations with custom themed décor and balloon arrangements",
    features: [
      "Custom themed backdrops",
      "Balloon décor & installations",
      "Dessert table styling",
      "Photo booth props & setups"
    ],
    image: "images/services/birthday-services/service-image.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "👶 Baby Showers & Gender Reveals",
    description: "Celebrate new arrivals with adorable décor and memorable gender reveal setups",
    features: [
      "Gender reveal decorations",
      "Pastel themed styling",
      "Baby shower backdrops",
      "Dessert & gift table décor"
    ],
    image: "images/services/babyshower-services/service-image.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🏢 Corporate Events",
    description: "Professional event décor for corporate functions, meetings, and company celebrations",
    features: [
      "Conference & meeting setups",
      "Corporate branding displays",
      "Award ceremony décor",
      "Professional table styling"
    ],
    image: "images/services/corporate-services/service-image.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🎓 Retirement & Special Events",
    description: "Honor special milestones with elegant décor for retirement parties and celebrations",
    features: [
      "Retirement celebration décor",
      "Milestone event styling",
      "Custom memory displays",
      "Honor ceremony setups"
    ],
    image: "images/services/retirement-services/service-image.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🎪 Rentals & Props",
    description: "Premium rental items including props, furniture, and decorative pieces for your event",
    features: [
      "Backdrop stands & frames",
      "Decorative furniture pieces",
      "Photo booth props",
      "Table linens & centerpieces"
    ],
    image: "images/services/rental-services/service-image.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&auto=format"
  }
];

// About data - Multiple images with slider (like Portfolio)
const ABOUT_DATA = {
  name: "About Us",
  folderPath: "images/about/",
  possibleImages: [
    "images/about/about-image-1.jpg",
    "images/about/about-image-2.jpg",
    "images/about/about-image-3.jpg",
    "images/about/about-image-4.jpg",
    "images/about/about-image-5.jpg",
    "images/about/about-image-6.jpg",
    "images/about/about-image-7.jpg",
    "images/about/about-image-8.jpg",
    "images/about/about-image-9.jpg",
    "images/about/about-image-10.jpg"
  ],
  description: "Our team and workspace",
  fallback: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop&auto=format"
};

// Contact information configuration
const CONTACT_CONFIG = {
  phone: '+16122089898',
  email: 'aaeventdecor.llc@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/share/1AAjeoxDdh/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/aa_eventdecor_llc?igsh=dmZsNmx2c2hpY21q'
  },
  hours: {
    weekdays: '9AM-7PM',
    weekend: 'By appointment'
  },
  address: 'Minnesota, USA'
};

// Site configuration
const SITE_CONFIG = {
  name: 'AA Event Decor and Rentals',
  tagline: 'Creating Magical Moments',
  description: 'Professional event décor and rental services for weddings, birthdays, baby showers, corporate events, and more.',
  keywords: ['event décor', 'event rentals', 'wedding decoration', 'birthday party', 'corporate events', 'baby shower', 'Minnesota event décor'],
  foundedYear: 2019,
  experience: '5+',
  autoSlideInterval: 5000,
  animationSpeed: 'normal',
  enableFloatingElements: true,
  enableAutoSlider: true
};

// Export for use in other files (Node.js/module environments)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PORTFOLIO_DATA,
    SERVICES_DATA,
    ABOUT_DATA,
    CONTACT_CONFIG,
    SITE_CONFIG
  };
}

// Make available globally (browser environment)
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
window.SERVICES_DATA = SERVICES_DATA;
window.ABOUT_DATA = ABOUT_DATA;
window.CONTACT_CONFIG = CONTACT_CONFIG;
window.SITE_CONFIG = SITE_CONFIG;