# Quick Reference: Plugin Discovery System

## 🎯 The Problem You Had

```bash
terra add aws ec2
# ❌ Error: Plugin "aws/ec2" does not exist
```

**Why?** Plugin files existed but weren't in `registry.json`

---

## ✅ The Solution

### What I Fixed:
1. ✅ Fixed `eks-cluster/plugin.yml` (was empty)
2. ✅ Added all 16 plugins to `registry.json`
3. ✅ Created `sync-registry.js` for auto-discovery
4. ✅ Added `pnpm sync-registry` command

---

## 📚 Key Concepts

### 1. Plugin Discovery Chain
```
terra add aws ec2
    ↓
registry.json (has "aws/ec2" entry?)
    ↓
packages/plugins/aws/ec2/ (source files)
    ↓
<project>/aws-ec2/ (copied to project)
```

### 2. Required Files Per Plugin
```
packages/plugins/aws/my-plugin/
├── plugin.yml     ← Metadata (name, description, inputs, outputs)
├── main.tf        ← Terraform resources
├── variables.tf   ← Input variables
└── outputs.tf     ← Output values
```

### 3. The Registry File
- **Location:** `/registry.json` (workspace root)
- **Purpose:** Catalog of discoverable plugins
- **Format:**
```json
[
  {
    "name": "aws/plugin-name",
    "description": "What it does",
    "source": "workspace:packages/plugins/aws/plugin-name"
  }
]
```

---

## 🚀 Common Commands

### Add Plugin to Project
```bash
terra add aws ec2
terra add aws eks-cluster
terra add aws lambda
```

### Sync Registry (After Creating New Plugin)
```bash
pnpm sync-registry
```

### View Available Plugins
```bash
cat registry.json | jq -r '.[].name'
```

---

## 🔄 Workflow: Adding New Plugin

```bash
# 1. Create plugin directory
mkdir packages/plugins/aws/my-new-plugin

# 2. Create plugin.yml
cat > packages/plugins/aws/my-new-plugin/plugin.yml <<EOF
name: aws/my-new-plugin
version: 0.1.0
provider: aws
description: My awesome new plugin

inputs:
  - name: some_input
    type: string

outputs:
  - name: some_output
EOF

# 3. Create Terraform files
touch packages/plugins/aws/my-new-plugin/main.tf
touch packages/plugins/aws/my-new-plugin/variables.tf
touch packages/plugins/aws/my-new-plugin/outputs.tf

# 4. Sync registry (AUTOMATIC!)
pnpm sync-registry

# 5. Use it
terra add aws my-new-plugin
```

---

## 📊 Your Current Plugins (16 Total)

```
✅ aws/autoscaling-group    - Auto Scaling Groups
✅ aws/ec2                  - EC2 Instances
✅ aws/ecs-cluster          - ECS Clusters
✅ aws/ecs-service          - ECS Services
✅ aws/eks-cluster          - EKS Kubernetes Clusters
✅ aws/elastic-ip           - Elastic IPs
✅ aws/iam-policy           - IAM Policies
✅ aws/iam-role             - IAM Roles
✅ aws/iam-user             - IAM Users
✅ aws/internet-gateway     - Internet Gateways
✅ aws/lambda               - Lambda Functions
✅ aws/launch-template      - EC2 Launch Templates
✅ aws/route-table          - Route Tables
✅ aws/security-group       - Security Groups
✅ aws/subnet               - Subnets
✅ aws/vpc                  - VPCs
```

---

## 💡 Remember

| File | Purpose | When to Update |
|------|---------|----------------|
| `plugin.yml` | Plugin metadata | When creating plugin |
| `registry.json` | Discovery catalog | Run `pnpm sync-registry` |
| `terra.json` | Project config | Auto-updated by CLI |

---

## 🎉 Status: RESOLVED

- ✅ All plugins registered
- ✅ `terra add aws ec2` works
- ✅ Auto-sync tool created
- ✅ Documentation complete

**Test it:** `terra add aws ec2` should work now!

