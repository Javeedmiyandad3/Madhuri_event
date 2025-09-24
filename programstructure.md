# AA Event Decor and Rentals - Program Structure

## Project Overview
This is a complete responsive website for AA Event Decor and Rentals with advanced portfolio management supporting multiple images per category, auto image detection, and fallback systems.

## 📁 Complete File Structure

```
aa-event-decor-website/
├── index.html                          # Main HTML file
├── PROGRAM_STRUCTURE.md                 # This file - project documentation
├── 
├── css/                                 # Stylesheets directory
│   ├── main.css                         # Core styles and variables
│   ├── components/                      # Component-specific styles
│   │   ├── header.css                   # Header and navigation styles
│   │   ├── hero.css                     # Hero section styles
│   │   ├── portfolio.css                # Portfolio with multiple image support
│   │   ├── services.css                 # Services slider styles
│   │   └── animations.css               # Animation styles
│   └── responsive.css                   # Mobile and responsive styles
├── 
├── js/                                  # JavaScript files
│   ├── config/                          # Configuration files
│   │   └── portfolio-config.js          # Portfolio & services configuration
│   ├── components/                      # Component JavaScript
│   │   ├── animations.js                # Animation controllers
│   │   ├── navigation.js                # Navigation functionality
│   │   └── portfolio.js                 # Portfolio interactions (optional)
│   └── main.js                          # Main application controller
├── 
├── images/                              # Images directory
│   ├── logo/                            # Company logo
│   │   └── aa-decor-logo.PNG           # Main logo file
│   ├── 
│   ├── portfolio/                       # Portfolio images (AUTO-DETECTED)
│   │   ├── wedding/                     # Wedding & bridal shower images
│   │   │   ├── wedding-setup-1.jpg
│   │   │   ├── wedding-setup-2.jpg
│   │   │   ├── wedding-ceremony-1.jpg
│   │   │   ├── bridal-shower-1.jpg
│   │   │   ├── bridal-shower-2.jpg
│   │   │   └── reception-decor-1.jpg
│   │   ├── birthday/                    # Birthday theme images
│   │   │   ├── birthday-theme-1.jpg
│   │   │   ├── birthday-theme-2.jpg
│   │   │   ├── birthday-theme-3.jpg
│   │   │   ├── kids-party-1.jpg
│   │   │   ├── adult-birthday-1.jpg
│   │   │   └── balloon-setup-1.jpg
│   │   ├── babyshower/                  # Baby shower & gender reveal
│   │   │   ├── baby-shower-1.jpg
│   │   │   ├── baby-shower-2.jpg
│   │   │   ├── gender-reveal-1.jpg
│   │   │   ├── gender-reveal-2.jpg
│   │   │   ├── pastel-decor-1.jpg
│   │   │   └── welcome-baby-1.jpg
│   │   ├── retirement/                  # Retirement events
│   │   │   ├── retirement-party-1.jpg
│   │   │   ├── retirement-party-2.jpg
│   │   │   ├── milestone-celebration-1.jpg
│   │   │   ├── honor-ceremony-1.jpg
│   │   │   └── farewell-setup-1.jpg
│   │   ├── corporate/                   # Corporate events
│   │   │   ├── corporate-gala-1.jpg
│   │   │   ├── corporate-gala-2.jpg
│   │   │   ├── conference-setup-1.jpg
│   │   │   ├── award-ceremony-1.jpg
│   │   │   ├── company-party-1.jpg
│   │   │   └── product-launch-1.jpg
│   │   └── rentals/                     # Rental items
│   │       ├── rental-items-1.jpg
│   │       ├── rental-items-2.jpg
│   │       ├── prop-collection-1.jpg
│   │       ├── furniture-rentals-1.jpg
│   │       ├── backdrop-stands-1.jpg
│   │       └── table-settings-1.jpg
│   └── 
│   └── services/                        # Service category images
│       ├── wedding-services/
│       │   ├── ceremony-setup.jpg
│       │   ├── reception-hall.jpg
│       │   └── bridal-decoration.jpg
│       ├── birthday-services/
│       │   ├── balloon-arch.jpg
│       │   ├── theme-party.jpg
│       │   └── kids-setup.jpg
│       ├── babyshower-services/
│       │   ├── gender-reveal.jpg
│       │   ├── pastel-setup.jpg
│       │   └── welcome-baby.jpg
│       ├── corporate-services/
│       │   ├── conference-setup.jpg
│       │   ├── gala-night.jpg
│       │   └── product-launch.jpg
│       ├── retirement-services/
│       │   ├── retirement-party.jpg
│       │   ├── milestone-celebration.jpg
│       │   └── honor-ceremony.jpg
│       └── rental-services/
│           ├── backdrop-stands.jpg
│           ├── furniture-rentals.jpg
│           └── prop-collection.jpg
└── 
└── assets/                              # Additional assets
    ├── icons/
    │   └── favicon.ico
    └── fonts/                           # Custom fonts (if needed)
```

