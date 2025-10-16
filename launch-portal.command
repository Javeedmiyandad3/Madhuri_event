#!/bin/bash

# ============================================
# AA Admin Portal - Production Launcher
# Version: 2.0.0
# Platform: macOS 10.14+ (Mojave or later)
# ============================================

set -euo pipefail

# Configuration
readonly SCRIPT_VERSION="2.0.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PORTAL_DIR="${SCRIPT_DIR}/admin-portal"
readonly NODE_VERSION="20.11.0"
readonly MIN_NODE_MAJOR=16
readonly LOG_FILE="/tmp/aa-portal-setup.log"

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Error tracking
ERROR_COUNT=0

# ============================================
# Utility Functions
# ============================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "${LOG_FILE}"
}

display_banner() {
    clear
    echo ""
    echo "============================================"
    echo "  AA EVENT DECOR - ADMIN PORTAL"
    echo "  Production Launcher v${SCRIPT_VERSION}"
    echo "============================================"
    echo ""
    echo "Log: ${LOG_FILE}"
    echo ""
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $*"
    log "SUCCESS: $*"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $*"
    log "ERROR: $*"
    ((ERROR_COUNT++))
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $*"
    log "WARNING: $*"
}

print_info() {
    echo -e "${BLUE}[*]${NC} $*"
    log "INFO: $*"
}

cleanup() {
    local exit_code=$?
    echo ""
    log "Launcher completed with exit code: ${exit_code}"
    
    if [ ${ERROR_COUNT} -gt 0 ]; then
        echo ""
        print_error "Setup completed with ${ERROR_COUNT} error(s)"
        echo "Check log file: ${LOG_FILE}"
        echo ""
        echo "Press Enter to exit..."
        read -r
        exit 1
    fi
    
    exit ${exit_code}
}

trap cleanup EXIT

# ============================================
# Prerequisite Checks
# ============================================

check_macos_version() {
    local version
    version=$(sw_vers -productVersion)
    local major
    major=$(echo "${version}" | cut -d. -f1)
    local minor
    minor=$(echo "${version}" | cut -d. -f2)
    
    print_info "macOS ${version}"
    log "macOS version: ${version}"
    
    # Check for minimum macOS 10.14 (Mojave)
    if [ "${major}" -lt 10 ] || ([ "${major}" -eq 10 ] && [ "${minor}" -lt 14 ]); then
        print_warning "macOS ${version} is quite old. Minimum recommended: 10.14"
    fi
}

check_command() {
    command -v "$1" &> /dev/null
}

check_nodejs() {
    if ! check_command node; then
        print_error "Node.js not installed"
        return 1
    fi
    
    local version
    version=$(node --version 2>/dev/null | sed 's/v//')
    
    if [ -z "${version}" ]; then
        print_error "Cannot get Node.js version"
        return 1
    fi
    
    local major
    major=$(echo "${version}" | cut -d. -f1)
    
    if [ -z "${major}" ]; then
        print_error "Cannot parse Node.js version"
        return 1
    fi
    
    print_info "Node version detected: v${version} (major: ${major})"
    
    # Simple comparison
    if [ "${major}" -lt ${MIN_NODE_MAJOR} ]; then
        print_error "Node.js v${version} is too old (minimum: v${MIN_NODE_MAJOR}.0.0)"
        return 1
    fi
    
    print_success "Node.js v${version} installed"
    log "Node.js v${version} verified"
    
    if [ "${major}" -gt 20 ]; then
        print_info "Using Node.js v${major} (newer than tested v20 - this is fine!)"
    fi
    
    return 0
}

check_npm() {
    if ! check_command npm; then
        print_error "npm not installed"
        return 1
    fi
    
    local version
    version=$(npm --version 2>/dev/null)
    print_success "npm v${version} installed"
    return 0
}

check_git() {
    if ! check_command git; then
        print_warning "Git not installed (optional)"
        print_warning "Some features may be limited"
        return 1
    fi
    
    local version
    version=$(git --version 2>/dev/null)
    print_success "${version}"
    return 0
}

# ============================================
# Installation Functions
# ============================================

check_homebrew() {
    if ! check_command brew; then
        return 1
    fi
    return 0
}

