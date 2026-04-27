#!/bin/bash

# e-Vaccin Project Reorganization Script
# Creates the new project structure and moves files accordingly

set -e

BASE_DIR="$(pwd)"
echo "🚀 Starting e-Vaccin Project Reorganization..."
echo "Base directory: $BASE_DIR"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create directory structure
echo -e "${BLUE}Creating directory structure...${NC}"

# Frontend structure
mkdir -p frontend/{src/{components,pages,hooks,utils,config,assets},public}
echo -e "${GREEN}✓${NC} Frontend structure created"

# Documentation structure
mkdir -p docs/{OVERVIEW,GUIDES,SMS_Module,SMS_Testing,REFERENCE,CHANGELOG}
echo -e "${GREEN}✓${NC} Documentation structure created"

# Scripts structure
mkdir -p scripts/{test,deployment,setup}
echo -e "${GREEN}✓${NC} Scripts structure created"

# Database structure
mkdir -p database/{migrations,seeds}
echo -e "${GREEN}✓${NC} Database structure created"

# Other directories
mkdir -p docker config .github/workflows
echo -e "${GREEN}✓${NC} Other directories created"

echo ""
echo -e "${BLUE}Moving files...${NC}"

# Move Frontend files
echo -e "${YELLOW}Moving frontend files...${NC}"
[ -f "App.jsx" ] && mv App.jsx frontend/src/ && echo -e "${GREEN}✓${NC} App.jsx"
[ -f "main.jsx" ] && mv main.jsx frontend/src/ && echo -e "${GREEN}✓${NC} main.jsx"
[ -f "index.css" ] && mv index.css frontend/src/ && echo -e "${GREEN}✓${NC} index.css"
[ -f "index.html" ] && mv index.html frontend/ && echo -e "${GREEN}✓${NC} index.html"
[ -f "vite.config.js" ] && mv vite.config.js frontend/ && echo -e "${GREEN}✓${NC} vite.config.js"
[ -f "package.json" ] && mv package.json frontend/ && echo -e "${GREEN}✓${NC} package.json"
[ -d "components" ] && mv components/* frontend/src/components/ 2>/dev/null && rmdir components && echo -e "${GREEN}✓${NC} components"
[ -d "pages" ] && mv pages/* frontend/src/pages/ 2>/dev/null && rmdir pages && echo -e "${GREEN}✓${NC} pages"
[ -d "hooks" ] && mv hooks/* frontend/src/hooks/ 2>/dev/null && rmdir hooks && echo -e "${GREEN}✓${NC} hooks"
[ -d "utils" ] && mv utils/* frontend/src/utils/ 2>/dev/null && rmdir utils && echo -e "${GREEN}✓${NC} utils"
[ -d "config" ] && [ -n "$(ls config/)" ] && mv config/* frontend/src/config/ 2>/dev/null && echo -e "${GREEN}✓${NC} config"
[ -f "e-vaccin-landing.jsx" ] && mv e-vaccin-landing.jsx frontend/src/pages/ && echo -e "${GREEN}✓${NC} e-vaccin-landing"
[ -f "e-vaccin-landing.css" ] && mv e-vaccin-landing.css frontend/src/pages/ && echo -e "${GREEN}✓${NC} e-vaccin-landing.css"
[ -f "e-vaccin-login.jsx" ] && mv e-vaccin-login.jsx frontend/src/pages/ && echo -e "${GREEN}✓${NC} e-vaccin-login"
[ -f "e-vaccin-login.css" ] && mv e-vaccin-login.css frontend/src/pages/ && echo -e "${GREEN}✓${NC} e-vaccin-login.css"
[ -f ".eslintrc.json" ] && mv .eslintrc.json frontend/ && echo -e "${GREEN}✓${NC} .eslintrc.json"
[ -f ".prettierrc.json" ] && mv .prettierrc.json frontend/ && echo -e "${GREEN}✓${NC} .prettierrc.json"

# Move Configuration files
echo -e "${YELLOW}Moving configuration files...${NC}"
[ -f ".env.example" ] && mv .env.example config/ && echo -e "${GREEN}✓${NC} .env.example"
[ -f ".env.development" ] && mv .env.development config/ && echo -e "${GREEN}✓${NC} .env.development"
[ -f ".env.production" ] && mv .env.production config/ && echo -e "${GREEN}✓${NC} .env.production"

# Move SMS Test Scripts
echo -e "${YELLOW}Moving SMS test scripts...${NC}"
[ -f "sms-test.ps1" ] && mv sms-test.ps1 scripts/test/ && echo -e "${GREEN}✓${NC} sms-test.ps1"
[ -f "sms-test.sh" ] && mv sms-test.sh scripts/test/ && echo -e "${GREEN}✓${NC} sms-test.sh"

# Move SMS Documentation
echo -e "${YELLOW}Moving SMS documentation...${NC}"
[ -f "SMS_INTEGRATION.md" ] && mv SMS_INTEGRATION.md docs/SMS_Module/ && echo -e "${GREEN}✓${NC} SMS_INTEGRATION.md"
[ -f "SMS_QUICKSTART.md" ] && mv SMS_QUICKSTART.md docs/SMS_Module/ && echo -e "${GREEN}✓${NC} SMS_QUICKSTART.md"
[ -f "SMS_QUICKSTART_SETUP.md" ] && mv SMS_QUICKSTART_SETUP.md docs/SMS_Module/ && echo -e "${GREEN}✓${NC} SMS_QUICKSTART_SETUP.md"
[ -f "SMS_MAVEN_DEPENDENCIES.md" ] && mv SMS_MAVEN_DEPENDENCIES.md docs/SMS_Module/ && echo -e "${GREEN}✓${NC} SMS_MAVEN_DEPENDENCIES.md"
[ -f "SMS_TESTING_README.md" ] && mv SMS_TESTING_README.md docs/SMS_Testing/ && echo -e "${GREEN}✓${NC} SMS_TESTING_README.md"
[ -f "SMS_TESTING_COMPLETE_GUIDE.md" ] && mv SMS_TESTING_COMPLETE_GUIDE.md docs/SMS_Testing/ && echo -e "${GREEN}✓${NC} SMS_TESTING_COMPLETE_GUIDE.md"
[ -f "SMS_TESTING_CHECKLIST.md" ] && mv SMS_TESTING_CHECKLIST.md docs/SMS_Testing/ && echo -e "${GREEN}✓${NC} SMS_TESTING_CHECKLIST.md"
[ -f "SMS_TESTING_SUMMARY.md" ] && mv SMS_TESTING_SUMMARY.md docs/SMS_Testing/ && echo -e "${GREEN}✓${NC} SMS_TESTING_SUMMARY.md"
[ -f "SMS_CURL_EXAMPLES.md" ] && mv SMS_CURL_EXAMPLES.md docs/SMS_Testing/ && echo -e "${GREEN}✓${NC} SMS_CURL_EXAMPLES.md"

# Move Other Documentation
echo -e "${YELLOW}Moving other documentation...${NC}"
[ -f "BACKEND_ARCHITECTURE.md" ] && mv BACKEND_ARCHITECTURE.md docs/GUIDES/ && echo -e "${GREEN}✓${NC} BACKEND_ARCHITECTURE.md"
[ -f "API_INTEGRATION.md" ] && mv API_INTEGRATION.md docs/GUIDES/ && echo -e "${GREEN}✓${NC} API_INTEGRATION.md"
[ -f "DEPLOYMENT.md" ] && mv DEPLOYMENT.md docs/GUIDES/ && echo -e "${GREEN}✓${NC} DEPLOYMENT.md"
[ -f "IMPROVEMENTS_SUMMARY.md" ] && mv IMPROVEMENTS_SUMMARY.md docs/GUIDES/ && echo -e "${GREEN}✓${NC} IMPROVEMENTS_SUMMARY.md"
[ -f "USAGE_GUIDE.md" ] && mv USAGE_GUIDE.md docs/GUIDES/ && echo -e "${GREEN}✓${NC} USAGE_GUIDE.md"
[ -f "DOCUMENTATION_INDEX.md" ] && mv DOCUMENTATION_INDEX.md docs/OVERVIEW/ && echo -e "${GREEN}✓${NC} DOCUMENTATION_INDEX.md"
[ -f "CHANGELOG.md" ] && mv CHANGELOG.md docs/CHANGELOG/ && echo -e "${GREEN}✓${NC} CHANGELOG.md"

# Move Backend SMS config
echo -e "${YELLOW}Moving backend SMS configuration...${NC}"
[ -f "backend/SMS_CONFIG.properties" ] && mv backend/SMS_CONFIG.properties docs/SMS_Module/ && echo -e "${GREEN}✓${NC} SMS_CONFIG.properties"

echo ""
echo -e "${GREEN}✅ Files reorganized successfully!${NC}"
echo ""
echo -e "${BLUE}Remaining tasks:${NC}"
echo "1. Update import paths in frontend files (if needed)"
echo "2. Update documentation links"
echo "3. Create README files in each directory"
echo "4. Run: git add -A && git commit -m 'refactor: Reorganize project structure'"
echo ""
echo "Project structure is now organized!"
