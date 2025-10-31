import path from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import { loadRegistry, resolveAndCopyPlugin, readManifest, writeManifest } from '@terra/core';

/**
 * Find registry.json from the Terra CLI workspace.
 * The registry is NOT stored in projects - it's a global/workspace resource.
 * This searches for the workspace registry in parent directories.
 */
async function findRegistry(): Promise<string> {
    // First, try the CLI package's parent directory (for development/workspace installs)
    const cliPackageDir = path.resolve(__dirname, '../../../..');
    const devRegistryPath = path.join(cliPackageDir, 'registry.json');
    try {
        await fs.access(devRegistryPath);
        return devRegistryPath;
    } catch {
        // Continue searching
    }

    // Walk up from current directory to find workspace registry
    let currentDir = process.cwd();
    while (currentDir !== path.parse(currentDir).root) {
        const registryPath = path.join(currentDir, 'registry.json');
        try {
            await fs.access(registryPath);
            return registryPath;
        } catch {
            currentDir = path.dirname(currentDir);
        }
    }

    // If not found, throw error
    throw new Error('Could not find registry.json in workspace. Please ensure Terra CLI is properly installed.');
}

export async function addPlugin(projectDir: string, pluginName: string) {
    try {
        // Check if terra.json exists (are we in a terra project?)
        try {
            await fs.access(path.join(projectDir, 'terra.json'));
        } catch {
            console.error(chalk.red('❌ Error: Not a terra project directory'));
            console.error(chalk.yellow('💡 Hint: Run this command from a terra project, or create one with:'));
            console.error(chalk.cyan('   terra create <project-name>'));
            process.exit(1);
        }

        const manifest = await readManifest(projectDir);

        // Find registry
        let registryPath: string;
        try {
            registryPath = await findRegistry();
        } catch {
            console.error(chalk.red('❌ Error: Could not find registry.json'));
            console.error(chalk.yellow('💡 Hint: Make sure you are in a terra project or the terra-plugins workspace'));
            process.exit(1);
        }

        console.log(`📖 Using registry: ${registryPath}`);

        // Load registry
        let registry;
        try {
            registry = await loadRegistry(registryPath);
        } catch (error) {
            console.error(chalk.red('❌ Error: Failed to load registry.json'));
            console.error(chalk.gray(`   ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }

        // Check if plugin already added
        if (manifest.plugins.includes(pluginName)) {
            console.log(chalk.yellow(`⚠️  Plugin "${pluginName}" is already added to this project`));
            return;
        }

        // Resolve and copy plugin (this will throw if not found)
        await resolveAndCopyPlugin({ projectDir, pluginName, registry, registryPath });

        // Add to manifest
        manifest.plugins.push(pluginName);
        await writeManifest(projectDir, manifest);

        console.log(chalk.green(`✅ Added plugin: ${pluginName}`));
    } catch (error) {
        if (error instanceof Error) {
            // Check for specific error types
            if (error.message.includes('Plugin not found in registry')) {
                const [provider, plugin] = pluginName.split('/');
                console.error(chalk.red(`❌ Error: Plugin "${pluginName}" does not exist`));
                console.error(chalk.yellow(`💡 The plugin "${plugin || pluginName}" is not available for provider "${provider}"`));
                console.error(chalk.yellow('💡 Available plugins:'));

                // Show available plugins for this provider
                try {
                    const registryPath = await findRegistry();
                    const registry = await loadRegistry(registryPath);
                    const providerPlugins = registry.filter(p => p.name.startsWith(`${provider}/`));

                    if (providerPlugins.length > 0) {
                        providerPlugins.forEach(p => {
                            const pluginShortName = p.name.split('/')[1];
                            console.error(chalk.cyan(`   - ${pluginShortName}`) + chalk.gray(` (${p.description || 'no description'})`));
                        });
                    } else {
                        console.error(chalk.gray(`   No plugins found for provider "${provider}"`));
                    }
                } catch {
                    // Silently fail if we can't show suggestions
                }
            } else if (error.message.includes('ENOENT')) {
                console.error(chalk.red('❌ Error: Plugin source directory not found'));
                console.error(chalk.yellow('💡 The plugin may be registered but its files are missing'));
                console.error(chalk.gray(`   ${error.message}`));
            } else {
                console.error(chalk.red('❌ Error: Failed to add plugin'));
                console.error(chalk.gray(`   ${error.message}`));
            }
        } else {
            console.error(chalk.red('❌ An unexpected error occurred'));
            console.error(chalk.gray(`   ${error}`));
        }
        process.exit(1);
    }
}