/**
 * Git Module - Standalone Git Operations Manager
 * To be placed in: admin-portal/admin/js/git-module.js
 */

class GitModule {
    constructor(adminPortal) {
        this.portal = adminPortal;
        this.simpleGit = require('simple-git');
        this.git = null;
        this.repoPath = null;
        
        // Git state
        this.status = {
            branch: 'main',
            tracking: null,
            ahead: 0,
            behind: 0,
            modified: [],
            staged: [],
            untracked: [],
            deleted: [],
            created: []
        };
        
        this.stagedFiles = new Set();
        this.commitHistory = [];
    }
    
    /**
     * Initialize Git module with repository path
     */
    async initialize(repoPath) {
        try {
            this.repoPath = repoPath;
            this.git = this.simpleGit(repoPath);
            await this.refreshStatus();
            this.portal.log('info', 'Git module initialized', { path: repoPath });
            return true;
        } catch (error) {
            this.portal.log('error', 'Git module initialization failed', error);
            throw error;
        }
    }
    
    /**
     * Get comprehensive Git status
     */
    async refreshStatus() {
        try {
            const status = await this.git.status();
            const branch = await this.git.branch();
            
            // Get ahead/behind info
            let ahead = 0, behind = 0;
            if (branch.current && status.tracking) {
                try {
                    const log = await this.git.log([`${status.tracking}..HEAD`]);
                    ahead = log.total;
                    const remotelog = await this.git.log([`HEAD..${status.tracking}`]);
                    behind = remotelog.total;
                } catch (e) {
                    // Remote might not exist yet
                }
            }
            
            this.status = {
                branch: branch.current || 'main',
                tracking: status.tracking || null,
                ahead: ahead,
                behind: behind,
                modified: status.modified || [],
                staged: status.staged || [],
                untracked: status.not_added || [],
                deleted: status.deleted || [],
                created: status.created || [],
                conflicted: status.conflicted || [],
                renamed: status.renamed || []
            };
            
            this.portal.log('info', 'Git status refreshed', this.status);
            return this.status;
        } catch (error) {
            this.portal.log('error', 'Failed to get git status', error);
            throw error;
        }
    }
    
    /**
     * Stage specific files
     */
    async stageFiles(files) {
        try {
            if (!files || files.length === 0) {
                throw new Error('No files specified for staging');
            }
            
            await this.git.add(files);
            files.forEach(file => this.stagedFiles.add(file));
            
            await this.refreshStatus();
            this.portal.log('info', `Staged ${files.length} files`, files);
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to stage files', error);
            throw error;
        }
    }
    
    /**
     * Unstage specific files
     */
    async unstageFiles(files) {
        try {
            await this.git.reset(['HEAD', ...files]);
            files.forEach(file => this.stagedFiles.delete(file));
            
            await this.refreshStatus();
            this.portal.log('info', `Unstaged ${files.length} files`, files);
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to unstage files', error);
            throw error;
        }
    }
    
    /**
     * Stage all changes
     */
    async stageAll() {
        try {
            await this.git.add('.');
            await this.refreshStatus();
            
            this.stagedFiles.clear();
            [...this.status.modified, ...this.status.untracked, ...this.status.deleted].forEach(
                file => this.stagedFiles.add(file)
            );
            
            this.portal.log('info', 'Staged all changes');
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to stage all files', error);
            throw error;
        }
    }
    
    /**
     * Get diff for specific file
     */
    async getDiff(filePath, staged = false) {
        try {
            let diff;
            if (staged) {
                diff = await this.git.diff(['--cached', filePath]);
            } else {
                diff = await this.git.diff([filePath]);
            }
            return diff;
        } catch (error) {
            this.portal.log('error', `Failed to get diff for ${filePath}`, error);
            return '';
        }
    }
    
    /**
     * Commit staged changes with message
     */
    async commit(message, options = {}) {
        try {
            if (!message || message.trim() === '') {
                throw new Error('Commit message is required');
            }
            
            // Check if there are staged changes
            const status = await this.git.status();
            if (status.staged.length === 0) {
                throw new Error('No staged changes to commit');
            }
            
            // Configure git user if needed
            if (options.configureUser !== false) {
                await this.git.addConfig('user.name', options.userName || 'AA Admin Portal');
                await this.git.addConfig('user.email', options.userEmail || 'admin@aaeventdecor.com');
            }
            
            // Commit with message
            const result = await this.git.commit(message);
            
            // Clear staged files
            this.stagedFiles.clear();
            
            // Add to commit history
            this.commitHistory.unshift({
                hash: result.commit,
                message: message,
                timestamp: new Date().toISOString(),
                filesChanged: status.staged.length
            });
            
            // Keep only last 50 commits in memory
            if (this.commitHistory.length > 50) {
                this.commitHistory = this.commitHistory.slice(0, 50);
            }
            
            await this.refreshStatus();
            this.portal.log('info', 'Commit successful', result);
            return result;
        } catch (error) {
            this.portal.log('error', 'Commit failed', error);
            throw error;
        }
    }
    
