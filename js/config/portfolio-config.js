/**
 * Portfolio Configuration for AA Event Decor and Rentals
 * Add your own images by updating the arrays in each category
 */

/**
 * Portfolio Configuration for AA Event Decor and Rentals
 * Enhanced with Auto Image Detection and Multiple Image Support
 */

// Portfolio data with auto image detection support
const PORTFOLIO_DATA = [
  {
    name: "Wedding and Bridal Shower",
    folderPath: "images/portfolio/wedding/", // Folder to check for images
    possibleImages: [ // Specific images to look for
      "images/portfolio/wedding/wedding-setup-1.jpg",
      "images/portfolio/wedding/wedding-setup-2.jpg",
      "images/portfolio/wedding/wedding-ceremony-1.jpg",
      "images/portfolio/wedding/bridal-shower-1.jpg",
      "images/portfolio/wedding/bridal-shower-2.jpg",
      "images/portfolio/wedding/reception-decor-1.jpg"
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
      "images/portfolio/birthday/kids-party-1.jpg",
      "images/portfolio/birthday/adult-birthday-1.jpg",
      "images/portfolio/birthday/balloon-setup-1.jpg"
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
      "images/portfolio/babyshower/gender-reveal-1.jpg",
      "images/portfolio/babyshower/gender-reveal-2.jpg",
      "images/portfolio/babyshower/pastel-decor-1.jpg",
      "images/portfolio/babyshower/welcome-baby-1.jpg"
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
      "images/portfolio/retirement/milestone-celebration-1.jpg",
      "images/portfolio/retirement/honor-ceremony-1.jpg",
      "images/portfolio/retirement/farewell-setup-1.jpg"
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
      "images/portfolio/corporate/conference-setup-1.jpg",
      "images/portfolio/corporate/award-ceremony-1.jpg",
      "images/portfolio/corporate/company-party-1.jpg",
      "images/portfolio/corporate/product-launch-1.jpg"
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
      "images/portfolio/rentals/prop-collection-1.jpg",
      "images/portfolio/rentals/furniture-rentals-1.jpg",
      "images/portfolio/rentals/backdrop-stands-1.jpg",
      "images/portfolio/rentals/table-settings-1.jpg"
    ],
    description: "Premium event rental items and prop collections",
    fallback: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&auto=format"
  }
];

// Services data for slider
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
    images: [
      "images/services/wedding-services/ceremony-setup.jpg",
      "images/services/wedding-services/reception-hall.jpg",
      "images/services/wedding-services/bridal-decoration.jpg"
    ],
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
    images: [
      "images/services/birthday-services/balloon-arch.jpg",
      "images/services/birthday-services/theme-party.jpg",
      "images/services/birthday-services/kids-setup.jpg"
    ],
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
    images: [
      "images/services/babyshower-services/gender-reveal.jpg",
      "images/services/babyshower-services/pastel-setup.jpg",
      "images/services/babyshower-services/welcome-baby.jpg"
    ],
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
    images: [
      "images/services/corporate-services/conference-setup.jpg",
      "images/services/corporate-services/gala-night.jpg",
      "images/services/corporate-services/product-launch.jpg"
    ],
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
    images: [
      "images/services/retirement-services/retirement-party.jpg",
      "images/services/retirement-services/milestone-celebration.jpg",
      "images/services/retirement-services/honor-ceremony.jpg"
    ],
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
    images: [
      "images/services/rental-services/backdrop-stands.jpg",
      "images/services/rental-services/furniture-rentals.jpg",
      "images/services/rental-services/prop-collection.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&auto=format"
  }
];

// Contact information configuration
const CONTACT_CONFIG = {
  phone: '+16122089898',
  email: 'aaeventdecor.llc@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/share/1AAjeoxDdh/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/aa_eventdecor_llc?igsh=dmZsNmx2c2hpY21q '
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PORTFOLIO_DATA,
    SERVICES_DATA,
    CONTACT_CONFIG,
    SITE_CONFIG
  };
}
// At the end of portfolio-config.js, add:
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
window.SERVICES_DATA = SERVICES_DATA;