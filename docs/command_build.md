# Terra CLI - Build & Setup Guide

This guide covers all the necessary commands to build the Terra CLI project from source and use it.

---

## 📋 Prerequisites

Before building, ensure you have:

- **Node.js** v18 or higher
- **pnpm** package manager

### Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

---

## 🔨 Building the Project

### Step 1: Clone the Repository (if needed)

```bash
git clone <repository-url>
cd terra-plugins
```

### Step 2: Install Dependencies

Install all dependencies for the monorepo and workspaces:

```bash
pnpm install
```

**What this does:**
- Installs dependencies for all packages (`cli`, `core`, `plugins`)
- Sets up workspace links between packages
- Downloads external dependencies (commander, chalk, inquirer, etc.)

### Step 3: Build All Packages

Compile TypeScript to JavaScript:

```bash
pnpm run build
```

**What this does:**
- Compiles `packages/core/src/**/*.ts` → `packages/core/dist/**/*.js`
- Compiles `packages/cli/src/**/*.ts` → `packages/cli/dist/**/*.js`
- Makes CLI executable with proper permissions
- Validates TypeScript types and checks for errors

**Expected output:**
```
Scope: 2 of 3 workspace projects
packages/core build$ tsc -p tsconfig.json
└─ Done in 598ms
packages/cli build$ tsc -p tsconfig.json
└─ Done in 666ms
packages/cli postbuild$ chmod +x dist/index.js
└─ Done in 10ms
```

### Step 4: Link CLI Globally

Make the `terra` command available globally on your system:

```bash
pnpm link --global
```

**Alternative method:**
```bash
cd packages/cli
pnpm link --global
```

**What this does:**
- Creates a global symlink for the `terra` command
- Allows you to run `terra` from any directory
- Links to the compiled CLI in `packages/cli/dist/index.js`

**Verify installation:**
```bash
terra --version
# Should output: 0.1.0

terra --help
# Should show available commands
```

---

## 🔄 Development Workflow

### Rebuild After Code Changes

If you modify TypeScript files:

```bash
pnpm run build
```

The global link will automatically use the updated code.

### Watch Mode (Optional)

For active development, you can use watch mode:

```bash
# In packages/core
cd packages/core
pnpm run build --watch

# In another terminal, in packages/cli
cd packages/cli
pnpm run build --watch
```

### Clean Build

If you encounter issues:

```bash
# Remove compiled files
rm -rf packages/*/dist

# Remove node_modules and reinstall
rm -rf node_modules packages/*/node_modules
pnpm install

# Rebuild
pnpm run build
```

---

## 🚀 Using Terra CLI

Once built and linked, you can use the Terra CLI commands from anywhere.

### Command Overview

```bash
terra --help
```

**Available commands:**
- `terra create <name>` - Create a new Terra project
- `terra add <provider> <plugin>` - Add a plugin to your project
- `terra link <from> <to>` - Link plugin dependencies
- `terra build` - Generate Terraform configuration

---

## 📝 Terra CLI Commands

### 1. Create a New Project

```bash
terra create my-infrastructure
```

**Interactive prompts:**
1. **Choose provider:**
   - `aws`
   - `gcp`
   - `azure`

2. **Environment prefix:**
   - Enter environment name (e.g., `dev`, `prod`, `staging`)

**Example:**
```bash
$ terra create my-infrastructure
? Choose provider: aws
? Environment prefix (e.g., dev, prod): dev
✔ Project created: my-infrastructure
```

**What gets created:**
```
my-infrastructure/
└── terra.json
```

**terra.json content:**
```json
{
  "provider": "aws",
  "envPrefix": "dev",
  "plugins": [],
  "links": []
}
```

---

### 2. Add Plugins to Your Project

Navigate to your project and add plugins:

```bash
cd my-infrastructure
terra add aws s3
```

**Syntax:**
```bash
terra add <provider> <plugin>
```

**Examples:**
```bash
# Add S3 bucket
terra add aws s3

# Add VPC
terra add aws vpc

# Add SQS queue
terra add aws sqs

# Add IAM role
terra add aws iam-role

# Add subnet
terra add aws subnet
```

**What happens:**
1. CLI reads workspace `registry.json` to find plugin source
2. Copies plugin files to `my-infrastructure/<provider>-<plugin>/`
3. Updates `terra.json` to track the plugin

**Result:**
```
my-infrastructure/
├── terra.json
├── aws-s3/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── plugin.yml
└── aws-vpc/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── plugin.yml
```

---

### 3. Link Plugin Dependencies

If plugins have dependencies (e.g., subnet depends on VPC):

```bash
terra link aws/vpc aws/subnet
```

**Syntax:**
```bash
terra link <from-plugin> <to-plugin>
```

**Examples:**
```bash
# Subnet depends on VPC
terra link aws/vpc aws/subnet

# Security group depends on VPC
terra link aws/vpc aws/security-group

# Internet gateway depends on VPC
terra link aws/vpc aws/internet-gateway

# IAM policy depends on IAM role
terra link aws/iam-role aws/iam-policy
```

**What this does:**
- Creates a dependency graph (DAG)
- Ensures correct order in Terraform generation
- Prevents circular dependencies

---

### 4. Build Terraform Configuration

Generate Terraform files from your plugins:

```bash
terra build
```

**What gets generated:**
```
my-infrastructure/
├── terra.json
├── aws-s3/
├── aws-vpc/
├── main.tf           # ← Generated
├── variables.tf      # ← Generated
├── outputs.tf        # ← Generated
└── policies/         # ← Generated (placeholder)
    └── README.md
```