    /**
     * Push to remote repository
     */
    async push(remote = 'origin', branch = null, options = {}) {
        try {
            branch = branch || this.status.branch || 'main';
            
            // Set up authentication if provided
            if (options.token && options.repoUrl) {
                await this.configureRemoteWithAuth(remote, options.repoUrl, options.token);
            }
            
            // Push with progress tracking
            const result = await this.git.push(remote, branch);
            
            await this.refreshStatus();
            this.portal.log('info', 'Push successful', { remote, branch, result });
            return result;
        } catch (error) {
            this.portal.log('error', 'Push failed', error);
            
            // Enhanced error messages
            if (error.message.includes('Authentication')) {
                throw new Error('Authentication failed. Check your GitHub token permissions.');
            } else if (error.message.includes('rejected')) {
                throw new Error('Push rejected. You may need to pull changes first.');
            } else if (error.message.includes('Repository not found')) {
                throw new Error('Repository not found. Check the URL and permissions.');
            }
            throw error;
        }
    }
    
    /**
     * Pull from remote repository
     */
    async pull(remote = 'origin', branch = null, options = {}) {
        try {
            branch = branch || this.status.branch || 'main';
            
            // Set up authentication if provided
            if (options.token && options.repoUrl) {
                await this.configureRemoteWithAuth(remote, options.repoUrl, options.token);
            }
            
            const result = await this.git.pull(remote, branch);
            await this.refreshStatus();
            
            this.portal.log('info', 'Pull successful', { remote, branch, result });
            return result;
        } catch (error) {
            this.portal.log('error', 'Pull failed', error);
            throw error;
        }
    }
    
    /**
     * Configure remote with authentication
     */
    async configureRemoteWithAuth(remoteName, repoUrl, token) {
        try {
            // Remove existing remote
            try {
                await this.git.removeRemote(remoteName);
            } catch (e) {
                // Remote might not exist
            }
            
            // Parse and build authenticated URL
            let repoPath = repoUrl.replace(/^https?:\/\//, '').replace(/^github\.com\//, '');
            repoPath = repoPath.replace(/\.git$/, '');
            
            const authenticatedUrl = `https://${token}@github.com/${repoPath}.git`;
            
            // Add remote with auth
            await this.git.addRemote(remoteName, authenticatedUrl);
            
            this.portal.log('info', 'Remote configured with authentication');
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to configure remote', error);
            throw error;
        }
    }
    
    /**
     * Get commit history
     */
    async getCommitHistory(limit = 20) {
        try {
            const log = await this.git.log(['--max-count=' + limit]);
            this.commitHistory = log.all.map(commit => ({
                hash: commit.hash,
                message: commit.message,
                author: commit.author_name,
                email: commit.author_email,
                date: commit.date,
                timestamp: new Date(commit.date).toISOString()
            }));
            return this.commitHistory;
        } catch (error) {
            this.portal.log('error', 'Failed to get commit history', error);
            return [];
        }
    }
    
    /**
     * Create and checkout new branch
     */
    async createBranch(branchName) {
        try {
            await this.git.checkoutBranch(branchName, 'HEAD');
            await this.refreshStatus();
            this.portal.log('info', `Created and checked out branch: ${branchName}`);
            return true;
        } catch (error) {
            this.portal.log('error', `Failed to create branch ${branchName}`, error);
            throw error;
        }
    }
    
    /**
     * Switch to existing branch
     */
    async switchBranch(branchName) {
        try {
            await this.git.checkout(branchName);
            await this.refreshStatus();
            this.portal.log('info', `Switched to branch: ${branchName}`);
            return true;
        } catch (error) {
            this.portal.log('error', `Failed to switch to branch ${branchName}`, error);
            throw error;
        }
    }
    
    /**
     * Get list of branches
     */
    async getBranches() {
        try {
            const branches = await this.git.branch();
            return {
                all: branches.all,
                current: branches.current,
                local: branches.branches,
                remote: branches.all.filter(b => b.startsWith('remotes/'))
            };
        } catch (error) {
            this.portal.log('error', 'Failed to get branches', error);
            return { all: [], current: null, local: {}, remote: [] };
        }
    }
    
    /**
     * Discard changes for specific files
     */
    async discardChanges(files) {
        try {
            await this.git.checkout(['--', ...files]);
            await this.refreshStatus();
            this.portal.log('info', `Discarded changes for ${files.length} files`);
            return true;
        } catch (error) {
            this.portal.log('error', 'Failed to discard changes', error);
            throw error;
        }
    }
    
    /**
     * Get remote repositories
     */
    async getRemotes() {
        try {
            const remotes = await this.git.getRemotes(true);
            return remotes.map(remote => ({
                name: remote.name,
                fetchUrl: remote.refs.fetch,
                pushUrl: remote.refs.push
            }));
        } catch (error) {
            this.portal.log('error', 'Failed to get remotes', error);
            return [];
        }
    }
}

// Export for use in admin.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitModule;
}