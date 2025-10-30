"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlugin = addPlugin;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const core_1 = require("@terra/core");
/**
 * Find registry.json by searching upward from current directory
 * or from the CLI package location
 */
async function findRegistry() {
    // First, try to find registry.json in parent directories
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
    // If not found, try the CLI package's parent directory (for development)
    const cliPackageDir = path_1.default.resolve(__dirname, '../../..');
    const devRegistryPath = path_1.default.join(cliPackageDir, 'registry.json');
    try {
        await fs_1.promises.access(devRegistryPath);
        return devRegistryPath;
    }
    catch {
        // Fall back to current directory (will fail with helpful error)
        return path_1.default.resolve(process.cwd(), 'registry.json');
    }
}
async function addPlugin(projectDir, pluginName) {
    const manifest = await (0, core_1.readManifest)(projectDir);
    const registryPath = await findRegistry();
    console.log(`📖 Using registry: ${registryPath}`);
    const registry = await (0, core_1.loadRegistry)(registryPath);
    await (0, core_1.resolveAndCopyPlugin)({ projectDir, pluginName, registry, registryPath });
    if (!manifest.plugins.includes(pluginName))
        manifest.plugins.push(pluginName);
    await (0, core_1.writeManifest)(projectDir, manifest);
    console.log(`➕ Added plugin: ${pluginName}`);
}
