/**
 * Contact Validator Module - Dynamic Contact Info Scanner & Validator
 * To be placed in: admin-portal/admin/js/contact-validator.js
 */

class ContactValidator {
    constructor(adminPortal) {
        this.portal = adminPortal;
        this.fs = require('fs').promises;
        this.path = require('path');
        
        // Validation patterns
        this.patterns = {
            email: {
                regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address (e.g., example@domain.com)'
            },
            phone: {
                regex: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
                message: 'Please enter a valid phone number (e.g., +1 (612) 208-9898)'
            },
            instagram: {
                regex: /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/([\w\.\-]+)\/?$/,
                message: 'Please enter a valid Instagram URL (e.g., https://instagram.com/username)'
            },
            facebook: {
                regex: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/([\w\.\-]+)\/?$/,
                message: 'Please enter a valid Facebook URL (e.g., https://facebook.com/pagename)'
            }
        };
        
        // File patterns to search for contact info
        this.searchPatterns = {
            email: /[\w\.\-]+@[\w\.\-]+\.\w+/g,
            phone: /(\+?1?\s?)?(\(?\d{3}\)?[\s\-\.]?)?\d{3}[\s\-\.]?\d{4}/g,
            instagram: /(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/[\w\.\-\/\?=&]+/gi,
            facebook: /(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[\w\.\-\/\?=&]+/gi
        };
        
        // Current contact info
        this.currentInfo = {
            email: '',
            phone: '',
            instagram: '',
            facebook: ''
        };
        
        // Validation state
        this.validationState = {
            email: { valid: true, message: '' },
            phone: { valid: true, message: '' },
            instagram: { valid: true, message: '' },
            facebook: { valid: true, message: '' }
        };
        
        // Files where contact info was found
        this.contactLocations = new Map();
        
        // Real-time validation listeners
        this.validationListeners = new Set();
    }
    
    /**
     * Validate single contact field
     */
    validateField(field, value) {
        if (!value || value.trim() === '') {
            return { valid: true, message: '' };
        }
        
        const pattern = this.patterns[field];
        if (!pattern) {
            return { valid: false, message: 'Unknown field type' };
        }
        
        const isValid = pattern.regex.test(value);
        return {
            valid: isValid,
            message: isValid ? '' : pattern.message
        };
    }
    
    /**
     * Validate all contact fields
     */
    validateAll(contactInfo) {
        const results = {};
        
        for (const field in contactInfo) {
            if (this.patterns[field]) {
                results[field] = this.validateField(field, contactInfo[field]);
            }
        }
        
        this.validationState = results;
        this.notifyListeners(results);
        
        return results;
    }
    
    /**
     * Format phone number to standard format
     */
    formatPhone(phone) {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Format based on length
        if (cleaned.length === 10) {
            // US number without country code
            return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        } else if (cleaned.length === 11 && cleaned[0] === '1') {
            // US number with country code
            return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        }
        
        // Return original if not standard US format
        return phone;
    }
    
    /**
     * Normalize social media URLs
     */
    normalizeSocialUrl(url, platform) {
        if (!url) return '';
        
        // Remove trailing slashes
        url = url.replace(/\/+$/, '');
        
        // Ensure https://
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        
        // Ensure correct domain
        if (platform === 'instagram' && !url.includes('instagram.com')) {
            const username = url.split('/').pop();
            url = `https://instagram.com/${username}`;
        } else if (platform === 'facebook' && !url.includes('facebook.com')) {
            const pagename = url.split('/').pop();
            url = `https://facebook.com/${pagename}`;
        }
        
        return url;
    }
    
    /**
     * Scan repository for existing contact information
     */
    async scanRepository(repoPath) {
        try {
            this.portal.log('info', 'Starting contact info scan', { path: repoPath });
            
            this.contactLocations.clear();
            const foundInfo = {
                email: new Set(),
                phone: new Set(),
                instagram: new Set(),
                facebook: new Set()
            };
            
            const files = await this.findScanableFiles(repoPath);
            
            for (const file of files) {
                const content = await this.fs.readFile(file, 'utf8');
                
                // Search for each type of contact info
                for (const [type, pattern] of Object.entries(this.searchPatterns)) {
                    const matches = content.match(pattern);
                    if (matches) {
                        matches.forEach(match => {
                            foundInfo[type].add(match);
                            
                            // Track location
                            if (!this.contactLocations.has(type)) {
                                this.contactLocations.set(type, []);
                            }
                            this.contactLocations.get(type).push({
                                file: this.path.relative(repoPath, file),
                                value: match
                            });
                        });
                    }
                }
            }
            
            // Convert sets to arrays and find most common values
            const results = {};
            for (const [type, values] of Object.entries(foundInfo)) {
                if (values.size > 0) {
                    // Get most frequent value
                    const valueArray = Array.from(values);
                    const frequency = {};
                    valueArray.forEach(v => {
                        frequency[v] = (frequency[v] || 0) + 1;
                    });
                    
                    const mostCommon = Object.entries(frequency)
                        .sort((a, b) => b[1] - a[1])[0][0];
                    
                    results[type] = mostCommon;
                    this.currentInfo[type] = mostCommon;
                }
            }
            
            this.portal.log('info', 'Contact scan complete', results);
            return {
                found: results,
                locations: Object.fromEntries(this.contactLocations),
                fileCount: files.length
            };
            
        } catch (error) {
            this.portal.log('error', 'Contact scan failed', error);
            throw error;
        }
    }
    
    /**
     * Find files to scan for contact info
     */
    async findScanableFiles(repoPath) {
        const scanableExtensions = ['.html', '.js', '.json', '.css', '.md', '.txt', '.xml'];
        const excludePaths = ['node_modules', '.git', 'admin-portal', 'target-websites', 'dist', 'build'];
        const files = [];
        
        const scanDirectory = async (dir) => {
            try {
                const items = await this.fs.readdir(dir, { withFileTypes: true });
                
                for (const item of items) {
                    const itemPath = this.path.join(dir, item.name);
                    const relativePath = this.path.relative(repoPath, itemPath);
                    
                    // Skip excluded paths
                    if (excludePaths.some(exclude => relativePath.includes(exclude))) {
                        continue;
                    }
                    
                    if (item.isDirectory()) {
                        await scanDirectory(itemPath);
                    } else if (scanableExtensions.includes(this.path.extname(item.name).toLowerCase())) {
                        files.push(itemPath);
                    }
                }
            } catch (error) {
                this.portal.log('warn', `Cannot scan directory: ${dir}`, error);
            }
        };
        
        await scanDirectory(repoPath);
        return files;
    }
    
    /**
     * Update contact information across all files
     */
    async updateContactInfo(repoPath, newInfo, options = {}) {
        try {
            const updatedFiles = [];
            const files = await this.findScanableFiles(repoPath);
            
            // Validate new info first
            const validation = this.validateAll(newInfo);
            const hasErrors = Object.values(validation).some(v => !v.valid);
            
            if (hasErrors && !options.force) {
                throw new Error('Validation failed. Use force option to override.');
            }
            
            // Format values
            if (newInfo.phone) {
                newInfo.phone = this.formatPhone(newInfo.phone);
            }
            if (newInfo.instagram) {
                newInfo.instagram = this.normalizeSocialUrl(newInfo.instagram, 'instagram');
            }
            if (newInfo.facebook) {
                newInfo.facebook = this.normalizeSocialUrl(newInfo.facebook, 'facebook');
            }
            
            for (const file of files) {
                let content = await this.fs.readFile(file, 'utf8');
                let modified = false;
                
                // Replace each type of contact info
                if (newInfo.email && this.currentInfo.email) {
                    const newContent = content.replace(this.searchPatterns.email, (match) => {
                        // Only replace if it matches our current known email
                        if (match === this.currentInfo.email) {
                            modified = true;
                            return newInfo.email;
                        }
                        return match;
                    });
                    content = newContent;
                }
                
                if (newInfo.phone && this.currentInfo.phone) {
                    const newContent = content.replace(this.searchPatterns.phone, (match) => {
                        // Normalize for comparison
                        const normalizedMatch = match.replace(/\D/g, '');
                        const normalizedCurrent = this.currentInfo.phone.replace(/\D/g, '');
                        if (normalizedMatch === normalizedCurrent) {
                            modified = true;
                            return newInfo.phone;
                        }
                        return match;
                    });
                    content = newContent;
                }
                
                if (newInfo.instagram && this.currentInfo.instagram) {
                    const newContent = content.replace(this.searchPatterns.instagram, (match) => {
                        if (match.includes(this.currentInfo.instagram.split('/').pop())) {
                            modified = true;
                            return newInfo.instagram;
                        }
                        return match;
                    });
                    content = newContent;
                }
                
                if (newInfo.facebook && this.currentInfo.facebook) {
                    const newContent = content.replace(this.searchPatterns.facebook, (match) => {
                        if (match.includes(this.currentInfo.facebook.split('/').pop())) {
                            modified = true;
                            return newInfo.facebook;
                        }
                        return match;
                    });
                    content = newContent;
                }
                
                // Write back if modified
                if (modified) {
                    await this.fs.writeFile(file, content, 'utf8');
                    updatedFiles.push(this.path.relative(repoPath, file));
                }
            }
            
            // Update current info
            Object.assign(this.currentInfo, newInfo);
            
            this.portal.log('info', `Updated contact info in ${updatedFiles.length} files`);
            return {
                success: true,
                updatedFiles: updatedFiles,
                validation: validation
            };
            
        } catch (error) {
            this.portal.log('error', 'Failed to update contact info', error);
            throw error;
        }
    }
    
    /**
     * Add validation listener for real-time feedback
     */
    addValidationListener(callback) {
        this.validationListeners.add(callback);
    }
    
    /**
     * Remove validation listener
     */
    removeValidationListener(callback) {
        this.validationListeners.delete(callback);
    }
    
    /**
     * Notify all listeners of validation changes
     */
    notifyListeners(validationState) {
        this.validationListeners.forEach(listener => {
            try {
                listener(validationState);
            } catch (error) {
                this.portal.log('warn', 'Validation listener error', error);
            }
        });
    }
    
    /**
     * Get contact info summary
     */
    getSummary() {
        return {
            current: this.currentInfo,
            validation: this.validationState,
            locations: Object.fromEntries(this.contactLocations)
        };
    }
}

// Export for use in admin.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactValidator;
}