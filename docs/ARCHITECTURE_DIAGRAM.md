# Terra CLI Architecture - File Locations

## 🏗️ Where Files Live

```
┌─────────────────────────────────────────────────────────────┐
│  Terra CLI Workspace (SHARED/GLOBAL)                        │
│  /path/to/terra-plugins/                                    │
│                                                              │
│  ├── registry.json        ← ONE COPY (used by all projects) │
│  ├── packages/                                               │
│  │   ├── cli/                                                │
│  │   ├── core/                                               │
│  │   └── plugins/                                            │
│  │       └── aws/                                            │
│  │           ├── s3/      ← Plugin source files              │
│  │           ├── vpc/     ← Plugin source files              │
│  │           └── sqs/     ← Plugin source files              │
│  └── ...                                                     │
└─────────────────────────────────────────────────────────────┘

              │
              │  terra add aws s3
              │  (reads registry, copies plugin)
              ↓

┌─────────────────────────────────────────────────────────────┐
│  Project 1: my-api                                           │
│                                                              │
│  ├── terra.json         ← Project config                     │
│  ├── aws-s3/           ← Copied plugin                      │
│  └── aws-sqs/          ← Copied plugin                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Project 2: my-infrastructure                                │
│                                                              │
│  ├── terra.json         ← Project config                     │
│  ├── aws-vpc/          ← Copied plugin                      │
│  ├── aws-subnet/       ← Copied plugin                      │
│  └── aws-security-group/ ← Copied plugin                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Project 3: my-storage                                       │
│                                                              │
│  ├── terra.json         ← Project config                     │
│  └── aws-s3/           ← Copied plugin                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Key Points

### ✅ One Registry, Many Projects
- **One** `registry.json` in workspace
- **Many** projects reference it
- Each project gets its own plugin copies

### ✅ Self-Contained Projects
Each project has:
- `terra.json` - what plugins it uses
- Plugin folders - the actual code

### ✅ No Duplication of Registry
- Registry lives in ONE place
- Projects don't copy it
- Updates to registry affect all projects immediately

---

## 📊 Data Flow

```
User runs: terra add aws s3
         │
         ↓
    ┌─────────────────────┐
    │  Read workspace     │
    │  registry.json      │
    └─────────────────────┘
         │
         │ Find: "aws/s3" → "workspace:packages/plugins/aws/s3"
         ↓
    ┌─────────────────────┐
    │  Copy plugin files  │
    │  to project/aws-s3/ │
    └─────────────────────┘
         │
         ↓
    ┌─────────────────────┐
    │  Update project     │
    │  terra.json         │
    └─────────────────────┘
         │
         ↓
    ✅ Done!
```

---

## 🆚 Comparison

### ❌ OLD WAY (What we removed)

```
my-project/
├── terra.json
├── registry.json      ← DUPLICATE! Unnecessary!
└── plugins/
    └── aws/
        └── s3/
```

**Problems:**
- Registry duplicated in every project
- Wastes space
- Gets out of sync
- Confusing (which registry is "real"?)

### ✅ NEW WAY (Current)

```
my-project/
├── terra.json         ← Only project config
└── aws-s3/           ← Only plugin code
```

**Benefits:**
- Minimal files
- No duplication
- Clear purpose
- Industry standard pattern

---

## 🌟 Real-World Analogy

### npm / yarn

```
npm registry (online)
     ↓
package.json (in project) ← tracks dependencies
     ↓
node_modules/ (in project) ← actual package code
```

### Terra CLI

```
registry.json (in workspace)
     ↓
terra.json (in project) ← tracks plugins
     ↓
aws-s3/ (in project) ← actual plugin code
```

**Same pattern! ✅**

---

## ✨ Summary

**Before your question:**
- ❌ Registry copied to every project
- ❌ Redundant files
- ❌ Confusing structure

**After your feedback:**
- ✅ Registry in workspace only
- ✅ Minimal project files
- ✅ Clean, clear structure

**Your insight made Terra CLI better!** 🎉

