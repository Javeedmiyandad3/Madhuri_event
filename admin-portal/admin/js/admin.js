// admin.js - Complete Version with Forced Naming System (Bug Fixes Applied)
const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');

/**
 * Forced Naming System - Embedded
 * Completely ignores original filenames and auto-renames to website standards
 */
class ForcedNamingSystem {
    constructor(repoPath, imageCategories) {
        this.repoPath = repoPath;
        this.imageCategories = imageCategories;
        this.fs = require('fs').promises;
        this.path = require('path');
    }

    getCategoryConfig(category) {
        const configs = {
            // Portfolio categories - Sequential numbering (WORKING - NO CHANGES)
            'wedding': { folder: 'images/portfolio/wedding/', patterns: ['wedding-setup'], preferredExtension: '.jpg' },
            'birthday': { folder: 'images/portfolio/birthday/', patterns: ['birthday-theme'], preferredExtension: '.jpg' },
            'babyshower': { folder: 'images/portfolio/babyshower/', patterns: ['baby-shower'], preferredExtension: '.jpg' },
            'retirement': { folder: 'images/portfolio/retirement/', patterns: ['retirement-party'], preferredExtension: '.jpg' },
            'corporate': { folder: 'images/portfolio/corporate/', patterns: ['corporate-gala'], preferredExtension: '.jpg' },
            'rentals': { folder: 'images/portfolio/rentals/', patterns: ['rental-items'], preferredExtension: '.jpg' },
            
            // Service categories - SINGLE IMAGE (like Logo, replaces previous)
            'services-wedding': { 
                folder: 'images/services/wedding-services/', 
                patterns: ['service-image'],
                preferredExtension: '.jpg',
                singleFile: true
            },
            'services-birthday': { 
                folder: 'images/services/birthday-services/', 
                patterns: ['service-image'],
                preferredExtension: '.jpg',
                singleFile: true
            },
            'services-babyshower': { 
                folder: 'images/services/babyshower-services/', 
                patterns: ['service-image'],
                preferredExtension: '.jpg',
                singleFile: true
            },
            'services-corporate': { 
                folder: 'images/services/corporate-services/', 
                patterns: ['service-image'],
                preferredExtension: '.jpg',
                singleFile: true
            },
            'services-retirement': { 
                folder: 'images/services/retirement-services/', 
                patterns: ['service-image'],
                preferredExtension: '.jpg',
                singleFile: true
            },
            'services-rentals': { 
                folder: 'images/services/rental-services/', 
                patterns: ['service-image'],
                preferredExtension: '.jpg',
                singleFile: true
            },
            
            // About category - MULTIPLE IMAGES (like Portfolio, sequential numbering)
            'about': { 
                folder: 'images/about/', 
                patterns: ['about-image'],
                preferredExtension: '.jpg'
            },
            
            // Other special categories
            'logo': { folder: 'images/logo/', patterns: ['aa-decor-logo'], preferredExtension: '.png', singleFile: true },
            'hero': { folder: 'images/hero/', patterns: ['hero-banner'], preferredExtension: '.jpg' },
            'services': { folder: 'images/services/', patterns: ['service'], preferredExtension: '.jpg' },
            'backgrounds': { folder: 'images/backgrounds/', patterns: ['background'], preferredExtension: '.jpg' },
            'icons': { folder: 'images/icons/', patterns: ['icon'], preferredExtension: '.png' },
            'gallery': { folder: 'images/gallery/', patterns: ['gallery-image'], preferredExtension: '.jpg' }
        };
        return configs[category] || { folder: `images/${category}/`, patterns: [`${category}-image`], preferredExtension: '.jpg' };
    }

