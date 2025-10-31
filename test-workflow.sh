#!/bin/bash

# Terra CLI - New Workflow Test Script
# This script validates the new terra create/add workflow

set -e

echo "🧪 Testing Terra CLI New Workflow..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test directory
TEST_DIR="/tmp/terra-workflow-test"
PROJECT_NAME="demo-project"

# Clean up
echo "📁 Cleaning up test directory..."
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Build the CLI
echo ""
echo "🔨 Building Terra CLI..."
cd /Users/ngelrojas/Projects/terraform_lab/terra-plugins
pnpm run build > /dev/null 2>&1
echo -e "${GREEN}✅ Build successful${NC}"

# Go back to test directory
cd "$TEST_DIR"

# Test 1: Create project (manual step - requires interaction)
echo ""
echo "📝 TEST 1: Create Project"
echo "⚠️  This step requires manual interaction"
echo "Run: terra create $PROJECT_NAME"
echo "   - Select provider: aws"
echo "   - Enter environment: dev"
echo ""
read -p "Press Enter when project is created..."

# Validate project structure
echo ""
echo "🔍 Validating project structure..."

if [ ! -d "$PROJECT_NAME" ]; then
    echo "❌ Project directory not created"
    exit 1
fi

cd "$PROJECT_NAME"

if [ ! -f "terra.json" ]; then
    echo "❌ terra.json not found"
    exit 1
fi

if [ ! -f "registry.json" ]; then
    echo "❌ registry.json not found"
    exit 1
fi

if [ -d "plugins" ]; then
    echo "❌ plugins/ directory should NOT exist"
    exit 1
fi

echo -e "${GREEN}✅ Project structure correct (terra.json + registry.json, no plugins/)${NC}"

# Test 2: Add first plugin
echo ""
echo "📝 TEST 2: Add AWS S3 Plugin"
/Users/ngelrojas/Projects/terraform_lab/terra-plugins/packages/cli/dist/index.js add aws s3

if [ ! -d "aws-s3" ]; then
    echo "❌ aws-s3/ directory not created"
    exit 1
fi

if [ ! -f "aws-s3/plugin.yml" ]; then
    echo "❌ aws-s3/plugin.yml not found"
    exit 1
fi

echo -e "${GREEN}✅ aws-s3/ created successfully${NC}"

# Test 3: Add second plugin
echo ""
echo "📝 TEST 3: Add AWS VPC Plugin"
/Users/ngelrojas/Projects/terraform_lab/terra-plugins/packages/cli/dist/index.js add aws vpc

if [ ! -d "aws-vpc" ]; then
    echo "❌ aws-vpc/ directory not created"
    exit 1
fi

echo -e "${GREEN}✅ aws-vpc/ created successfully${NC}"

# Test 4: Add third plugin
echo ""
echo "📝 TEST 4: Add AWS SQS Plugin"
/Users/ngelrojas/Projects/terraform_lab/terra-plugins/packages/cli/dist/index.js add aws sqs

if [ ! -d "aws-sqs" ]; then
    echo "❌ aws-sqs/ directory not created"
    exit 1
fi

echo -e "${GREEN}✅ aws-sqs/ created successfully${NC}"

# Test 5: Check terra.json
echo ""
echo "📝 TEST 5: Validate terra.json"

if ! grep -q '"aws/s3"' terra.json; then
    echo "❌ aws/s3 not in terra.json"
    exit 1
fi

if ! grep -q '"aws/vpc"' terra.json; then
    echo "❌ aws/vpc not in terra.json"
    exit 1
fi

if ! grep -q '"aws/sqs"' terra.json; then
    echo "❌ aws/sqs not in terra.json"
    exit 1
fi

echo -e "${GREEN}✅ terra.json updated correctly${NC}"

# Test 6: Build
echo ""
echo "📝 TEST 6: Build Terraform Configuration"
/Users/ngelrojas/Projects/terraform_lab/terra-plugins/packages/cli/dist/index.js build

if [ ! -f "main.tf" ]; then
    echo "❌ main.tf not generated"
    exit 1
fi

if ! grep -q './aws-s3' main.tf; then
    echo "❌ main.tf doesn't reference ./aws-s3"
    exit 1
fi

if ! grep -q './aws-vpc' main.tf; then
    echo "❌ main.tf doesn't reference ./aws-vpc"
    exit 1
fi

echo -e "${GREEN}✅ Terraform files generated correctly${NC}"

# Final structure
echo ""
echo "📁 Final Project Structure:"
echo ""
tree -L 1 . || ls -la

echo ""
echo "🎉 ${GREEN}ALL TESTS PASSED!${NC}"
echo ""
echo "The new workflow is working correctly:"
echo "  1. ✅ terra create prompts for provider & environment"
echo "  2. ✅ Creates only terra.json + registry.json (no plugins/)"
echo "  3. ✅ terra add creates flattened directories (aws-s3, aws-vpc, etc.)"
echo "  4. ✅ terra build generates correct Terraform with proper paths"
echo ""

