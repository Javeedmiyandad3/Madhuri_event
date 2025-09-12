/**
 * Portfolio Configuration
 * Add your own images by updating the arrays in each category
 */

const PORTFOLIO_CONFIG = {
  wedding: {
    title: "💒 Wedding Decorations",
    description: "Elegant and romantic wedding setups for your special day",
    icon: "fas fa-heart",
    images: [
      // "images/wedding/wedding1.jpg",
      // "images/wedding/wedding2.jpg",
      // "images/wedding/wedding3.jpg"
    ]
  },
  birthday: {
    title: "🎂 Birthday Parties",
    description: "Fun and colorful birthday celebrations for all ages",
    icon: "fas fa-birthday-cake",
    images: [
      // "images/birthday/birthday1.jpg",
      // "images/birthday/birthday2.jpg"
    ]
  },
  corporate: {
    title: "🏢 Corporate Events",
    description: "Professional and sophisticated corporate event setups",
    icon: "fas fa-briefcase",
    images: [
      // "images/corporate/corporate1.jpg"
    ]
  },
  babyshower: {
    title: "👶 Baby Showers",
    description: "Adorable and sweet baby shower decorations",
    icon: "fas fa-baby",
    images: [
      // "images/babyshower/babyshower1.jpg"
    ]
  },
  anniversary: {
    title: "💕 Anniversary Celebrations",
    description: "Romantic anniversary decoration setups",
    icon: "fas fa-ring", // updated to a valid Font Awesome icon
    images: [
      // "images/anniversary/anniversary1.jpg"
    ]
  },
  custom: {
    title: "🎨 Custom Themes",
    description: "Unique themed decorations tailored to your vision",
    icon: "fas fa-star",
    images: [
      // "images/custom/custom1.jpg"
    ]
  }
};

// Fallback images for demonstration (replace with your own)
const FALLBACK_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=400&fit=crop&auto=format',
    title: 'Themed Birthday Party',
    description: 'Colorful themed birthday celebration',
    category: 'custom'
  },
  {
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=400&fit=crop&auto=format',
    title: 'Elegant Wedding Reception',
    description: 'Beautiful wedding setup with floral arrangements',
    category: 'wedding'
  },
  {
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=400&fit=crop&auto=format',
    title: 'Garden Birthday Party',
    description: 'Outdoor birthday celebration with balloons',
    category: 'birthday'
  },
  {
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=400&fit=crop&auto=format',
    title: 'Corporate Gala Night',
    description: 'Professional corporate event decoration',
    category: 'corporate'
  },
  {
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=400&fit=crop&auto=format',
    title: 'Romantic Anniversary',
    description: 'Intimate anniversary celebration setup',
    category: 'anniversary'
  },
  {
    src: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500&h=400&fit=crop&auto=format',
    title: 'Baby Shower Bliss',
    description: 'Sweet baby shower decoration',
    category: 'babyshower'
  }
];

// Animation elements configuration
const FLOATING_ELEMENTS_CONFIG = {
  balloons: [
    { emoji: '🎈', color: '#ff6b9d' },
    { emoji: '🎈', color: '#ffd700' },
    { emoji: '🎈', color: '#6c5ce7' },
    { emoji: '🎈', color: '#a8e6cf' }
  ],
  flowers: [
    { emoji: '🌸', color: '#ff6b9d' },
    { emoji: '🌺', color: '#ffd700' },
    { emoji: '🌼', color: '#a8e6cf' },
    { emoji: '🌷', color: '#ff6b9d' },
    { emoji: '🌻', color: '#6c5ce7' }
  ],
  stars: [
    { emoji: '⭐', color: '#ffd700' },
    { emoji: '✨', color: '#ffd700' }
  ],
  cakes: [
    { emoji: '🎂', color: '#ffd700' },
    { emoji: '🧁', color: '#ff6b9d' }
  ],
  confetti: [
    { color: '#ff6b9d' },
    { color: '#ffd700' },
    { color: '#6c5ce7' },
    { color: '#a8e6cf' }
  ]
};

// Contact information configuration
const CONTACT_CONFIG = {
  phone: '+1234567890',
  email: 'hello@elegantevents.com',
  whatsapp: {
    number: '1234567890',
    message: 'Hi! I\'m interested in your event decoration services.'
  },
  social: {
    facebook: '#',
    instagram: '#',
    pinterest: '#'
  },
  hours: {
    weekdays: '9AM-7PM',
    weekend: 'By appointment'
  }
};

// Site configuration
const SITE_CONFIG = {
  name: 'Elegant Events',
  tagline: 'Creating magical moments with stunning decorations',
  description: 'Professional event decoration services for weddings, birthdays, corporate events, and more.',
  keywords: ['event decoration', 'wedding decoration', 'birthday party', 'corporate events', 'event planning'],
  foundedYear: 2019,
  experience: '5+',
  autoSlideInterval: 5000, // milliseconds
  animationSpeed: 'normal', // 'fast', 'normal', 'slow'
  enableFloatingElements: true,
  enableAutoSlider: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PORTFOLIO_CONFIG,
    FALLBACK_IMAGES,
    FLOATING_ELEMENTS_CONFIG,
    CONTACT_CONFIG,
    SITE_CONFIG
  };
}


