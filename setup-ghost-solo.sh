#!/bin/bash

# Ghost Blog Setup Script with Solo Theme
# This script automates the installation of Ghost CMS locally with Solo theme

set -e # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GHOST_DIR="$HOME/ghost-blog"
THEME_NAME="solo"
THEME_URL="https://github.com/TryGhost/Solo/archive/main.zip"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Ghost Blog Setup with Solo Theme                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &>/dev/null; then
	echo -e "${RED}❌ Node.js is not installed${NC}"
	echo "Please install Node.js v18 or v20 from https://nodejs.org"
	exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" != "18" ] && [ "$NODE_VERSION" != "20" ] && [ "$NODE_VERSION" != "22" ]; then
	echo -e "${RED}❌ Node.js version $NODE_VERSION is not supported${NC}"
	echo "Ghost requires Node.js v18, v20, or v22"
	echo "Current version: $(node --version)"
	echo ""
	echo -e "${YELLOW}Please install a compatible Node version:${NC}"
	echo "  https://nodejs.org/dist/v22.13.1/"
	echo ""
	exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &>/dev/null; then
	echo -e "${RED}❌ npm is not installed${NC}"
	exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Check if directory exists
if [ -d "$GHOST_DIR" ]; then
	echo -e "${YELLOW}⚠️  Directory $GHOST_DIR already exists${NC}"
	read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		echo -e "${YELLOW}Removing existing directory...${NC}"
		rm -rf "$GHOST_DIR"
	else
		echo -e "${YELLOW}Exiting...${NC}"
		exit 0
	fi
fi

# Install Ghost-CLI if not present
echo ""
echo -e "${YELLOW}Installing Ghost-CLI...${NC}"
if ! command -v ghost &>/dev/null; then
	npm install ghost-cli@latest -g
	echo -e "${GREEN}✓ Ghost-CLI installed${NC}"
else
	echo -e "${GREEN}✓ Ghost-CLI already installed ($(ghost --version))${NC}"
fi

# Create Ghost directory and install
echo ""
echo -e "${YELLOW}Creating Ghost installation...${NC}"
mkdir -p "$GHOST_DIR"
cd "$GHOST_DIR"

echo -e "${BLUE}Installing Ghost locally (this may take a few minutes)...${NC}"
ghost install local

if [ $? -ne 0 ]; then
	echo -e "${RED}❌ Ghost installation failed${NC}"
	exit 1
fi

echo -e "${GREEN}✓ Ghost installed successfully${NC}"

# Download and install Solo theme
echo ""
echo -e "${YELLOW}Installing Solo theme...${NC}"
cd "$GHOST_DIR/content/themes"

# Download Solo theme
if command -v curl &>/dev/null; then
	curl -L "$THEME_URL" -o solo-theme.zip
elif command -v wget &>/dev/null; then
	wget "$THEME_URL" -O solo-theme.zip
else
	echo -e "${RED}❌ Neither curl nor wget is installed${NC}"
	exit 1
fi

# Extract and setup theme
if command -v unzip &>/dev/null; then
	unzip -q solo-theme.zip
	mv Solo-main solo
	rm solo-theme.zip
else
	echo -e "${RED}❌ unzip is not installed${NC}"
	exit 1
fi

echo -e "${GREEN}✓ Solo theme installed${NC}"

# Restart Ghost to recognize new theme
echo ""
echo -e "${YELLOW}Restarting Ghost...${NC}"
cd "$GHOST_DIR"
ghost restart

# Success message
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ Setup Complete!                                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Your Ghost blog is ready:${NC}"
echo ""
echo -e "🌐  Frontend:     ${YELLOW}http://localhost:2368${NC}"
echo -e "⚙️   Admin Panel:  ${YELLOW}http://localhost:2368/ghost${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Open http://localhost:2368/ghost to create your admin account"
echo "2. Go to Settings → Design and activate the 'solo' theme"
echo "3. Go to Settings → Labs → Import Content"
echo "4. Upload your ghost-export.json file"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  ghost start    - Start Ghost"
echo "  ghost stop     - Stop Ghost"
echo "  ghost restart  - Restart Ghost"
echo "  ghost log      - View logs"
echo "  ghost ls       - List Ghost instances"
echo ""
echo -e "${BLUE}Installation directory:${NC} $GHOST_DIR"
echo ""