## 🚀 Key Features

### Multiple Image Portfolio System
- **Auto Image Detection**: Automatically detects images in portfolio folders
- **Flexible Image Support**: Works with 1 to unlimited images per portfolio category
- **Smart Fallbacks**: Uses Unsplash fallback images if no local images found
- **Image Sliders**: Navigation arrows and dots for multiple images
- **Touch Support**: Swipe gestures on mobile devices

### Portfolio Categories
1. **Wedding and Bridal Shower**
2. **Birthday Theme Setups**
3. **Baby Shower and Gender Reveal**
4. **Retirement Events**
5. **Corporate Events**
6. **Rentals**

## 📝 Configuration

### Adding Images to Portfolio

#### Method 1: Auto Detection (Recommended)
1. Create images in the respective folder (e.g., `images/portfolio/wedding/`)
2. Name your images following the patterns in `portfolio-config.js`
3. The system will automatically detect and display them

#### Method 2: Manual Configuration
Edit `js/config/portfolio-config.js` and update the `possibleImages` array:

```javascript
{
  name: "Wedding and Bridal Shower",
  possibleImages: [
    "images/portfolio/wedding/your-new-image.jpg",
    "images/portfolio/wedding/another-image.jpg"
  ],
  // ... other properties
}
```

### Image Requirements
- **Format**: JPG, PNG, WebP recommended
- **Size**: Optimally 800x600px or similar 4:3 ratio
- **File Size**: Under 500KB for best performance
- **Naming**: Use descriptive names with no spaces (use hyphens)

## 🛠️ Technical Implementation

### Main Components

#### `main.js` - Core Application
- **Image Detection System**: Automatically scans for portfolio images
- **Portfolio Management**: Handles single and multiple image displays
- **Slider Controls**: Navigation arrows, dots, and touch gestures
- **Performance Optimization**: Image caching and lazy loading

#### `portfolio.css` - Styling
- **Responsive Grid**: Adapts to different screen sizes
- **Image Sliders**: Smooth transitions and animations
- **Navigation Controls**: Hover effects and touch-friendly buttons
- **Mobile Optimization**: Touch gestures and reduced motion support

#### `portfolio-config.js` - Configuration
- **Portfolio Data**: Defines categories and image paths
- **Services Data**: Service slider content
- **Contact Information**: Business contact details
- **Site Configuration**: Global settings

## 🔧 Customization Guide

### Adding New Portfolio Category

1. **Update Configuration** (`js/config/portfolio-config.js`):
```javascript
const PORTFOLIO_DATA = [
  // ... existing categories
  {
    name: "New Category Name",
    folderPath: "images/portfolio/new-category/",
    possibleImages: [
      "images/portfolio/new-category/image-1.jpg",
      "images/portfolio/new-category/image-2.jpg"
    ],
    description: "Description of new category",
    fallback: "https://fallback-url.jpg"
  }
];
```

2. **Create Image Folder**:
```
images/portfolio/new-category/
├── image-1.jpg
├── image-2.jpg
└── image-3.jpg
```

3. **No Code Changes Needed**: The system auto-detects new categories!

### Modifying Image Detection

Edit the `detectPortfolioImages()` function in `main.js` to change detection patterns:

