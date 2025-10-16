/**
 * Repository Manager - Auto-Versioned Clone & History Management
 * To be placed in: admin-portal/admin/js/repo-manager.js
 */

class RepositoryManager {
    constructor(adminPortal) {
        this.portal = adminPortal;
        this.fs = require('fs').promises;
        this.fsSync = require('fs');
        this.path = require('path');
        this.simpleGit = require('simple-git');
        
        // Configuration
        this.config = {
            targetDir: 'target-websites',
            historyFile: 'clone-history.json',
            versioningStrategy: 'timestamp',
            maxHistoryEntries: 100
        };
        
        // Clone history
        this.cloneHistory = [];
        this.loadHistory();
    }
    
    /**
     * Generate versioned folder name
     */
    async generateVersionedName(repoUrl, strategy = null) {
        strategy = strategy || this.config.versioningStrategy;
        
        // Extract repository name from URL
        let repoName = repoUrl.split('/').pop().replace(/\.git$/, '');
        repoName = repoName.toLowerCase().replace(/[^a-z0-9\-_]/g, '-');
        
        let versionedName;
        
        switch (strategy) {
            case 'timestamp':
                const timestamp = new Date().toISOString()
                    .replace(/[:\-]/g, '')
                    .replace(/\..+/, '')
                    .replace('T', '_');
                versionedName = `${repoName}_${timestamp}`;
                break;
                
            case 'semantic':
                const version = this.getNextSemanticVersion(repoName);
                versionedName = `${repoName}_v${version}`;
                break;
                
            case 'incremental':
                const counter = this.getNextCounter(repoName);
                versionedName = `${repoName}_${String(counter).padStart(3, '0')}`;
                break;
                
            case 'date':
                const date = new Date().toISOString().split('T')[0];
                versionedName = `${repoName}_${date}`;
                break;
                
            default:
                // Fallback to timestamp
                versionedName = `${repoName}_${Date.now()}`;
        }
        
        // Ensure uniqueness
        return await this.ensureUniqueName(versionedName);
    }
    
    /**
     * Get next semantic version for a repository
     */
    getNextSemanticVersion(repoName) {
        const existingVersions = this.cloneHistory
            .filter(entry => entry.repoName === repoName)
            .map(entry => entry.version)
            .filter(v => v)
            .sort((a, b) => {
                const aParts = a.split('.').map(Number);
                const bParts = b.split('.').map(Number);
                for (let i = 0; i < 3; i++) {
                    if (aParts[i] !== bParts[i]) {
                        return aParts[i] - bParts[i];
                    }
                }
                return 0;
            });
        
        if (existingVersions.length === 0) {
            return '1.0.0';
        }
        
        // Increment patch version
        const lastVersion = existingVersions[existingVersions.length - 1];
        const parts = lastVersion.split('.').map(Number);
        parts[2]++; // Increment patch
        
        return parts.join('.');
    }
    
    /**
     * Get next counter for incremental naming
     */
    getNextCounter(repoName) {
        const existingCounters = this.cloneHistory
            .filter(entry => entry.repoName === repoName)
            .map(entry => entry.counter)
            .filter(c => c !== undefined)
            .sort((a, b) => a - b);
        
        if (existingCounters.length === 0) {
            return 1;
        }
        
        return existingCounters[existingCounters.length - 1] + 1;
    }
    
    /**
     * Ensure the generated name is unique
     */
    async ensureUniqueName(baseName) {
        const targetPath = this.path.join(process.cwd(), this.config.targetDir);
        let finalName = baseName;
        let counter = 1;
        
        try {
            await this.fs.mkdir(targetPath, { recursive: true });
            
            while (await this.fileExists(this.path.join(targetPath, finalName))) {
                finalName = `${baseName}_${counter}`;
                counter++;
            }
        } catch (error) {
            this.portal.log('warn', 'Error checking for unique name', error);
        }
        
        return finalName;
    }
    
