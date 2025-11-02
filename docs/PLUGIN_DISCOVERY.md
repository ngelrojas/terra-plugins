# Plugin Discovery & Registry System

## 🔍 How Terra CLI Discovers Plugins

When you run `terra add aws ec2`, the CLI goes through this process:

```
┌─────────────────────────────────────────────────────────┐
│  1. User runs: terra add aws ec2                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. CLI searches for registry.json                      │
│     - Looks in workspace root                           │
│     - Walks up parent directories                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. Loads registry.json                                 │
│     [                                                    │
│       {                                                  │
│         "name": "aws/ec2",                              │
│         "description": "...",                           │
│         "source": "workspace:packages/plugins/aws/ec2"  │
│       }                                                  │
│     ]                                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. Finds matching entry                                │
│     - Searches for name: "aws/ec2"                      │
│     - Gets source path                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. Resolves workspace path                             │
│     workspace:packages/plugins/aws/ec2                  │
│     →  /full/path/terra-plugins/packages/plugins/aws/ec2│
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  6. Copies plugin to project                            │
│     Source: packages/plugins/aws/ec2/                   │
│     Dest:   <project>/aws-ec2/                          │
│     Files:  main.tf, plugin.yml, variables.tf, etc.     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  7. Updates project's terra.json                        │
│     {                                                    │
│       "plugins": ["aws/ec2"],                           │
│       ...                                                │
│     }                                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 The Registry File

### Location
- **File:** `registry.json` (root of terra-plugins workspace)
- **Purpose:** Central catalog of all available plugins
- **Format:** JSON array of plugin entries

### Entry Structure
```json
{
  "name": "aws/ec2",           // Unique plugin identifier
  "description": "...",         // Human-readable description
  "source": "workspace:..."     // Path to plugin source
}
```

---

## 🎯 Why Plugins Weren't Found

**Problem:** You created plugins in `packages/plugins/aws/` but they weren't in `registry.json`

**Result:** CLI couldn't find them because it only looks at what's registered

**Solution:** Add entries to `registry.json` for each plugin

---

## ✅ Fixed Plugins

I've added these missing plugins to your registry:

- ✅ `aws/ec2` - Provision EC2 instances
- ✅ `aws/eks-cluster` - Provision AWS EKS cluster
- ✅ `aws/ecs-cluster` - Create ECS cluster
- ✅ `aws/ecs-service` - Deploy ECS service
- ✅ `aws/lambda` - Create Lambda functions
- ✅ `aws/autoscaling-group` - Create Auto Scaling Group
- ✅ `aws/launch-template` - Create EC2 Launch Template

**Your registry now has 18 plugins total!**

---

## 🤖 Automatic Plugin Discovery

### Problem with Manual Registry
Every time you create a new plugin, you need to:
1. Create the plugin files
2. Manually edit `registry.json`
3. Add name, description, source
4. Risk typos or missing entries

### Solution: Auto-Sync Script

I've created `sync-registry.js` that automatically:
- Scans `packages/plugins/aws/` directory
- Reads each `plugin.yml` for metadata
- Generates complete `registry.json`
- Keeps everything in sync

---

## 🚀 Usage

### Option 1: Run the Sync Script
```bash
# From workspace root
pnpm sync-registry

# Or directly
node sync-registry.js
```

**Output:**
```
🔍 Scanning for plugins in packages/plugins/aws/...
📦 Found 18 plugins:
   - aws/autoscaling-group
   - aws/ec2
   - aws/ecs-cluster
   - aws/eks-cluster
   ...
📝 Updating registry.json...
✅ Updated registry.json with 18 plugins
🎉 Done! You can now use: terra add aws <plugin-name>
```

### Option 2: Use npm Script
```bash
pnpm sync-registry
```

---

## 📋 Adding New Plugins - Complete Workflow

### Step 1: Create Plugin Directory
```bash
mkdir packages/plugins/aws/my-new-plugin
cd packages/plugins/aws/my-new-plugin
```

### Step 2: Create Plugin Files
```bash
# Required files:
touch main.tf
touch variables.tf
touch outputs.tf
touch plugin.yml
```

### Step 3: Write plugin.yml
```yaml
name: aws/my-new-plugin
version: 0.1.0
provider: aws
description: My awesome new plugin

inputs:
  - name: some_input
    type: string

outputs:
  - name: some_output
```

### Step 4: Sync Registry (AUTOMATIC!)
```bash
pnpm sync-registry
```

### Step 5: Use Your Plugin
```bash
# In any terra project
terra add aws my-new-plugin
```

---

## 🔍 How the Code Works

### CLI Plugin Loading (`add.ts`)

```typescript
// 1. Find registry.json in workspace
const registryPath = await findRegistry();

// 2. Load registry entries
const registry = await loadRegistry(registryPath);

// 3. Search for plugin
const entry = registry.find(r => r.name === pluginName);

// 4. Resolve workspace path
let sourceDir = entry.source.replace('workspace:', '');
sourceDir = path.resolve(registryDir, sourceDir);

// 5. Copy to project
await copyDir(sourceDir, destDir);
```

### Registry Search Logic

The CLI walks up directories to find `registry.json`:

```typescript
async function findRegistry(): Promise<string> {
  // Try CLI package parent (development)
  const devPath = path.resolve(__dirname, '../../../..');
  
  // Walk up from current directory
  let currentDir = process.cwd();
  while (currentDir !== root) {
    const registryPath = path.join(currentDir, 'registry.json');
    if (exists(registryPath)) return registryPath;
    currentDir = path.dirname(currentDir);
  }
}
```

---

## 📊 Current Registry Status

**Total Plugins:** 18

### Networking (6)
- aws/vpc
- aws/subnet
- aws/security-group
- aws/internet-gateway
- aws/route-table
- aws/elastic-ip

### IAM (3)
- aws/iam-role
- aws/iam-policy
- aws/iam-user

### Compute (5)
- aws/ec2
- aws/eks-cluster
- aws/ecs-cluster
- aws/ecs-service
- aws/lambda

### Auto Scaling (2)
- aws/autoscaling-group
- aws/launch-template

### Storage & Messaging (2)
- aws/s3
- aws/sqs

---

## 🎯 Key Takeaways

1. **Registry is required** - CLI discovers plugins through `registry.json`
2. **Manual registration was error-prone** - Easy to forget updating registry
3. **Auto-sync solves this** - Run `pnpm sync-registry` after creating plugins
4. **One source of truth** - `plugin.yml` contains description, auto-synced to registry
5. **Workspace-relative paths** - `workspace:` prefix resolves to terra-plugins root

---

## 🔮 Future Enhancements

### Potential Improvements:
1. **Auto-sync on build** - Add to build script
2. **Plugin validation** - Check all required files exist
3. **Multi-provider support** - Scan aws/, azure/, gcp/
4. **Version management** - Track plugin versions
5. **Plugin search command** - `terra search <keyword>`
6. **Plugin info command** - `terra info aws/ec2`

---

## 💡 Pro Tips

### Validate Plugin Before Syncing
```bash
# Make sure plugin.yml exists and is valid
cat packages/plugins/aws/my-plugin/plugin.yml
```

### List Available Plugins
```bash
# View registry
cat registry.json | jq '.[] | .name'
```

### Test Plugin Addition
```bash
# Create test project
terra create test-project
cd test-project
terra add aws ec2
```

---

**Now your plugins are discoverable! Try:** `terra add aws ec2` 🎉

