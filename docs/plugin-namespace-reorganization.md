# Plugin Namespace Reorganization

## Overview
Successfully reorganized the plugin structure to support provider namespacing. Plugins are now organized by provider (e.g., `aws/`, `azure/`, `gcp/`) and the CLI supports namespaced commands.

## Changes Made

### 1. Plugin Directory Structure
**Before:**
```
packages/plugins/
├── aws-s3/
├── aws-sqs/
├── aws-iam-role/
├── aws-vpc/
└── ...
```

**After:**
```
packages/plugins/
└── aws/
    ├── s3/
    ├── sqs/
    ├── iam-role/
    ├── iam-policy/
    ├── iam-user/
    ├── vpc/
    ├── subnet/
    ├── security-group/
    ├── internet-gateway/
    ├── route-table/
    └── elastic-ip/
```

### 2. Registry Updates
Updated `registry.json` to use namespaced plugin names:

**Before:**
```json
{
  "name": "aws-s3",
  "source": "workspace:packages/plugins/aws-s3"
}
```

**After:**
```json
{
  "name": "aws/s3",
  "source": "workspace:packages/plugins/aws/s3"
}
```

### 3. CLI Command Syntax
**New Syntax:**
```bash
# Add plugins using provider namespace
terra add aws s3
terra add aws vpc
terra add aws iam-role

# The CLI combines them into "aws/s3", "aws/vpc", "aws/iam-role"
```

**Backward Compatibility:**
```bash
# Old syntax still works if plugin name includes the slash
terra add aws/s3
```

### 4. Code Changes

#### `/packages/cli/src/index.ts`
- Updated the `add` command to accept two arguments: `<provider>` and `[plugin]`
- The command combines them into a namespaced plugin name: `${provider}/${plugin}`

#### `/packages/cli/src/commands/add.ts`
- Updated `findRegistry()` to prioritize the workspace registry (for workspace: paths)
- This ensures plugins are copied from the correct source location

#### `/packages/cli/src/commands/create.ts`
- Added `findRegistrySource()` function to locate the workspace registry
- Now copies `registry.json` to new projects automatically
- Updated to resolve paths correctly from the compiled `dist/` folder

#### `/packages/core/src/pluginLoader.ts`
- Updated `resolveAndCopyPlugin()` to handle namespaced paths (e.g., "aws/s3")
- Plugin destination paths now preserve the namespace: `plugins/aws/s3/`

### 5. Project Structure
When creating a project and adding plugins:

```
my-project/
├── terra.json          # Contains ["aws/s3", "aws/vpc"]
├── registry.json       # Copied from workspace
└── plugins/
    └── aws/
        ├── s3/
        │   ├── main.tf
        │   ├── variables.tf
        │   ├── outputs.tf
        │   └── plugin.yml
        └── vpc/
            ├── main.tf
            ├── variables.tf
            ├── outputs.tf
            └── plugin.yml
```

## Usage Examples

### Create a new project
```bash
terra create my-aws-project
cd my-aws-project
```

### Add AWS plugins
```bash
# VPC and networking
terra add aws vpc
terra add aws subnet
terra add aws security-group
terra add aws internet-gateway

# IAM resources
terra add aws iam-role
terra add aws iam-policy
terra add aws iam-user

# Storage
terra add aws s3

# Other resources
terra add aws elastic-ip
terra add aws route-table
```

### Link plugins (DAG)
```bash
terra link aws/vpc aws/subnet
terra link aws/iam-role aws/iam-policy
```

### Build Terraform files
```bash
terra build
```

## Benefits

1. **Better Organization**: Plugins are grouped by cloud provider
2. **Cleaner Names**: Removed redundant "aws-" prefix from plugin folder names
3. **Scalability**: Easy to add new providers (Azure, GCP, etc.)
4. **Intuitive CLI**: Natural command syntax: `terra add <provider> <plugin>`
5. **Namespace Support**: Avoids naming conflicts between providers

## Future Provider Support

The structure is ready for additional providers:

```
packages/plugins/
├── aws/
│   ├── s3/
│   ├── vpc/
│   └── ...
├── azure/
│   ├── storage-account/
│   ├── virtual-network/
│   └── ...
└── gcp/
    ├── storage-bucket/
    ├── vpc/
    └── ...
```

## Testing

All functionality has been tested and verified:
- ✅ Creating new projects with `terra create`
- ✅ Registry.json is copied to new projects
- ✅ Adding plugins with new syntax: `terra add aws s3`
- ✅ Plugins are copied to correct namespaced directory: `plugins/aws/s3/`
- ✅ Manifest stores plugins as: `["aws/s3", "aws/vpc"]`
- ✅ Multiple plugins can be added successfully