    // BUG FIX #1: Removed duplicate/corrupted getNextNumber method
    async getNextNumber(categoryPath, pattern) {
        try {
            const files = await this.fs.readdir(categoryPath);
            const regex = new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)\\.(jpg|jpeg|png|gif|webp|svg)$`, 'i');
            
            // Get all existing numbers
            const existingNumbers = files
                .map(file => {
                    const match = file.match(regex);
                    return match ? parseInt(match[1]) : null;
                })
                .filter(num => num !== null)
                .sort((a, b) => a - b); // Sort numerically
            
            // If no files exist, start with 1
            if (existingNumbers.length === 0) {
                return 1;
            }
            
            // BACKFILL: Find first missing number in sequence
            for (let i = 1; i <= existingNumbers.length; i++) {
                if (!existingNumbers.includes(i)) {
                    return i; // Return first gap
                }
            }
            
            // No gaps found, return next number
            return existingNumbers[existingNumbers.length - 1] + 1;
            
        } catch (error) {
            return 1;
        }
    }

    getStandardExtension(originalExtension, preferredExtension) {
        const ext = originalExtension.toLowerCase();
        
        // For portfolio/service categories, FORCE conversion to preferred extension
        if (preferredExtension === '.jpg') {
            if (['.png', '.jpeg', '.jpg', '.gif', '.webp'].includes(ext)) {
                return '.jpg';
            }
        }
        
        // For logo/icons categories that prefer .png, keep original if it's valid
        if (preferredExtension === '.png') {
            if (['.png', '.svg'].includes(ext)) {
                return ext;
            }
            return '.png';
        }
        
        return preferredExtension;
    }

    async generateForcedFilename(category, originalFile) {
        const config = this.getCategoryConfig(category);
        const categoryPath = this.path.join(this.repoPath, this.imageCategories[category]);
        await this.fs.mkdir(categoryPath, { recursive: true });
        const originalExt = this.path.extname(originalFile).toLowerCase();
        const extension = this.getStandardExtension(originalExt, config.preferredExtension);
        
        // Special case: Single file (Logo, Services)
        if (config.singleFile) { 
            return `${config.patterns[0]}${extension}`; 
        }
        
        // Default case: Sequential numbering (Portfolio, About)
        const mainPattern = config.patterns[0];
        const nextNumber = await this.getNextNumber(categoryPath, mainPattern);
        return `${mainPattern}-${nextNumber}${extension}`;
    }

    async getExistingImagesInPath(categoryPath) {
        try {
            const files = await this.fs.readdir(categoryPath);
            return files.filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
        } catch (error) {
            return [];
        }
    }

    async previewBulkUpload(category, files) {
        const previews = [];
        const config = this.getCategoryConfig(category);
        const categoryPath = this.path.join(this.repoPath, this.imageCategories[category]);
        let nextNumber = await this.getNextNumber(categoryPath, config.patterns[0]);
        
        for (const file of files) {
            const originalExt = this.path.extname(file).toLowerCase();
            const extension = this.getStandardExtension(originalExt, config.preferredExtension);
            const newFilename = config.singleFile 
                ? `${config.patterns[0]}${extension}` 
                : `${config.patterns[0]}-${nextNumber}${extension}`;
            
            previews.push({ 
                original: file, 
                new: newFilename, 
                number: nextNumber 
            });
            
            if (!config.singleFile) { 
                nextNumber++; 
            }
        }
        
        return { 
            category: category, 
            totalFiles: files.length, 
            previews: previews, 
            folder: config.folder 
        };
    }
}

class AdminPortal {
    constructor() {
        this.currentRepo = null;
        this.currentCategory = 'logo';
        this.git = null;
        this.pendingChanges = new Map();
        this.repoCredentials = null;
        this.fs = fs;
        this.errorLog = [];
        this.namingSystem = null;
        this.pendingUploadFiles = null;
        
        this.imageCategories = {
            logo: 'images/logo',
            wedding: 'images/portfolio/wedding',
            birthday: 'images/portfolio/birthday',
            babyshower: 'images/portfolio/babyshower',
            retirement: 'images/portfolio/retirement',
            corporate: 'images/portfolio/corporate',
            rentals: 'images/portfolio/rentals',
            about: 'images/about',
            services: 'images/services',
            'services-wedding': 'images/services/wedding-services',
            'services-birthday': 'images/services/birthday-services',
            'services-babyshower': 'images/services/babyshower-services',
            'services-corporate': 'images/services/corporate-services',
            'services-retirement': 'images/services/retirement-services',
            'services-rentals': 'images/services/rental-services',
            hero: 'images/hero',
            backgrounds: 'images/backgrounds',
            icons: 'images/icons',
            gallery: 'images/gallery'
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Admin Portal...');
        
        // Repository form
        const repoForm = document.getElementById('repo-form');
        if (repoForm) {
            repoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.cloneRepository();
            });
        }
        
        // Configuration form
        const configForm = document.getElementById('config-form');
        if (configForm) {
            configForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateConfiguration();
            });
        }
        
        // Image upload
        this.setupImageUpload();
        
        // Commit button
        const commitBtn = document.getElementById('commit-btn');
        if (commitBtn) {
            commitBtn.addEventListener('click', () => this.commitAndPush());
        }
        
        // View logs button
        const viewLogsBtn = document.getElementById('view-logs-btn');
        if (viewLogsBtn) {
            viewLogsBtn.addEventListener('click', () => this.showErrorLog());
        }
        
        console.log('Admin Portal initialized');
    }
    
    setupImageUpload() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        
        if (!uploadZone || !fileInput) return;
        
        // Click to upload
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File selection
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const files = Array.from(e.target.files);
                await this.handleImageUpload(files);
                fileInput.value = '';
            }
        });
        
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });
        
        uploadZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files).filter(file => 
                file.type.startsWith('image/')
            );
            
            if (files.length > 0) {
                await this.handleImageUpload(files);
            }
        });
    }
    
    async cloneRepository() {
        const url = document.getElementById('repo-url').value.trim();
        const token = document.getElementById('github-token').value.trim();
        const targetPath = document.getElementById('target-path').value.trim();
        
        if (!url || !token || !targetPath) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        try {
            this.showMessage('Cloning repository...', 'info');
            
            const repoPath = path.join(process.cwd(), 'target-websites', targetPath);
            
            try {
                await fs.access(repoPath);
                this.showMessage('Directory already exists. Please choose a different name or delete the existing one.', 'error');
                return;
            } catch {
                // Directory doesn't exist, continue
            }
            
            await fs.mkdir(repoPath, { recursive: true });
            
            const urlParts = url.replace('https://', '').replace('http://', '');
            const authenticatedUrl = `https://${token}@${urlParts}`;
            
            await simpleGit().clone(authenticatedUrl, repoPath);
            
            this.git = simpleGit(repoPath);
            this.currentRepo = repoPath;
            
            this.repoCredentials = {
                url: url,
                token: token,
                path: repoPath
            };
            
            document.getElementById('push-repo-url').value = url;
            document.getElementById('push-token').value = token;
            
            // Initialize FORCED naming system
            this.namingSystem = new ForcedNamingSystem(this.currentRepo, this.imageCategories);
            
            this.updateRepositoryStatus(true, targetPath);
            this.showMessage('✅ Repository cloned successfully!', 'success');
            
            await this.createImageFolders();
            await this.loadImages();
            
        } catch (error) {
            console.error('Clone error:', error);
            
            let errorMessage = 'Clone failed: ';
            if (error.message.includes('authentication') || error.message.includes('Authentication')) {
                errorMessage += 'Authentication failed. Check your token has "repo" permissions. ';
            } else if (error.message.includes('not found') || error.message.includes('404')) {
                errorMessage += 'Repository not found. Check the URL is correct. ';
            } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
                errorMessage += 'Network error. Check your internet connection. ';
            } else {
                errorMessage += error.message;
            }
            