    /**
     * Clone repository with auto-versioning
     */
    async cloneRepository(repoUrl, token, options = {}) {
        try {
            // Validate inputs
            if (!repoUrl) {
                throw new Error('Repository URL is required');
            }
            if (!token) {
                throw new Error('GitHub token is required');
            }
            
            // Generate versioned folder name
            const folderName = await this.generateVersionedName(
                repoUrl, 
                options.versioningStrategy
            );
            
            const targetPath = this.path.join(
                process.cwd(), 
                this.config.targetDir, 
                folderName
            );
            
            // Check if already exists (shouldn't happen with auto-versioning)
            if (await this.fileExists(targetPath)) {
                throw new Error(`Path already exists: ${targetPath}`);
            }
            
            this.portal.log('info', 'Starting repository clone', { 
                url: repoUrl, 
                path: folderName 
            });
            
            // Build authenticated URL
            const authenticatedUrl = this.buildAuthenticatedUrl(repoUrl, token);
            
            // Clone with progress tracking
            const git = this.simpleGit();
            
            await git.clone(authenticatedUrl, targetPath, [
                '--progress',
                '--verbose'
            ]);
            
            // Configure git in cloned repo
            const repoGit = this.simpleGit(targetPath);
            await repoGit.addConfig('user.name', options.userName || 'AA Admin Portal');
            await repoGit.addConfig('user.email', options.userEmail || 'admin@aaeventdecor.com');
            
            // Get repository info
            const repoInfo = await this.getRepositoryInfo(targetPath, repoUrl);
            
            // Add to clone history
            const historyEntry = {
                id: Date.now().toString(),
                repoUrl: repoUrl,
                repoName: this.extractRepoName(repoUrl),
                folderName: folderName,
                localPath: targetPath,
                clonedAt: new Date().toISOString(),
                version: options.versioningStrategy === 'semantic' 
                    ? this.getNextSemanticVersion(this.extractRepoName(repoUrl))
                    : null,
                counter: options.versioningStrategy === 'incremental'
                    ? this.getNextCounter(this.extractRepoName(repoUrl))
                    : null,
                branch: repoInfo.branch,
                commit: repoInfo.lastCommit,
                size: await this.getDirectorySize(targetPath)
            };
            
            this.cloneHistory.unshift(historyEntry);
            await this.saveHistory();
            
            this.portal.log('info', 'Repository cloned successfully', historyEntry);
            
            return {
                success: true,
                folderName: folderName,
                localPath: targetPath,
                historyEntry: historyEntry
            };
            
        } catch (error) {
            this.portal.log('error', 'Repository clone failed', error);
            throw error;
        }
    }
    
