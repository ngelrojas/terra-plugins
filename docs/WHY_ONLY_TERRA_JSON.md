# Why Only `terra.json` in Projects?

## The Question

> "After creating the project and adding modules, why do we need registry.json and terra.json files in the project?"

## The Answer: We DON'T Need Both! 🎯

You're absolutely right to question this. Here's the breakdown:

## What Each File Does

### `registry.json` (Workspace Only)
**Purpose:** Plugin catalog/directory
**Contains:** Available plugins and their source paths
**Example:**
```json
[
  {
    "name": "aws/s3",
    "description": "Create an S3 bucket",
    "source": "workspace:packages/plugins/aws/s3"
  }
]
```
**Needed for:** Finding WHERE to copy plugin files FROM
**Location:** Terra CLI workspace (global)

### `terra.json` (Project Only)
**Purpose:** Project configuration
**Contains:** Which plugins are installed, links between them
**Example:**
```json
{
  "provider": "aws",
  "envPrefix": "dev",
  "plugins": ["aws/s3", "aws/vpc"],
  "links": []
}
```
**Needed for:** Tracking what's in the project, building Terraform
**Location:** Each project

## Why `registry.json` Doesn't Belong in Projects

Once you run `terra add aws s3`, here's what happens:

1. ✅ CLI reads workspace `registry.json` to find source path
2. ✅ Copies plugin files to `my-project/aws-s3/`
3. ✅ Updates `my-project/terra.json` to track the plugin
4. ❌ **No need to copy `registry.json`** - plugin files are already there!

### The Problem with Copying registry.json

```
my-project/
├── terra.json          ✅ Needed (tracks installed plugins)
├── registry.json       ❌ Redundant (plugins already copied)
├── aws-s3/            ✅ Plugin files (self-contained)
└── aws-vpc/           ✅ Plugin files (self-contained)
```

**Issues:**
- 🔴 Duplicates the workspace registry unnecessarily
- 🔴 Takes up space
- 🔴 Gets out of sync when workspace adds new plugins
- 🔴 Confusing - users might think they can edit it

## The Fix ✅

**Now:** `terra create` only creates `terra.json`

```bash
terra create my-project
# Creates only: my-project/terra.json

cd my-project
terra add aws s3
# Reads from: workspace registry.json (in CLI installation)
# Creates: my-project/aws-s3/
# Updates: my-project/terra.json
```

## How `terra add` Finds the Registry

1. First: Check CLI package directory (for development)
2. Then: Walk up parent directories to find workspace registry
3. Uses: The global/workspace registry.json

**Result:** Projects stay clean and minimal!

## File Purpose Summary

| File | Location | Purpose |
|------|----------|---------|
| `registry.json` | **Workspace only** | Plugin catalog (source paths) |
| `terra.json` | **Each project** | Project config (which plugins installed) |
| `aws-s3/` | **Each project** | Actual plugin code (copied from source) |

## Benefits of This Approach

✅ **Cleaner projects** - Only essential files
✅ **Single source of truth** - One registry in workspace
✅ **Easier updates** - Update workspace registry, affects all projects
✅ **Less confusion** - Clear separation of concerns
✅ **Smaller projects** - No duplicate registry files

## Analogy

Think of it like `npm`:
- `registry.json` = npm registry (global, tells you where packages are)
- `terra.json` = `package.json` (project, tracks what you installed)
- `aws-s3/` = `node_modules/package` (actual code, copied locally)

You don't copy the entire npm registry into every project - same idea here!

---

**Bottom line:** You only need `terra.json` in your project. The `registry.json` lives in the Terra CLI workspace and is shared across all projects. 🎉

