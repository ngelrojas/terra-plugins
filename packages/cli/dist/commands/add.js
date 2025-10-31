"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlugin = addPlugin;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const core_1 = require("@terra/core");
/**
 * Find registry.json from the Terra CLI workspace.
 * The registry is NOT stored in projects - it's a global/workspace resource.
 * This searches for the workspace registry in parent directories.
 */
async function findRegistry() {
    // First, try the CLI package's parent directory (for development/workspace installs)
    const cliPackageDir = path_1.default.resolve(__dirname, '../../../..');
    const devRegistryPath = path_1.default.join(cliPackageDir, 'registry.json');
    try {
        await fs_1.promises.access(devRegistryPath);
        return devRegistryPath;
    }
    catch {
        // Continue searching
    }
    // Walk up from current directory to find workspace registry
    let currentDir = process.cwd();
    while (currentDir !== path_1.default.parse(currentDir).root) {
        const registryPath = path_1.default.join(currentDir, 'registry.json');
        try {
            await fs_1.promises.access(registryPath);
            return registryPath;
        }
        catch {
            currentDir = path_1.default.dirname(currentDir);
        }
    }
    // If not found, throw error
    throw new Error('Could not find registry.json in workspace. Please ensure Terra CLI is properly installed.');
}
async function addPlugin(projectDir, pluginName) {
    try {
        // Check if terra.json exists (are we in a terra project?)
        try {
            await fs_1.promises.access(path_1.default.join(projectDir, 'terra.json'));
        }
        catch {
            console.error(chalk_1.default.red('❌ Error: Not a terra project directory'));
            console.error(chalk_1.default.yellow('💡 Hint: Run this command from a terra project, or create one with:'));
            console.error(chalk_1.default.cyan('   terra create <project-name>'));
            process.exit(1);
        }
        const manifest = await (0, core_1.readManifest)(projectDir);
        // Find registry
        let registryPath;
        try {
            registryPath = await findRegistry();
        }
        catch {
            console.error(chalk_1.default.red('❌ Error: Could not find registry.json'));
            console.error(chalk_1.default.yellow('💡 Hint: Make sure you are in a terra project or the terra-plugins workspace'));
            process.exit(1);
        }
        console.log(`📖 Using registry: ${registryPath}`);
        // Load registry
        let registry;
        try {
            registry = await (0, core_1.loadRegistry)(registryPath);
        }
        catch (error) {
            console.error(chalk_1.default.red('❌ Error: Failed to load registry.json'));
            console.error(chalk_1.default.gray(`   ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }
        // Check if plugin already added
        if (manifest.plugins.includes(pluginName)) {
            console.log(chalk_1.default.yellow(`⚠️  Plugin "${pluginName}" is already added to this project`));
            return;
        }
        // Resolve and copy plugin (this will throw if not found)
        await (0, core_1.resolveAndCopyPlugin)({ projectDir, pluginName, registry, registryPath });
        // Add to manifest
        manifest.plugins.push(pluginName);
        await (0, core_1.writeManifest)(projectDir, manifest);
        console.log(chalk_1.default.green(`✅ Added plugin: ${pluginName}`));
    }
    catch (error) {
        if (error instanceof Error) {
            // Check for specific error types
            if (error.message.includes('Plugin not found in registry')) {
                const [provider, plugin] = pluginName.split('/');
                console.error(chalk_1.default.red(`❌ Error: Plugin "${pluginName}" does not exist`));
                console.error(chalk_1.default.yellow(`💡 The plugin "${plugin || pluginName}" is not available for provider "${provider}"`));
                console.error(chalk_1.default.yellow('💡 Available plugins:'));
                // Show available plugins for this provider
                try {
                    const registryPath = await findRegistry();
                    const registry = await (0, core_1.loadRegistry)(registryPath);
                    const providerPlugins = registry.filter(p => p.name.startsWith(`${provider}/`));
                    if (providerPlugins.length > 0) {
                        providerPlugins.forEach(p => {
                            const pluginShortName = p.name.split('/')[1];
                            console.error(chalk_1.default.cyan(`   - ${pluginShortName}`) + chalk_1.default.gray(` (${p.description || 'no description'})`));
                        });
                    }
                    else {
                        console.error(chalk_1.default.gray(`   No plugins found for provider "${provider}"`));
                    }
                }
                catch {
                    // Silently fail if we can't show suggestions
                }
            }
            else if (error.message.includes('ENOENT')) {
                console.error(chalk_1.default.red('❌ Error: Plugin source directory not found'));
                console.error(chalk_1.default.yellow('💡 The plugin may be registered but its files are missing'));
                console.error(chalk_1.default.gray(`   ${error.message}`));
            }
            else {
                console.error(chalk_1.default.red('❌ Error: Failed to add plugin'));
                console.error(chalk_1.default.gray(`   ${error.message}`));
            }
        }
        else {
            console.error(chalk_1.default.red('❌ An unexpected error occurred'));
            console.error(chalk_1.default.gray(`   ${error}`));
        }
        process.exit(1);
    }
}