            errorMessage += ` | Full error: ${error.toString()}`;
            this.showMessage(errorMessage, 'error');
        }
    }
    
    async createImageFolders() {
        if (!this.currentRepo) return;
        
        try {
            for (const categoryPath of Object.values(this.imageCategories)) {
                const fullPath = path.join(this.currentRepo, categoryPath);
                await fs.mkdir(fullPath, { recursive: true });
            }
            console.log('Image folders created');
        } catch (error) {
            console.error('Error creating folders:', error);
        }
    }
    
    async handleImageUpload(files) {
        if (!this.currentRepo) {
            this.showMessage('Please connect a repository first', 'error');
            return;
        }
        
        if (!this.namingSystem) {
            this.showMessage('Naming system not initialized. Please reconnect repository.', 'error');
            return;
        }
        
        // Show upload preview first
        await this.showUploadPreview(files);
    }
    
    async showUploadPreview(files) {
        const preview = await this.namingSystem.previewBulkUpload(
            this.currentCategory,
            Array.from(files).map(f => f.name)
        );
        
        // Create preview modal HTML
        const previewHtml = `
            <div style="max-height: 400px; overflow-y: auto;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">
                    📋 Upload Preview - ${this.currentCategory}
                </h3>
                <p style="color: #6c757d; margin-bottom: 20px;">
                    <strong>Destination:</strong> ${preview.folder}<br>
                    <strong>Total files:</strong> ${preview.totalFiles}
                </p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8f9fa; text-align: left;">
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">Original Name</th>
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: center;">→</th>
                            <th style="padding: 10px; border-bottom: 2px solid #dee2e6;">New Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${preview.previews.map(p => `
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 8px; color: #6c757d; font-family: monospace; font-size: 12px;">${p.original}</td>
                                <td style="padding: 8px; text-align: center; color: #28a745;">→</td>
                                <td style="padding: 8px; color: #28a745; font-weight: 600; font-family: monospace; font-size: 12px;">${p.new}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
                <button class="btn-primary" onclick="adminPortal.confirmUpload()" style="padding: 12px 24px;">
                    ✅ Confirm Upload
                </button>
                <button class="btn-secondary" onclick="adminPortal.cancelUpload()" style="padding: 12px 24px;">
                    ❌ Cancel
                </button>
            </div>
        `;
        
        // Show in modal
        const modal = document.getElementById('error-log-modal');
        const content = document.getElementById('error-log-content');
        
        if (modal && content) {
            content.innerHTML = previewHtml;
            modal.style.display = 'flex';
            
            // Store files for later
            this.pendingUploadFiles = files;
        }
    }
    
    async confirmUpload() {
        const modal = document.getElementById('error-log-modal');
        if (modal) modal.style.display = 'none';
        
        if (!this.pendingUploadFiles) return;
        
        await this.processImageUpload(this.pendingUploadFiles);
        this.pendingUploadFiles = null;
    }
    
    cancelUpload() {
        const modal = document.getElementById('error-log-modal');
        if (modal) modal.style.display = 'none';
        
        this.pendingUploadFiles = null;
        this.showMessage('Upload cancelled', 'info');
    }
    
    async processImageUpload(files) {
        const categoryPath = this.imageCategories[this.currentCategory];
        const targetDir = path.join(this.currentRepo, categoryPath);
        
        let uploaded = 0;
        let errors = [];
        
        this.showMessage('Uploading and renaming images...', 'info');
        
        for (const file of files) {
            try {
                // FORCED NAMING: Completely ignore original filename
                const finalFilename = await this.namingSystem.generateForcedFilename(
                    this.currentCategory,
                    file.name
                );
                
                console.log(`Renaming: ${file.name} → ${finalFilename}`);
                
                const targetPath = path.join(targetDir, finalFilename);
                
                const buffer = await file.arrayBuffer();
                await fs.writeFile(targetPath, Buffer.from(buffer));
                
                this.pendingChanges.set(targetPath, {
                    type: 'add',
                    category: this.currentCategory,
                    filename: finalFilename
                });
                
                uploaded++;
                
            } catch (error) {
                errors.push(`${file.name}: ${error.message}`);
                console.error('Upload error:', error);
            }
        }
        
        // Refresh images after upload
        await this.loadImages();
        this.updateChangesPreview();
        
        // Show results
        if (uploaded > 0) {
            this.showMessage(`✅ Uploaded ${uploaded} image(s) - Gallery refreshed`, 'success');
        }
        if (errors.length > 0) {
            const errorMsg = `⚠️ ${errors.length} error(s): ${errors.join(', ')}`;
            this.showMessage(errorMsg, 'warning');
        }
    }
    
    async loadImages() {
        if (!this.currentRepo) {
            console.log('No repository connected');
            return;
        }
        
        const categoryPath = this.imageCategories[this.currentCategory];
        const fullPath = path.join(this.currentRepo, categoryPath);
        const gallery = document.getElementById('image-gallery');
        
        if (!gallery) {
            console.error('Image gallery element not found');
            return;
        }
        
        try {
            try {
                await fs.access(fullPath);
            } catch {
                gallery.innerHTML = `
                    <div class="no-images">
                        <i class="fas fa-folder"></i>
                        <p>Category folder not created yet</p>
                        <p>Upload some images to get started</p>
                    </div>
                `;
                return;
            }
            
            const files = await fs.readdir(fullPath);
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
            );
            
            console.log(`Found ${imageFiles.length} images in ${this.currentCategory}`);
            
            if (imageFiles.length === 0) {
                gallery.innerHTML = `
                    <div class="no-images">
                        <i class="fas fa-image"></i>
                        <p>No images in this category</p>
                        <p>Upload some images to get started</p>
                    </div>
                `;
                return;
            }
            
            // Build gallery HTML
            gallery.innerHTML = imageFiles.map(file => {
                const imagePath = path.join(fullPath, file);
                return `
                    <div class="image-item">
                        <img src="file://${imagePath}" alt="${file}" loading="lazy">
                        <div class="image-actions">
                            <button onclick="adminPortal.viewImage('${file}')" title="View" class="image-action view">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="adminPortal.deleteImage('${file}')" title="Delete" class="image-action delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="image-info">
                            <p class="image-name">${file}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            console.log('Gallery updated successfully');
            
        } catch (error) {
            console.error('Error loading images:', error);
            gallery.innerHTML = `
                <div class="no-images">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading images</p>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
    
    async deleteImage(filename) {
        if (!confirm(`Delete ${filename}? This action cannot be undone.`)) {
            return;
        }
        
        const categoryPath = this.imageCategories[this.currentCategory];
        const filePath = path.join(this.currentRepo, categoryPath, filename);
        
        try {
            this.showMessage(`Deleting ${filename}...`, 'info');
            
            await fs.unlink(filePath);
            
            this.pendingChanges.set(filePath, {
                type: 'delete',
                category: this.currentCategory,
                filename: filename
            });
            
            await this.loadImages();
            this.updateChangesPreview();
            
            this.showMessage(`✅ Deleted ${filename} - Gallery refreshed`, 'success');
            
        } catch (error) {
            console.error('Delete error:', error);
            const errorMsg = `Error deleting ${filename}: ${error.message}`;
            this.showMessage(errorMsg, 'error');
        }
    }
    
async updateConfiguration() {
    if (!this.currentRepo) {
        this.showMessage('Please connect a repository first', 'error');
        return;
    }
    
    const email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let instagram = document.getElementById('instagram').value.trim();
    let facebook = document.getElementById('facebook').value.trim();
    
    if (!email && !phone && !instagram && !facebook) {
        this.showMessage('Please fill in at least one field', 'warning');
        return;
    }
    
    try {
        this.showMessage('Scanning repository for files...', 'info');
        
        // Format phone to standard: +1 (612) 208-9898
        if (phone) {
            const digits = phone.replace(/\D/g, '');
            if (digits.length === 10) {
                phone = `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            } else if (digits.length === 11 && digits[0] === '1') {
                phone = `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
            } else if (digits.length > 11) {
                const last10 = digits.slice(-10);
                phone = `+1 (${last10.slice(0, 3)}) ${last10.slice(3, 6)}-${last10.slice(6)}`;
            }
        }
        
        // Normalize Instagram URL
        if (instagram) {
            if (!instagram.match(/^https?:\/\//)) {
                instagram = 'https://' + instagram;
            }
            if (instagram.includes('instagr.am')) {
                instagram = instagram.replace('instagr.am', 'instagram.com');
            }
            if (!instagram.includes('instagram.com')) {
                const parts = instagram.split('/').filter(Boolean);
                const username = parts[parts.length - 1].replace(/^@/, '');
                instagram = `https://instagram.com/${username}`;
            }
            instagram = instagram.replace(/\/$/, '');
        }
        
        // Normalize Facebook URL
        if (facebook) {
            if (!facebook.match(/^https?:\/\//)) {
                facebook = 'https://' + facebook;
            }
            if (facebook.includes('fb.com')) {
                facebook = facebook.replace('fb.com', 'facebook.com');
            }
            if (!facebook.includes('facebook.com')) {
                const parts = facebook.split('/').filter(Boolean);
                const pagename = parts[parts.length - 1];
                facebook = `https://facebook.com/${pagename}`;
            }
            facebook = facebook.replace(/\/$/, '');
        }
        
        // For tel: links, use clean format: +16122089898
        const telPhone = phone ? phone.replace(/[\s\-\(\)]/g, '') : '';
        
        let updated = 0;
        const filesToScan = await this.getAllFiles(this.currentRepo);
        
        for (const file of filesToScan) {
            if (file.includes('node_modules') || file.includes('.git')) continue;
            if (!/\.(js|html|css|json|txt|md)$/i.test(file)) continue;
            
            try {
                let content = await fs.readFile(file, 'utf8');
                const originalContent = content;
                
                if (email) {
                    const emailRegex = /(?<![@\/\w])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![@\/\w])/g;
                    content = content.replace(emailRegex, email);
                }
                
                if (phone) {
                    // 1. Tel links - use clean format for dialing
                    content = content.replace(
                        /(href=["']tel:)([\+\d\s\-\(\)]+)(["'])/gi,
                        (match, prefix, oldPhone, suffix) => {
                            const digitCount = oldPhone.replace(/\D/g, '').length;
                            return digitCount >= 10 ? prefix + telPhone + suffix : match;
                        }
                    );
                    
                    // 2. Phone after icon - use formatted display
                    content = content.replace(
                        /(<i[^>]*fa-phone[^>]*><\/i>\s*)([\+\d][\d\s\-\(\)]{9,})/gi,
                        (match, prefix, oldPhone) => {
                            const digitCount = oldPhone.replace(/\D/g, '').length;
                            return digitCount >= 10 ? prefix + phone : match;
                        }
                    );
                    
                    // 3. Call/Phone/Tel labels - use formatted display
                    content = content.replace(
                        /((?:Call|Phone|Tel)(?:\s+Us)?[:\s]+)([\+\d][\d\s\-\(\)]{9,})(?=\s*<|$)/gi,
                        (match, prefix, oldPhone) => {
                            const digitCount = oldPhone.replace(/\D/g, '').length;
                            return digitCount >= 10 ? prefix + phone : match;
                        }
                    );
                    
                    // 4. Standalone phone numbers (Get In Touch sections) - use formatted display
                    content = content.replace(
                        /(?<![\w@])(\+\d{1,3}[\s\-]?(?:\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4})(?![\w@])/g,
                        (match, oldPhone) => {
                            const digitCount = oldPhone.replace(/\D/g, '').length;
                            return (digitCount >= 10 && digitCount <= 15) ? phone : match;
                        }
                    );
                    
                    // 5. Phone numbers with tag boundaries - use formatted display
                    content = content.replace(
                        /(?<=[\s>])(\+?\d{1,3}[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4})(?=[\s<])/g,
                        (match, oldPhone) => {
                            const digitCount = oldPhone.replace(/\D/g, '').length;
                            return (digitCount >= 10 && digitCount <= 15) ? phone : match;
                        }
                    );
                }
                
                if (instagram) {
                    const igRegex = /(?:https?:\/\/)?(?:www\.)?(instagram\.com|instagr\.am)\/[a-zA-Z0-9._-]+\/?/gi;
                    content = content.replace(igRegex, (match) => {
                        const cleanMatch = match.replace(/^https?:\/\//, '').replace(/^www\./, '');
                        const pathParts = cleanMatch.split('/').filter(Boolean);
                        if (pathParts.length === 2) {
                            return instagram;
                        }
                        return match;
                    });
                }
                
                if (facebook) {
                    const fbRegex = /(?:https?:\/\/)?(?:www\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9._-]+\/?/gi;
                    content = content.replace(fbRegex, (match) => {
                        const cleanMatch = match.replace(/^https?:\/\//, '').replace(/^www\./, '');
                        const pathParts = cleanMatch.split('/').filter(Boolean);
                        if (cleanMatch.includes('sharer.php') || 
                            cleanMatch.includes('/posts/') || 
                            cleanMatch.includes('/groups/') ||
                            cleanMatch.includes('/events/')) {
                            return match;
                        }
                        if (pathParts.length === 2) {
                            return facebook;
                        }
                        return match;
                    });
                }
                
                if (content !== originalContent) {
                    await fs.writeFile(file, content, 'utf8');
                    this.pendingChanges.set(file, {
                        type: 'update',
                        category: 'config',
                        filename: path.basename(file)
                    });
                    updated++;
                }
                
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        }
        
        this.updateChangesPreview();
        
        if (updated > 0) {
            this.showMessage(`✅ Updated ${updated} file(s) | Phone: ${phone || 'N/A'}`, 'success');
        } else {
            this.showMessage('No matching content found to update', 'info');
        }
        
    } catch (error) {
        console.error('Configuration update error:', error);
        const errorMsg = `Configuration update failed: ${error.message}`;
        this.showMessage(errorMsg, 'error');
    }
}
    
    async getAllFiles(dir, fileList = []) {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await this.getAllFiles(filePath, fileList);
            } else {
                fileList.push(filePath);
            }
        }
        
        return fileList;
    }
    
    async commitAndPush() {
        if (!this.git || !this.currentRepo) {
            this.showMessage('No repository connected', 'error');
            return;
        }
        
        let url, token;
        
        if (this.repoCredentials) {
            url = this.repoCredentials.url;
            token = this.repoCredentials.token;
        } else {
            url = document.getElementById('push-repo-url').value.trim();
            token = document.getElementById('push-token').value.trim();
            
            if (!url || !token) {
                this.showMessage('Please enter repository URL and token', 'error');
                return;
            }
        }
        
        try {
            const urlParts = url.replace('https://', '').replace('http://', '');
            const authenticatedUrl = `https://${token}@${urlParts}`;
            await this.git.remote(['set-url', 'origin', authenticatedUrl]);
            
            this.showMessage('Step 1/5: Checking remote status...', 'info');
            
            try {
                await this.git.fetch('origin', 'main');
                
                const status = await this.git.status();
                if (status.behind > 0) {
                    this.showMessage('Remote has new changes. Pulling first...', 'info');
                    try {
                        await this.git.pull('origin', 'main', {'--rebase': 'true'});
                        this.showMessage('✅ Pulled latest changes successfully', 'success');
                    } catch (pullError) {
                        if (pullError.message.includes('conflict')) {
                            this.showMessage('⚠️ Merge conflict detected. Please resolve manually and try again.', 'error');
                            return;
                        }
                        throw pullError;
                    }
                }
            } catch (fetchError) {
                console.warn('Fetch failed, continuing:', fetchError);
            }
            
            this.showMessage('Step 2/5: Staging changes...', 'info');
            await this.git.add('.');
            
            const statusAfterStaging = await this.git.status();
            
            if (statusAfterStaging.files.length === 0) {
                try {
                    const log = await this.git.log(['origin/main..HEAD']);
                    if (log.total > 0) {
                        this.showMessage(`Step 3/5: No new changes, but found ${log.total} unpushed commit(s)`, 'info');
                        this.showMessage('Step 4/5: Skipping commit...', 'info');
                        this.showMessage('Step 5/5: Pushing existing commits...', 'info');
                        
                        await this.git.push('origin', 'main');
                        this.showMessage('✅ Successfully pushed existing commits to GitHub!', 'success');
                        
                        this.pendingChanges.clear();
                        this.updateChangesPreview();
                        return;
                    } else {
                        this.showMessage('No changes to commit or push', 'info');
                        return;
                    }
                } catch (logError) {
                    this.showMessage('No changes to commit or push', 'info');
                    return;
                }
            }
            
            this.showMessage(`Step 3/5: Found ${statusAfterStaging.files.length} file(s) to commit`, 'info');
            this.showMessage('Step 4/5: Creating commit...', 'info');
            
            const commitMsg = `Admin Portal Update: ${this.pendingChanges.size || statusAfterStaging.files.length} change(s)`;
            await this.git.commit(commitMsg);
            
            this.showMessage('Step 5/5: Pushing to GitHub...', 'info');
            
            try {
                await this.git.push('origin', 'main');
            } catch (pushError) {
                if (pushError.message.includes('rejected') || pushError.message.includes('non-fast-forward')) {
                    this.showMessage('Remote updated during push. Pulling and retrying...', 'warning');
                    
                    try {
                        await this.git.pull('origin', 'main', {'--rebase': 'true'});
                        await this.git.push('origin', 'main');
                    } catch (retryError) {
                        throw retryError;
                    }
                } else {
                    throw pushError;
                }
            }
            
            this.pendingChanges.clear();
            this.updateChangesPreview();
            
            this.showMessage('✅ Successfully committed and pushed to GitHub!', 'success');
            
        } catch (error) {
            console.error('Commit/Push error:', error);
            
            let gitError = '';
            
            if (error.git) {
                gitError = (error.git.stdErr || '') + '\n' + (error.git.stdOut || '');
                gitError = gitError.trim();
            }
            
            if (!gitError) {
                gitError = error.message || 'Unknown error occurred';
            }
            
            const errorMessage = `Git Error:\n\n${gitError}`;
            
            this.showMessage(errorMessage, 'error');
        }
    }
    
    updateChangesPreview() {
        const changesList = document.getElementById('changes-list');
        const commitBtn = document.getElementById('commit-btn');
        
        if (this.pendingChanges.size === 0) {
            changesList.innerHTML = `
                <div class="no-changes">
                    <i class="fas fa-info-circle"></i>
                    <p>No pending changes</p>
                </div>
            `;
            if (commitBtn) commitBtn.disabled = true;
            return;
        }
        
        const changes = Array.from(this.pendingChanges.values());
        const grouped = {};
        
        changes.forEach(change => {
            if (!grouped[change.type]) {
                grouped[change.type] = [];
            }
            grouped[change.type].push(change);
        });
        
        let html = '<div class="changes-summary">';
        
        if (grouped.add) {
            html += `<h4>✅ Added (${grouped.add.length})</h4><ul>`;
            grouped.add.forEach(c => {
                html += `<li>${c.category}: ${c.filename}</li>`;
            });
            html += '</ul>';
        }
        
        if (grouped.delete) {
            html += `<h4>❌ Deleted (${grouped.delete.length})</h4><ul>`;
            grouped.delete.forEach(c => {
                html += `<li>${c.category}: ${c.filename}</li>`;
            });
            html += '</ul>';
        }
        
        if (grouped.update) {
            html += `<h4>📝 Updated (${grouped.update.length})</h4><ul>`;
            grouped.update.forEach(c => {
                html += `<li>${c.category}: ${c.filename}</li>`;
            });
            html += '</ul>';
        }
        
        html += '</div>';
        changesList.innerHTML = html;
        
        if (commitBtn) commitBtn.disabled = false;
    }
    
    updateRepositoryStatus(connected, repoName = '') {
        const statusEl = document.getElementById('repo-status');
        const repoInfo = document.getElementById('repo-info');
        
        if (connected) {
            statusEl.innerHTML = `
                <span class="status-dot online"></span>
                <span>Connected: ${repoName}</span>
            `;
            repoInfo.innerHTML = `
                <p><strong>Repository:</strong> ${repoName}</p>
                <p><strong>Path:</strong> ${this.currentRepo}</p>
                <p><strong>Status:</strong> Ready for operations</p>
            `;
        } else {
            statusEl.innerHTML = `
                <span class="status-dot offline"></span>
                <span>No repository loaded</span>
            `;
            repoInfo.innerHTML = `<p>No repository loaded</p>`;
        }
    }
    
    showMessage(message, type = 'info') {
        if (type === 'error') {
            this.errorLog.push({
                timestamp: new Date().toISOString(),
                message: message
            });
            
            if (this.errorLog.length > 100) {
                this.errorLog.shift();
            }
            
            this.updateErrorBadge();
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '10000';
        messageEl.style.minWidth = '300px';
        messageEl.style.maxWidth = '500px';
        messageEl.style.padding = '15px 20px';
        messageEl.style.borderRadius = '8px';
        messageEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        messageEl.style.animation = 'slideInRight 0.3s ease-out';
        messageEl.style.wordWrap = 'break-word';
        
        if (type === 'success') {
            messageEl.style.background = '#10b981';
            messageEl.style.color = 'white';
        } else if (type === 'error') {
            messageEl.style.background = '#ef4444';
            messageEl.style.color = 'white';
        } else if (type === 'warning') {
            messageEl.style.background = '#f59e0b';
            messageEl.style.color = 'white';
        } else {
            messageEl.style.background = '#3b82f6';
            messageEl.style.color = 'white';
        }
        
        document.body.appendChild(messageEl);
        
        const duration = type === 'error' ? 8000 : 5000;
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }, duration);
        
        console.log(`[${type.toUpperCase()}]`, message);
    }
    
    updateErrorBadge() {
        const badge = document.getElementById('error-badge');
        if (badge && this.errorLog.length > 0) {
            badge.textContent = this.errorLog.length;
            badge.style.display = 'inline-block';
        } else if (badge) {
            badge.style.display = 'none';
        }
    }
    
    showErrorLog() {
        const modal = document.getElementById('error-log-modal');
        const logContent = document.getElementById('error-log-content');
        
        if (!modal || !logContent) return;
        
        if (this.errorLog.length === 0) {
            logContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>No errors logged yet</p>
                </div>
            `;
        } else {
            logContent.innerHTML = this.errorLog.map((log, index) => `
                <div class="error-log-entry">
                    <div class="log-header">
                        <strong>Error #${this.errorLog.length - index}</strong>
                        <span class="log-time">${new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="log-message">${log.message}</div>
                </div>
            `).reverse().join('');
        }
        
        modal.style.display = 'flex';
    }
    
    clearErrorLog() {
        if (confirm('Clear all error logs?')) {
            this.errorLog = [];
            this.updateErrorBadge();
            const modal = document.getElementById('error-log-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            this.showMessage('Error log cleared', 'success');
        }
    }
    
    viewImage(filename) {
        const categoryPath = this.imageCategories[this.currentCategory];
        const filePath = path.join(this.currentRepo, categoryPath, filename);
        
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalPath = document.getElementById('modal-path');
        
        modalImage.src = `file://${filePath}`;
        modalTitle.textContent = filename;
        modalPath.textContent = categoryPath;
        modal.style.display = 'flex';
    }
}

// Global functions
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    const section = document.getElementById(`${sectionName}-section`);
    if (section) section.classList.add('active');
    
    const tab = Array.from(document.querySelectorAll('.nav-tab'))
        .find(t => t.onclick && t.onclick.toString().includes(sectionName));
    if (tab) tab.classList.add('active');
}

