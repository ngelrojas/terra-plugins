import path from 'path';
import { promises as fs } from 'fs';
import { loadRegistry, resolveAndCopyPlugin, readManifest, writeManifest } from '@terra/core';

/**
 * Find registry.json by searching upward from current directory
 * or from the CLI package location
 */
async function findRegistry(): Promise<string> {
    // First, try to find registry.json in parent directories
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

    // If not found, try the CLI package's parent directory (for development)
    const cliPackageDir = path.resolve(__dirname, '../../..');
    const devRegistryPath = path.join(cliPackageDir, 'registry.json');
    try {
        await fs.access(devRegistryPath);
        return devRegistryPath;
    } catch {
        // Fall back to current directory (will fail with helpful error)
        return path.resolve(process.cwd(), 'registry.json');
    }
}

export async function addPlugin(projectDir: string, pluginName: string) {
    const manifest = await readManifest(projectDir);
    const registryPath = await findRegistry();
    console.log(`📖 Using registry: ${registryPath}`);
    const registry = await loadRegistry(registryPath);
    await resolveAndCopyPlugin({ projectDir, pluginName, registry, registryPath });
    if (!manifest.plugins.includes(pluginName)) manifest.plugins.push(pluginName);
    await writeManifest(projectDir, manifest);
    console.log(`➕ Added plugin: ${pluginName}`);
}