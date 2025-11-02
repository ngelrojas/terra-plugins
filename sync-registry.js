#!/usr/bin/env node
/**
 * Automatically sync registry.json with available plugins
 *
 * This script:
 * 1. Scans packages/plugins/aws/ for all plugin directories
 * 2. Reads each plugin.yml to get description
 * 3. Updates registry.json with all found plugins
 *
 * Usage: node sync-registry.js
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_BASE_DIR = path.join(__dirname, 'packages/plugins');
const REGISTRY_PATH = path.join(__dirname, 'registry.json');

/**
 * Simple YAML parser - extracts description field from plugin.yml
 * This is a minimal parser that only looks for the description field
 */
function parseDescription(ymlContent) {
  const lines = ymlContent.split('\n');
  for (const line of lines) {
    // Match: description: "text" or description: text
    const match = line.match(/^description:\s*["']?(.+?)["']?\s*$/);
    if (match) {
      return match[1].trim();
    }
  }
  return 'No description available';
}

async function scanPlugins() {
  const plugins = [];

  try {
    // Scan all provider directories (aws, azure, gcp, etc.)
    const providers = await fs.promises.readdir(PLUGINS_BASE_DIR, { withFileTypes: true });

    for (const providerEntry of providers) {
      if (!providerEntry.isDirectory()) continue;

      const providerName = providerEntry.name;
      const providerDir = path.join(PLUGINS_BASE_DIR, providerName);

      console.log(`  📂 Scanning ${providerName}/...`);

      // Scan plugins within this provider
      const pluginEntries = await fs.promises.readdir(providerDir, { withFileTypes: true });

      for (const pluginEntry of pluginEntries) {
        if (!pluginEntry.isDirectory()) continue;

        const pluginName = `${providerName}/${pluginEntry.name}`;
        const pluginDir = path.join(providerDir, pluginEntry.name);
        const pluginYmlPath = path.join(pluginDir, 'plugin.yml');

        // Check if plugin.yml exists
        let description = 'No description available';
        try {
          const ymlContent = await fs.promises.readFile(pluginYmlPath, 'utf8');
          description = parseDescription(ymlContent);
        } catch (err) {
          console.warn(`     ⚠️  Warning: Could not read plugin.yml for ${pluginName}`);
        }

        plugins.push({
          name: pluginName,
          description: description,
          source: `workspace:packages/plugins/${providerName}/${pluginEntry.name}`
        });
      }
    }

    // Sort alphabetically by name
    plugins.sort((a, b) => a.name.localeCompare(b.name));

    return plugins;
  } catch (error) {
    console.error('❌ Error scanning plugins:', error.message);
    process.exit(1);
  }
}

async function updateRegistry(plugins) {
  try {
    await fs.promises.writeFile(
      REGISTRY_PATH,
      JSON.stringify(plugins, null, 2) + '\n',
      'utf8'
    );
    console.log(`✅ Updated registry.json with ${plugins.length} plugins`);
  } catch (error) {
    console.error('❌ Error writing registry.json:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🔍 Scanning for plugins in packages/plugins/...');
  const plugins = await scanPlugins();

  console.log(`\n📦 Found ${plugins.length} plugins total:`);

  // Group by provider for display
  const byProvider = {};
  plugins.forEach(p => {
    const provider = p.name.split('/')[0];
    if (!byProvider[provider]) byProvider[provider] = [];
    byProvider[provider].push(p.name);
  });

  Object.keys(byProvider).sort().forEach(provider => {
    console.log(`\n  ${provider.toUpperCase()} (${byProvider[provider].length}):`);
    byProvider[provider].forEach(name => {
      console.log(`   - ${name}`);
    });
  });

  console.log('\n📝 Updating registry.json...');
  await updateRegistry(plugins);

  console.log('\n🎉 Done! You can now use:');
  console.log('   terra add <provider> <plugin-name>');
  console.log('   Examples:');
  console.log('     terra add aws ec2');
  console.log('     terra add azure vm');
  console.log('     terra add gcp compute-instance');
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});