**Example main.tf:**
```hcl
module "aws_s3" {
  source = "./aws-s3"
}

module "aws_vpc" {
  source = "./aws-vpc"
}
```

**Output:**
```bash
✅ Build complete. Terraform files generated.
💡 Next steps:
   terraform init
   terraform plan
```

---

### 5. Deploy with Terraform

After building, use standard Terraform commands:

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply

# Destroy infrastructure
terraform destroy
```

---

## 📚 Available Plugins

### AWS Plugins

#### Storage & Messaging
- `aws s3` - S3 buckets with versioning and encryption
- `aws sqs` - SQS queues with optional DLQ

#### Networking
- `aws vpc` - Virtual Private Cloud
- `aws subnet` - Public/private subnets
- `aws security-group` - Security groups with ingress/egress rules
- `aws internet-gateway` - Internet gateway for VPC
- `aws route-table` - Route tables for VPC routing
- `aws elastic-ip` - Elastic IP addresses

#### IAM
- `aws iam-role` - IAM roles with assume role policies
- `aws iam-policy` - IAM policies
- `aws iam-user` - IAM users with access keys

---

## 🎯 Complete Example Workflow

### Building and Using Terra CLI

```bash
# 1. Clone and build
git clone <repository-url>
cd terra-plugins

# 2. Install dependencies
pnpm install

# 3. Build all packages
pnpm run build

# 4. Link globally
pnpm link --global

# 5. Verify installation
terra --version

# 6. Create a project
cd ~/projects
terra create my-aws-infra
# Select: aws
# Environment: prod

# 7. Add plugins
cd my-aws-infra
terra add aws vpc
terra add aws subnet
terra add aws s3
terra add aws security-group

# 8. Link dependencies
terra link aws/vpc aws/subnet
terra link aws/vpc aws/security-group

# 9. Build Terraform
terra build

# 10. Deploy
terraform init
terraform plan
terraform apply
```

---

## 🏗️ Project Structure After Build

### Workspace Structure
```
terra-plugins/
├── registry.json           # Global plugin registry
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── cli/
│   │   ├── src/           # TypeScript source
│   │   ├── dist/          # Compiled JavaScript
│   │   └── package.json
│   ├── core/
│   │   ├── src/           # TypeScript source
│   │   ├── dist/          # Compiled JavaScript
│   │   └── package.json
│   └── plugins/
│       └── aws/
│           ├── s3/
│           ├── vpc/
│           └── ...
└── docs/
```

### Created Project Structure
```
my-infrastructure/
├── terra.json              # Project configuration
├── aws-s3/                # Plugin (flat structure)
├── aws-vpc/               # Plugin (flat structure)
├── main.tf                # Generated Terraform
├── variables.tf           # Generated variables
├── outputs.tf             # Generated outputs
└── policies/              # Policy placeholder
```

---

## ⚙️ Build Scripts Reference

### package.json Scripts

```json
{
  "scripts": {
    "build": "pnpm -r run build",
    "clean": "pnpm -r run clean",
    "test": "pnpm -r run test"
  }
}
```

### Individual Package Scripts

**packages/cli/package.json:**
```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "postbuild": "chmod +x dist/index.js"
  }
}
```

**packages/core/package.json:**
```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json"
  }
}
```

---

## 🐛 Troubleshooting

### Command Not Found: terra

**Problem:** `terra` command not available after linking

**Solution:**
```bash
# Check if link exists
which terra

# Re-link
cd packages/cli
pnpm unlink --global
pnpm link --global

# Or use absolute path to verify it works
node /path/to/terra-plugins/packages/cli/dist/index.js --version
```

### Build Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
pnpm list typescript

# Clean and rebuild
rm -rf packages/*/dist
pnpm run build
```

### Module Not Found Errors

**Problem:** Can't find `@terra/core` or other dependencies

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules packages/*/node_modules
pnpm install
pnpm run build
```

### Registry Not Found

**Problem:** `terra add` can't find registry.json

**Solution:**
Make sure you're in a directory that has access to the workspace registry, or the CLI can find it in parent directories.

---

## 📊 Build Performance

Typical build times on modern hardware:

- **Initial `pnpm install`:** 10-30 seconds
- **`pnpm run build`:** 1-2 seconds
- **`pnpm link --global`:** < 1 second

---

## 🔄 Updating Terra CLI

To update after pulling changes:

```bash
cd terra-plugins
git pull
pnpm install  # If dependencies changed
pnpm run build
# No need to re-link, the global link still works
```

---

## 🎓 Summary

### Build Commands (Run Once)
```bash
pnpm install        # Install dependencies
pnpm run build      # Compile TypeScript
pnpm link --global  # Make 'terra' available globally
```

### Terra Commands (Daily Use)
```bash
terra create <name>           # Create project
terra add <provider> <plugin> # Add plugin
terra link <from> <to>        # Link dependencies
terra build                   # Generate Terraform
```

### Terraform Commands (Deploy)
```bash
terraform init    # Initialize
terraform plan    # Preview
terraform apply   # Deploy
terraform destroy # Cleanup
```

---

**Status: ✅ Ready to build and use!**

For more details, see:
- [QUICK_START.md](../QUICK_START.md) - User guide
- [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Command reference
- [ARCHITECTURE_DIAGRAM.md](../ARCHITECTURE_DIAGRAM.md) - Architecture overview

