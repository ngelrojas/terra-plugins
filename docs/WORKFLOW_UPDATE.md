# Terra CLI Workflow Update

## Summary of Changes

The `terra create` and plugin management workflow has been updated to provide a cleaner project structure.

## New Workflow

### 1. Create a Project

```bash
terra create <project-name>
```

**Prompts:**
- **Provider selection**: Choose from `aws`, `gcp`, or `azure`
- **Environment prefix**: Enter environment prefix (e.g., `dev`, `prod`, `staging`)

**Created structure:**
```
my-project/
└── terra.json
```

**Note:** `registry.json` is NOT copied to the project. It remains in the Terra CLI workspace and is used globally.

### 2. Add Resources

```bash
cd my-project
terra add aws s3
```

This creates a **flattened directory structure** directly in the project root:

```
my-project/
├── terra.json
└── aws-s3/              # <-- Plugin files copied here
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── plugin.yml
```

### 3. Add More Resources

```bash
terra add aws sqs
terra add aws vpc
```

Results in:

```
my-project/
├── terra.json
├── aws-s3/
├── aws-sqs/
└── aws-vpc/
```

### 4. Build Terraform Configuration

```bash
terra build
```

Generates Terraform files that reference the flattened plugin directories:

```hcl
# main.tf
module "aws_s3" {
  source = "./aws-s3"
}

module "aws_sqs" {
  source = "./aws-sqs"
}

module "aws_vpc" {
  source = "./aws-vpc"
}
```

## Key Changes

### 1. **Project Creation** (`packages/cli/src/commands/create.ts`)
- Added provider selection with choices: `aws`, `gcp`, `azure`
- Improved environment prefix prompt with better messaging
- Removed automatic `plugins/` folder creation
- Only creates `terra.json` (no `registry.json` copy - uses workspace registry)

### 2. **Plugin Installation** (`packages/core/src/pluginLoader.ts`)
- Changed from nested structure (`plugins/aws/s3/`) to flattened (`aws-s3/`)
- Plugins are copied directly to project root with hyphen-separated names
- Example: `aws/s3` → `aws-s3/`, `aws/vpc` → `aws-vpc/`

### 3. **Build Process** (`packages/core/src/index.ts`)
- Updated to load plugins from flattened directories
- Converts plugin names (`aws/s3`) to directory names (`aws-s3`)

### 4. **Terraform Rendering** (`packages/core/src/renderer.ts`)
- Module source paths now point to flattened directories
- Example: `source = "./aws-s3"` instead of `source = "./plugins/aws/s3"`

## Benefits

1. **Cleaner project structure** - No nested `plugins/` folder
2. **Easier navigation** - All resources visible at project root level
3. **Clear resource naming** - `aws-s3`, `aws-vpc`, etc. are self-documenting
4. **Flexibility** - Users can customize individual plugin instances easily
5. **Multi-provider support** - Framework ready for GCP and Azure plugins

## Migration

If you have existing projects with the old structure (`plugins/aws/s3/`):

1. Move plugin directories to root level with flattened names:
   ```bash
   mv plugins/aws/s3 aws-s3
   mv plugins/aws/vpc aws-vpc
   ```

2. Remove empty `plugins/` directory:
   ```bash
   rm -rf plugins
   ```

3. Your `terra.json` doesn't need changes - it still uses `aws/s3` format

4. Run `terra build` to regenerate Terraform files

## Example Complete Workflow

```bash
# Create project
terra create my-infrastructure
# Choose: aws
# Environment: prod

cd my-infrastructure

# Add resources
terra add aws vpc
terra add aws subnet
terra add aws s3

# Link resources (if needed)
terra link aws/vpc aws/subnet

# Generate Terraform
terra build

# Apply infrastructure
terraform init
terraform plan
terraform apply
```

## Directory Structure Comparison

### Old Structure ❌
```
my-project/
├── terra.json
└── plugins/
    └── aws/
        ├── s3/
        ├── sqs/
        └── vpc/
```

### New Structure ✅
```
my-project/
├── terra.json
├── aws-s3/
├── aws-sqs/
└── aws-vpc/
```

**Note:** `registry.json` is NOT in projects - it lives in the Terra CLI workspace!

