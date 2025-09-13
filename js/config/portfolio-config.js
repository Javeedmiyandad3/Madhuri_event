/**
 * Portfolio Configuration for AA Decor
 * Add your own images by updating the arrays in each category
 */

// Portfolio data for simple name/picture cards
const PORTFOLIO_DATA = [
  {
    name: "Elegant Wedding Setup",
    image: "images/portfolio/wedding-setup-1.jpg",
    description: "Royal wedding decoration with floral arrangements",
    fallback: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Princess Birthday Party",
    image: "images/portfolio/birthday-party-1.jpg",
    description: "Magical princess themed birthday celebration",
    fallback: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Corporate Gala Night",
    image: "images/portfolio/corporate-event-1.jpg",
    description: "Sophisticated corporate annual celebration setup",
    fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Baby Shower Bliss",
    image: "images/portfolio/baby-shower-1.jpg",
    description: "Sweet and adorable baby shower decoration",
    fallback: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Golden Anniversary",
    image: "images/portfolio/anniversary-1.jpg",
    description: "50th anniversary celebration with golden theme",
    fallback: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop&auto=format"
  },
  {
    name: "Superhero Theme Party",
    image: "images/portfolio/custom-theme-1.jpg",
    description: "Custom superhero themed birthday party",
    fallback: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&auto=format"
  }
];

// Services data for slider
const SERVICES_DATA = [
  {
    title: "👑 Wedding Decorations",
    description: "Transform your wedding into a fairytale with our elegant decoration services",
    features: [
      "Bridal Stage Decoration",
      "Reception Hall Setup",
      "Floral Arrangements",
      "Lighting & Draping"
    ],
    images: [
      "images/services/wedding-services/ceremony-setup.jpg",
      "images/services/wedding-services/reception-hall.jpg",
      "images/services/wedding-services/bridal-decoration.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🎂 Birthday Parties",
    description: "Make birthdays unforgettable with themed decorations for all ages",
    features: [
      "Balloon Decorations",
      "Theme-based Setup",
      "Kids Party Special",
      "Cake Table Design"
    ],
    images: [
      "images/services/birthday-services/balloon-arch.jpg",
      "images/services/birthday-services/theme-party.jpg",
      "images/services/birthday-services/kids-setup.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🏢 Corporate Events",
    description: "Professional decoration services for corporate functions and galas",
    features: [
      "Conference Setup",
      "Product Launch Events",
      "Annual Day Celebrations",
      "Award Ceremonies"
    ],
    images: [
      "images/services/corporate-services/conference-setup.jpg",
      "images/services/corporate-services/gala-night.jpg",
      "images/services/corporate-services/product-launch.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "👶 Baby Showers",
    description: "Adorable decorations for welcoming your little bundle of joy",
    features: [
      "Gender Reveal Parties",
      "Pastel Theme Decorations",
      "Photo Booth Setup",
      "Welcome Baby Setups"
    ],
    images: [
      "images/services/babyshower-services/gender-reveal.jpg",
      "images/services/babyshower-services/pastel-setup.jpg",
      "images/services/babyshower-services/welcome-baby.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "💕 Anniversary Celebrations",
    description: "Romantic setups to celebrate your milestones of love",
    features: [
      "Intimate Dinner Setup",
      "Vow Renewal Ceremonies",
      "Milestone Celebrations",
      "Surprise Arrangements"
    ],
    images: [
      "images/services/anniversary-services/romantic-dinner.jpg",
      "images/services/anniversary-services/renewal-ceremony.jpg",
      "images/services/anniversary-services/milestone-celebration.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop&auto=format"
  },
  {
    title: "🎨 Custom Themes",
    description: "Unique themed decorations tailored to your vision",
    features: [
      "Vintage & Retro Themes",
      "Modern Minimalist",
      "Outdoor Garden Parties",
      "Cultural Celebrations"
    ],
    images: [
      "images/services/custom-services/vintage-theme.jpg",
      "images/services/custom-services/modern-minimalist.jpg",
      "images/services/custom-services/outdoor-garden.jpg"
    ],
    fallbackImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&auto=format"
  }
];

// Contact information configuration
const CONTACT_CONFIG = {
  phone: '+1234567890',
  email: 'hello@aadecor.com',
  whatsapp: {
    number: '1234567890',
    message: 'Hi! I\'m interested in your event decoration services.'
  },
  social: {
    facebook: 'https://facebook.com/aadecor',
    instagram: 'https://instagram.com/aadecor',
    youtube: 'https://youtube.com/@aadecor'
  },
  hours: {
    weekdays: '9AM-7PM',
    weekend: 'By appointment'
  },
  address: 'Your City, State'
};

// Site configuration
const SITE_CONFIG = {
  name: 'AA Decor',
  tagline: 'Creating Magical Moments',
  description: 'Professional event decoration services for weddings, birthdays, corporate events, and more.',
  keywords: ['event decoration', 'wedding decoration', 'birthday party', 'corporate events', 'AA Decor'],
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