```javascript
const possibleImages = item.possibleImages || [
  `${folderPath}custom-name-1.jpg`,
  `${folderPath}custom-name-2.jpg`,
  // Add your naming patterns here
];
```

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly navigation buttons (44px minimum)
- Swipe gesture support for image sliders
- Reduced animation complexity
- Optimized image sizes
- Simplified hover effects for touch devices

## 🎨 Styling System

### CSS Variables
Core colors and spacing defined in `css/main.css`:
```css
:root {
  --primary-pink: #ff6b9d;
  --primary-gold: #ffd700;
  --gradient-primary: linear-gradient(45deg, #8E2DE2, #FF4F81, #FF8C42);
  /* ... */
}
```

### Component Structure
- **BEM Methodology**: Block__Element--Modifier naming
- **CSS Grid**: Modern layout system
- **Flexbox**: Component alignment
- **CSS Custom Properties**: Consistent theming

## 🚀 Performance Features

### Image Optimization
- **Lazy Loading**: Images load only when visible
- **Image Caching**: Prevents duplicate network requests
- **Fallback System**: Graceful degradation if images fail
- **WebP Support**: Modern format detection

### Animation Performance
- **GPU Acceleration**: Hardware-accelerated transforms
- **Reduced Motion**: Respects user accessibility preferences
- **Efficient Animations**: CSS transforms over JavaScript
- **Frame Rate Monitoring**: Automatic performance adjustment

## 🔍 Browser Support

### Supported Browsers
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile Safari**: iOS 13+
- **Chrome Mobile**: Android 8+

### Fallbacks
- **CSS Grid**: Flexbox fallback
- **Custom Properties**: Static values fallback
- **Modern JavaScript**: Babel transpilation ready

## 📞 Contact Configuration

Update contact information in `js/config/portfolio-config.js`:

```javascript
const CONTACT_CONFIG = {
  phone: '+16122089898',
  email: 'aaeventdecor.llc@gmail.com',
  social: {
    facebook: 'https://facebook.com/aaeventdecorrentals',
    instagram: 'https://www.instagram.com/aa_eventdecor_llc?igsh=dmZsNmx2c2hpY21q'
  },
  address: 'Minnesota, USA'
};
```

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
1. Check file paths in `portfolio-config.js`
2. Verify image files exist in correct folders
3. Check browser console for 404 errors
4. Ensure proper file permissions

#### Slider Not Working
1. Verify `main.js` is loaded after `portfolio-config.js`
2. Check browser console for JavaScript errors
3. Ensure proper HTML structure
4. Test with browser developer tools

#### Mobile Issues
1. Test with real devices, not just browser simulation
2. Check touch event handling
3. Verify viewport meta tag
4. Test with different screen orientations

## 📈 SEO Optimization

### Built-in SEO Features
- **Semantic HTML**: Proper heading hierarchy
- **Alt Tags**: Descriptive image alt attributes
- **Meta Tags**: Title and description optimization
- **Structured Data**: Business information markup
- **Clean URLs**: Hash-based navigation
- **Fast Loading**: Optimized assets and lazy loading

## 🔒 Security Considerations

### Image Security
- **Input Validation**: Safe image path handling
- **XSS Prevention**: Escaped user content
- **HTTPS Ready**: Secure protocol support
- **Content Security**: Safe external resource loading

## 📊 Analytics Ready

The website is prepared for analytics integration:
- **Event Tracking**: Portfolio interactions
- **Performance Monitoring**: Loading times
- **User Behavior**: Navigation patterns
- **Conversion Tracking**: Contact form submissions

---

## 🎯 Quick Start Checklist

1. ✅ **Replace Logo**: Add your logo to `images/logo/aa-decor-logo.PNG`
2. ✅ **Add Portfolio Images**: Place images in respective `images/portfolio/` folders
3. ✅ **Update Contact Info**: Modify `js/config/portfolio-config.js`
4. ✅ **Test on Mobile**: Verify responsive design
5. ✅ **Check All Images**: Ensure no broken links
6. ✅ **Customize Colors**: Adjust CSS variables if needed
7. ✅ **SEO Optimization**: Update meta tags and descriptions

Your AA Event Decor and Rentals