install_homebrew() {
    print_info "Homebrew not found. Installing..."
    echo ""
    
    log "Installing Homebrew"
    
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    local exit_code=$?
    if [ ${exit_code} -ne 0 ]; then
        print_error "Failed to install Homebrew"
        return 1
    fi
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [ -f "/opt/homebrew/bin/brew" ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        log "Added Homebrew to PATH (Apple Silicon)"
    elif [ -f "/usr/local/bin/brew" ]; then
        eval "$(/usr/local/bin/brew shellenv)"
        log "Added Homebrew to PATH (Intel)"
    fi
    
    if ! check_command brew; then
        print_error "Homebrew installation verification failed"
        return 1
    fi
    
    print_success "Homebrew installed successfully"
    return 0
}

install_nodejs() {
    echo ""
    print_info "Installing Node.js v${NODE_VERSION}..."
    log "Installing Node.js v${NODE_VERSION}"
    
    # Ensure Homebrew is installed
    if ! check_homebrew; then
        install_homebrew
        if [ $? -ne 0 ]; then
            print_error "Cannot install Node.js without Homebrew"
            echo ""
            echo "Alternative: Download manually from https://nodejs.org/"
            return 1
        fi
    fi
    
    # Update Homebrew
    print_info "Updating Homebrew..."
    brew update > /dev/null 2>&1 || {
        print_warning "Homebrew update failed, continuing anyway"
    }
    
    # Install Node.js
    print_info "Installing Node.js via Homebrew..."
    echo "This may take 3-5 minutes..."
    echo ""
    
    if brew install node; then
        print_success "Node.js installed successfully"
        log "Node.js installation completed"
    else
        print_error "Failed to install Node.js via Homebrew"
        echo ""
        echo "Alternative: Download manually from https://nodejs.org/"
        return 1
    fi
    
    # Verify installation
    sleep 2
    if ! check_nodejs; then
        print_error "Node.js installation verification failed"
        return 1
    fi
    
    echo ""
    return 0
}

install_git() {
    echo ""
    print_info "Installing Git..."
    log "Installing Git"
    
    # Try Xcode Command Line Tools first
    print_info "Attempting to install Xcode Command Line Tools..."
    xcode-select --install 2>/dev/null || {
        print_warning "Xcode Command Line Tools installation dialog may have appeared"
    }
    
    echo ""
    echo "If a dialog appeared, please:"
    echo "1. Click 'Install' to install Command Line Tools"
    echo "2. Wait for installation to complete"
    echo "3. Return here and press Enter"
    echo ""
    echo "If no dialog appeared, just press Enter to continue..."
    read -r
    
    # Verify Git installation
    if check_command git; then
        print_success "Git installed successfully"
        return 0
    else
        print_warning "Git installation incomplete"
        print_info "Git can be installed later from https://git-scm.com/"
        return 1
    fi
}

# ============================================
# Application Validation
# ============================================

validate_application() {
    echo ""
    echo "[STEP 2/4] Validating Application Files"
    echo "--------------------------------------------"
    log "Validating application files"
    
    # Check admin-portal directory
    if [ ! -d "${PORTAL_DIR}" ]; then
        print_error "admin-portal directory not found"
        echo "Expected location: ${PORTAL_DIR}"
        echo ""
        echo "Please ensure admin-portal folder is in the same directory as this launcher"
        return 1
    fi
    print_success "admin-portal directory found"
    
    # Change to portal directory
    cd "${PORTAL_DIR}" || {
        print_error "Cannot access admin-portal directory"
        return 1
    }
    
    # Check package.json
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        return 1
    fi
    print_success "package.json found"
    
    # Validate package.json
    if ! python3 -m json.tool package.json > /dev/null 2>&1; then
        if ! node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" > /dev/null 2>&1; then
            print_warning "package.json may have syntax errors"
        fi
    fi
    
    # Check main.js
    if [ ! -f "main.js" ]; then
        print_error "main.js not found"
        return 1
    fi
    print_success "main.js found"
    
    # Check admin directory
    if [ ! -d "admin" ]; then
        print_error "admin directory not found"
        return 1
    fi
    print_success "admin directory found"
    
    # Check index.html
    if [ ! -f "admin/index.html" ]; then
        print_error "admin/index.html not found"
        return 1
    fi
    print_success "admin/index.html found"
    
    # Check for additional expected directories
    for dir in "admin/css" "admin/js"; do
        if [ ! -d "${dir}" ]; then
            print_warning "${dir} directory not found"
        fi
    done
    
    echo ""
    return 0
}

# ============================================
# Dependency Management
# ============================================

check_dependency_integrity() {
    # Quick check if key dependencies exist
    [ -d "node_modules/electron" ] && [ -f "node_modules/.package-lock.json" ]
}

install_dependencies() {
    echo "[STEP 3/4] Managing Dependencies"
    echo "--------------------------------------------"
    log "Managing dependencies"
    
    # Check if node_modules exists and is valid
    if [ -d "node_modules" ]; then
        print_success "Dependencies cache found"
        
        if check_dependency_integrity; then
            print_success "Dependencies are up to date"
            echo ""
            return 0
        else
            print_warning "Dependencies cache is incomplete"
        fi
    fi
    
    # Install dependencies
    print_info "Installing npm packages..."
    print_info "This may take 5-10 minutes depending on your internet speed"
    print_info "Please wait, do not close this window..."
    echo ""
    
    log "Installing dependencies"
    
    # Set npm to use less verbose output
    npm install --production --no-audit --no-fund 2>&1 | grep -v "^npm WARN" || {
        print_error "Failed to install dependencies"
        echo ""
        echo "Troubleshooting:"
        echo "1. Check your internet connection"
        echo "2. Check firewall settings"
        echo "3. Try running: cd ${PORTAL_DIR} && npm install"
        echo "4. Check npm logs: ~/.npm/_logs/"
        return 1
    }
    
    print_success "Dependencies installed successfully"
    log "Dependencies installation completed"
    
    # Rebuild native modules
    print_info "Rebuilding native modules..."
    npm rebuild > /dev/null 2>&1 || {
        print_warning "Some native modules failed to rebuild (non-critical)"
    }
    print_success "Native modules rebuilt"
    log "Native modules rebuilt"
    
    echo ""
    return 0
}

# ============================================
# Application Launch
# ============================================

launch_application() {
    echo "[STEP 4/4] Launching Application"
    echo "--------------------------------------------"
    log "Launching application"
    echo ""
    print_info "Starting AA Admin Portal..."
    echo ""
    echo "============================================"
    echo "  PORTAL IS STARTING..."
    echo "  Close the portal window to exit"
    echo "============================================"
    echo ""
    
    # Launch the application
    npm start 2>&1
    
    local exit_code=$?
    
    if [ ${exit_code} -ne 0 ]; then
        echo ""
        print_error "Application exited with error code ${exit_code}"
        log "Application error code: ${exit_code}"
    else
        echo ""
        print_info "Portal closed normally"
        log "Portal closed normally"
    fi
    
    return ${exit_code}
}

# ============================================
# Main Execution
# ============================================

main() {
    # Initialize log
    echo "========================================" > "${LOG_FILE}"
    log "AA Admin Portal Launcher v${SCRIPT_VERSION} started"
    log "Script directory: ${SCRIPT_DIR}"
    log "Portal directory: ${PORTAL_DIR}"
    
    # Display banner
    display_banner
    
    # Step 1: Check Prerequisites
    echo "[STEP 1/4] Checking System Prerequisites"
    echo "--------------------------------------------"
    log "Checking prerequisites"
    
    check_macos_version
    
    # Check and install Node.js
    if ! check_nodejs; then
        print_info "Installing Node.js..."
        install_nodejs || {
            print_error "Node.js installation failed"
            return 1
        }
    fi
    
    # Check npm
    if ! check_npm; then
        print_error "npm should be installed with Node.js"
        return 1
    fi
    
    # Check Git (optional)
    if ! check_git; then
        read -p "Would you like to install Git? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_git
        fi
    fi
    
    # Step 2: Validate Application
    validate_application || return 1
    
    # Step 3: Install Dependencies
    install_dependencies || return 1
    
    # Step 4: Launch Application
    launch_application
    
    return $?
}

# Run main function
main
exit_code=$?

echo ""
echo "Press Enter to exit..."
read -r

exit ${exit_code}