# Terra CLI - Error Messages Guide

## Overview
The Terra CLI provides helpful, user-friendly error messages with actionable hints to resolve common issues.

---

## Common Errors and Solutions

### 1. Plugin Not Found

**Error:**
```
❌ Error: Plugin "aws/fly" does not exist
💡 The plugin "fly" is not available for provider "aws"
💡 Available plugins:
   - s3 (Create an S3 bucket (versioning, blocking public ACLs))
   - vpc (Create VPC network)
   - iam-role (Create IAM Roles with assume role policy)
   ...
```

**Cause:** You tried to add a plugin that doesn't exist in the registry.

**Solution:** Choose from the list of available plugins shown in the error message.

**Example:**
```bash
# ❌ Wrong
terra add aws fly

# ✅ Correct
terra add aws s3
```

---

### 2. Not in a Terra Project

**Error:**
```
❌ Error: Not a terra project directory
💡 Hint: Run this command from a terra project, or create one with:
   terra create <project-name>
```

**Cause:** You ran a command (add, link, or build) outside of a terra project directory.

**Solution:** Navigate to a terra project or create a new one.

**Example:**
```bash
# Create a new project
terra create my-project
cd my-project

# Or navigate to existing project
cd path/to/existing/project
```

---

### 3. Plugin Already Added

**Warning:**
```
⚠️  Plugin "aws/s3" is already added to this project
```

**Cause:** You tried to add a plugin that's already in your project.

**Solution:** No action needed. The plugin is already available.

**Check current plugins:**
```bash
cat terra.json
```

---

### 4. Plugin Not in Project (Link Error)

**Error:**
```
❌ Error: Plugin "aws/vpc" is not added to this project
💡 Add it first with:
   terra add aws vpc

   Current plugins: aws/s3, aws/subnet
```

**Cause:** You tried to link a plugin that hasn't been added to the project.

**Solution:** Add the plugin before linking it.

**Example:**
```bash
# Add the missing plugin
terra add aws vpc

# Then create the link
terra link aws/vpc aws/subnet
```

---

### 5. Duplicate Link

**Warning:**
```
⚠️  Link aws/vpc -> aws/subnet already exists
```

**Cause:** You tried to create a link that already exists.

**Solution:** No action needed. The link is already configured.

---

### 6. Build Errors

**Error:**
```
❌ Error: Failed to build project
💡 Check that all plugins have valid plugin.yml files
```

**Common Causes:**
- Missing or corrupted plugin files
- Invalid YAML syntax in plugin.yml
- Circular dependencies in plugin links

**Solutions:**

**Missing plugin files:**
```bash
# Re-add the plugin
rm -rf plugins/aws/s3
terra add aws s3
```

**Check plugin.yml syntax:**
```bash
# Manually verify YAML files
cat plugins/aws/s3/plugin.yml
```

**Circular dependencies:**
```bash
# Review your links in terra.json
cat terra.json

# Remove problematic links manually
# Edit terra.json and remove circular link entries
```

---

### 7. Registry Not Found

**Error:**
```
❌ Error: Could not find registry.json
💡 Hint: Make sure you are in a terra project or the terra-plugins workspace
```

**Cause:** The CLI couldn't locate the plugin registry.

**Solution:**
- Ensure you're in a terra project directory
- If in workspace, ensure registry.json exists at root
- When creating projects outside workspace, registry.json is copied automatically

---

## Error Message Features

### 🎨 Color Coding
- **Red (❌)**: Errors that require action
- **Yellow (⚠️/💡)**: Warnings and helpful hints
- **Green (✅)**: Success messages
- **Cyan**: Commands and code examples
- **Gray**: Additional details

### 📝 Structured Format
Every error message includes:
1. **Clear error description** - What went wrong
2. **Root cause** - Why it happened (when applicable)
3. **Actionable hints** - How to fix it
4. **Example commands** - Copy-paste solutions
5. **Context** - Current state (e.g., current plugins)

### 🔍 Smart Suggestions
The CLI provides context-aware suggestions:
- Lists available plugins when one is not found
- Shows current plugins when validation fails
- Provides specific commands for the exact situation
- Suggests next steps after successful operations

---

## Exit Codes

- **0**: Success
- **1**: Error occurred

Use exit codes in scripts:
```bash
if terra add aws s3; then
    echo "Plugin added successfully"
    terra build
else
    echo "Failed to add plugin"
    exit 1
fi
```

---

## Best Practices

### 1. Check Before You Link
```bash
# View current plugins
cat terra.json

# Then add missing plugins
terra add aws vpc
terra add aws subnet

# Finally link them
terra link aws/vpc aws/subnet
```

### 2. Verify Plugin Names
When unsure about a plugin name, try adding it to see available options:
```bash
# This will show all available AWS plugins
terra add aws unknown-plugin
```

### 3. Read Error Messages Carefully
Error messages include:
- Specific problem identification
- Current state information
- Exact commands to fix issues

### 4. Use Tab Completion (Future Enhancement)
Stay tuned for shell completion support to avoid typos.

---

## Getting Help

### Built-in Help
```bash
terra --help
terra add --help
terra link --help
terra build --help
```

### Debug Mode (Coming Soon)
```bash
terra add aws s3 --verbose
terra build --debug
```

### Community Support
- Check documentation in `docs/` folder
- Review QUICK_START.md for examples
- See ROADMAP.md for upcoming features

---

## Error Message Examples

### Success Flow
```bash
$ terra create my-infra
✔ Project created: my-infra

$ cd my-infra

$ terra add aws s3
📖 Using registry: /path/to/registry.json
✅ Added plugin: aws/s3

$ terra build
✅ Build complete. Terraform files generated.
💡 Next steps:
   terraform init
   terraform plan
```

### Error Flow with Resolution
```bash
$ terra add aws fly
📖 Using registry: /path/to/registry.json
❌ Error: Plugin "aws/fly" does not exist
💡 The plugin "fly" is not available for provider "aws"
💡 Available plugins:
   - s3 (Create an S3 bucket)
   - vpc (Create VPC network)
   ...

$ terra add aws s3
📖 Using registry: /path/to/registry.json
✅ Added plugin: aws/s3
```

---

## Future Enhancements

Planned error handling improvements:
- **Did you mean?** suggestions for typos
- **Validation warnings** before build
- **Dependency resolution** hints
- **Interactive fixes** for common issues
- **Verbose mode** for debugging
- **Log files** for complex errors

---

**Remember:** Error messages are designed to help you succeed. Read them carefully and follow the suggested solutions!