// BUG FIX #2: Added missing event parameter
function showImageCategory(category, event) {
    document.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
    
    // BUG FIX #3: Check if event and event.target exist before accessing
    if (event && event.target) {
        const targetTab = event.target.closest('.image-tab');
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }
    
    adminPortal.currentCategory = category;
    
    const categoryNames = {
        logo: 'Logo Images',
        wedding: 'Wedding Portfolio',
        birthday: 'Birthday Portfolio',
        babyshower: 'Baby Shower Portfolio',
        retirement: 'Retirement Portfolio',
        corporate: 'Corporate Portfolio',
        rentals: 'Rentals Portfolio',
        about: 'About Images',
        services: 'General Services',
        'services-wedding': 'Wedding Services',
        'services-birthday': 'Birthday Services',
        'services-babyshower': 'Baby Shower Services',
        'services-corporate': 'Corporate Services',
        'services-retirement': 'Retirement Services',
        'services-rentals': 'Rental Services',
        hero: 'Hero Images',
        backgrounds: 'Backgrounds',
        icons: 'Icons',
        gallery: 'Gallery'
    };
    
    const categoryTitle = document.getElementById('current-category');
    const categoryPathEl = document.getElementById('category-path');
    
    if (categoryTitle) {
        categoryTitle.textContent = categoryNames[category] || category;
    }
    
    if (categoryPathEl) {
        categoryPathEl.textContent = adminPortal.imageCategories[category];
    }
    
    adminPortal.loadImages();
}

function refreshImages() {
    adminPortal.showMessage('Refreshing gallery...', 'info');
    adminPortal.loadImages();
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize
let adminPortal;
document.addEventListener('DOMContentLoaded', () => {
    adminPortal = new AdminPortal();
    console.log('Admin Portal ready');
});