    /**
     * Build authenticated GitHub URL
     */
    buildAuthenticatedUrl(repoUrl, token) {
        // Handle various URL formats
        let cleanUrl = repoUrl.trim();
        
        // Remove protocol if present
        cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
        
        // Remove github.com if at the beginning
        cleanUrl = cleanUrl.replace(/^github\.com\//, '');
        
        // Remove .git suffix
        cleanUrl = cleanUrl.replace(/\.git$/, '');
        
        // Build authenticated URL
        return `https://${token}@github.com/${cleanUrl}.git`;
    }
    
    /**
     * Extract repository name from URL
     */
    extractRepoName(repoUrl) {
        return repoUrl.split('/').pop().replace(/\.git$/, '');
    }
    
    /**
     * Get repository information
     */
    async getRepositoryInfo(repoPath, repoUrl) {
        try {
            const git = this.simpleGit(repoPath);
            
            const branch = await git.branch();
            const log = await git.log(['-1']);
            const remotes = await git.getRemotes(true);
            
            return {
                branch: branch.current,
                lastCommit: log.latest ? log.latest.hash : null,
                remotes: remotes,
                url: repoUrl
            };
        } catch (error) {
            this.portal.log('warn', 'Could not get repository info', error);
            return {
                branch: 'main',
                lastCommit: null,
                remotes: [],
                url: repoUrl
            };
        }
    }
    
    /**
     * Get directory size
     */
    async getDirectorySize(dirPath) {
        let totalSize = 0;
        
        const calculateSize = async (path) => {
            try {
                const stats = await this.fs.stat(path);
                
                if (stats.isFile()) {
                    totalSize += stats.size;
                } else if (stats.isDirectory()) {
                    const items = await this.fs.readdir(path);
                    for (const item of items) {
                        if (item !== '.git') { // Skip .git directory
                            await calculateSize(this.path.join(path, item));
                        }
                    }
                }
            } catch (error) {
                // Skip files that can't be accessed
            }
        };
        
        await calculateSize(dirPath);
        return totalSize;
    }
    
    /**
     * Load clone history from file
     */
    async loadHistory() {
        try {
            const historyPath = this.path.join(
                process.cwd(), 
                this.config.targetDir,
                this.config.historyFile
            );
            
            if (await this.fileExists(historyPath)) {
                const data = await this.fs.readFile(historyPath, 'utf8');
                this.cloneHistory = JSON.parse(data);
                this.portal.log('info', `Loaded ${this.cloneHistory.length} history entries`);
            }
        } catch (error) {
            this.portal.log('warn', 'Could not load clone history', error);
            this.cloneHistory = [];
        }
    }
    
    /**
     * Save clone history to file
     */
    async saveHistory() {
        try {
            const historyPath = this.path.join(
                process.cwd(), 
                this.config.targetDir,
                this.config.historyFile
            );
            
            // Ensure directory exists
            await this.fs.mkdir(this.path.dirname(historyPath), { recursive: true });
            
            // Limit history entries
            if (this.cloneHistory.length > this.config.maxHistoryEntries) {
                this.cloneHistory = this.cloneHistory.slice(0, this.config.maxHistoryEntries);
            }
            
            await this.fs.writeFile(
                historyPath, 
                JSON.stringify(this.cloneHistory, null, 2),
                'utf8'
            );
            
            this.portal.log('info', 'Clone history saved');
        } catch (error) {
            this.portal.log('error', 'Failed to save clone history', error);
        }
    }
    
    /**
     * Get clone history
     */
    getHistory(limit = 20) {
        return this.cloneHistory.slice(0, limit);
    }
    
    /**
     * Get all repositories grouped by name
     */
    getGroupedHistory() {
        const grouped = {};
        
        this.cloneHistory.forEach(entry => {
            if (!grouped[entry.repoName]) {
                grouped[entry.repoName] = [];
            }
            grouped[entry.repoName].push(entry);
        });
        
        return grouped;
    }
    
    /**
     * Search clone history
     */
    searchHistory(query) {
        const lowerQuery = query.toLowerCase();
        return this.cloneHistory.filter(entry => 
            entry.repoName.toLowerCase().includes(lowerQuery) ||
            entry.folderName.toLowerCase().includes(lowerQuery) ||
            entry.repoUrl.toLowerCase().includes(lowerQuery)
        );
    }
    
    /**
     * Open existing repository
     */
    async openRepository(historyId) {
        const entry = this.cloneHistory.find(e => e.id === historyId);
        
        if (!entry) {
            throw new Error('Repository not found in history');
        }
        
        if (!await this.fileExists(entry.localPath)) {
            throw new Error('Repository folder no longer exists');
        }
        
        // Update last accessed time
        entry.lastAccessed = new Date().toISOString();
        await this.saveHistory();
        
        return entry;
    }
    
    /**
     * Delete repository and remove from history
     */
    async deleteRepository(historyId) {
        const entry = this.cloneHistory.find(e => e.id === historyId);
        
        if (!entry) {
            throw new Error('Repository not found in history');
        }
        
        // Delete folder
        if (await this.fileExists(entry.localPath)) {
            await this.fs.rm(entry.localPath, { recursive: true, force: true });
        }
        
        // Remove from history
        this.cloneHistory = this.cloneHistory.filter(e => e.id !== historyId);
        await this.saveHistory();
        
        this.portal.log('info', 'Repository deleted', { id: historyId });
        
        return true;
    }
    
    /**
     * Clean up old repositories
     */
    async cleanupOldRepositories(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const toDelete = this.cloneHistory.filter(entry => {
            const clonedDate = new Date(entry.clonedAt);
            return clonedDate < cutoffDate;
        });
        
        let deletedCount = 0;
        for (const entry of toDelete) {
            try {
                await this.deleteRepository(entry.id);
                deletedCount++;
            } catch (error) {
                this.portal.log('warn', `Failed to delete repository: ${entry.folderName}`, error);
            }
        }
        
        this.portal.log('info', `Cleaned up ${deletedCount} old repositories`);
        return deletedCount;
    }
    
    /**
     * Get statistics about cloned repositories
     */
    getStatistics() {
        const stats = {
            totalClones: this.cloneHistory.length,
            totalSize: 0,
            repositories: {},
            oldestClone: null,
            newestClone: null
        };
        
        this.cloneHistory.forEach(entry => {
            // Total size
            stats.totalSize += entry.size || 0;
            
            // Per-repository stats
            if (!stats.repositories[entry.repoName]) {
                stats.repositories[entry.repoName] = {
                    count: 0,
                    totalSize: 0,
                    lastCloned: null
                };
            }
            stats.repositories[entry.repoName].count++;
            stats.repositories[entry.repoName].totalSize += entry.size || 0;
            
            const clonedDate = new Date(entry.clonedAt);
            if (!stats.repositories[entry.repoName].lastCloned || 
                clonedDate > new Date(stats.repositories[entry.repoName].lastCloned)) {
                stats.repositories[entry.repoName].lastCloned = entry.clonedAt;
            }
            
            // Oldest and newest
            if (!stats.oldestClone || clonedDate < new Date(stats.oldestClone)) {
                stats.oldestClone = entry.clonedAt;
            }
            if (!stats.newestClone || clonedDate > new Date(stats.newestClone)) {
                stats.newestClone = entry.clonedAt;
            }
        });
        
        return stats;
    }
    
    /**
     * Export history to JSON
     */
    async exportHistory(filePath) {
        try {
            const exportData = {
                exportedAt: new Date().toISOString(),
                version: '1.0',
                statistics: this.getStatistics(),
                history: this.cloneHistory
            };
            
            await this.fs.writeFile(
                filePath,
                JSON.stringify(exportData, null, 2),
                'utf8'
            );
            
            this.portal.log('info', `History exported to: ${filePath}`);
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to export history', error);
            throw error;
        }
    }
    
    /**
     * Import history from JSON
     */
    async importHistory(filePath) {
        try {
            const data = await this.fs.readFile(filePath, 'utf8');
            const importData = JSON.parse(data);
            
            if (!importData.history || !Array.isArray(importData.history)) {
                throw new Error('Invalid history file format');
            }
            
            // Merge with existing history, avoiding duplicates
            const existingIds = new Set(this.cloneHistory.map(e => e.id));
            
            importData.history.forEach(entry => {
                if (!existingIds.has(entry.id)) {
                    this.cloneHistory.push(entry);
                }
            });
            
            await this.saveHistory();
            
            this.portal.log('info', `History imported from: ${filePath}`);
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to import history', error);
            throw error;
        }
    }
    
    /**
     * Verify repository integrity
     */
    async verifyRepository(historyId) {
        const entry = this.cloneHistory.find(e => e.id === historyId);
        
        if (!entry) {
            throw new Error('Repository not found in history');
        }
        
        const checks = {
            exists: await this.fileExists(entry.localPath),
            isGitRepo: false,
            hasRemote: false,
            branch: null,
            lastCommit: null
        };
        
        if (checks.exists) {
            try {
                const git = this.simpleGit(entry.localPath);
                
                // Check if it's a git repository
                await git.checkIsRepo();
                checks.isGitRepo = true;
                
                // Get current branch
                const branch = await git.branch();
                checks.branch = branch.current;
                
                // Check remotes
                const remotes = await git.getRemotes();
                checks.hasRemote = remotes.length > 0;
                
                // Get last commit
                const log = await git.log(['-1']);
                checks.lastCommit = log.latest ? log.latest.hash : null;
                
            } catch (error) {
                this.portal.log('warn', 'Repository verification failed', error);
            }
        }
        
        return checks;
    }
    
    /**
     * Update repository information
     */
    async updateRepositoryInfo(historyId) {
        const entry = this.cloneHistory.find(e => e.id === historyId);
        
        if (!entry) {
            throw new Error('Repository not found in history');
        }
        
        if (!await this.fileExists(entry.localPath)) {
            throw new Error('Repository folder no longer exists');
        }
        
        // Update repository info
        const repoInfo = await this.getRepositoryInfo(entry.localPath, entry.repoUrl);
        entry.branch = repoInfo.branch;
        entry.commit = repoInfo.lastCommit;
        entry.size = await this.getDirectorySize(entry.localPath);
        entry.lastUpdated = new Date().toISOString();
        
        await this.saveHistory();
        
        return entry;
    }
    
    /**
     * Check if file/directory exists
     */
    async fileExists(path) {
        try {
            await this.fs.access(path);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Set versioning strategy
     */
    setVersioningStrategy(strategy) {
        const validStrategies = ['timestamp', 'semantic', 'incremental', 'date'];
        if (validStrategies.includes(strategy)) {
            this.config.versioningStrategy = strategy;
            this.portal.log('info', `Versioning strategy set to: ${strategy}`);
        } else {
            throw new Error(`Invalid strategy. Must be one of: ${validStrategies.join(', ')}`);
        }
    }
    
    /**
     * Get current versioning strategy
     */
    getVersioningStrategy() {
        return this.config.versioningStrategy;
    }
    
    /**
     * Format size in human-readable format
     */
    formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Export for use in admin.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RepositoryManager;
}