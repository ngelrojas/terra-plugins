"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readManifest = readManifest;
exports.writeManifest = writeManifest;
exports.loadRegistry = loadRegistry;
exports.loadPluginMeta = loadPluginMeta;
exports.resolveAndCopyPlugin = resolveAndCopyPlugin;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const yaml_1 = require("yaml");
async function readManifest(projectDir) {
    const raw = await fs_1.promises.readFile(path_1.default.join(projectDir, 'terra.json'), 'utf8');
    return JSON.parse(raw);
}
async function writeManifest(projectDir, manifest) {
    await fs_1.promises.writeFile(path_1.default.join(projectDir, 'terra.json'), JSON.stringify(manifest, null, 2));
}
async function loadRegistry(registryPath) {
    const raw = await fs_1.promises.readFile(registryPath, 'utf8');
    return JSON.parse(raw);
}
async function loadPluginMeta(pluginDir) {
    const raw = await fs_1.promises.readFile(path_1.default.join(pluginDir, 'plugin.yml'), 'utf8');
    const meta = (0, yaml_1.parse)(raw);
    return meta;
}
async function resolveAndCopyPlugin({ projectDir, pluginName, registry, registryPath }) {
    const entry = registry.find(r => r.name === pluginName);
    if (!entry)
        throw new Error(`Plugin not found in registry: ${pluginName}`);
    let sourceDir = entry.source;
    if (sourceDir.startsWith('workspace:')) {
        // Use registry directory as base for workspace paths
        const workspacePath = sourceDir.replace('workspace:', '');
        if (registryPath) {
            // If registry path is provided, resolve relative to it
            const registryDir = path_1.default.dirname(registryPath);
            sourceDir = path_1.default.resolve(registryDir, workspacePath);
        }
        else {
            // Fallback to current working directory
            sourceDir = path_1.default.resolve(process.cwd(), workspacePath);
        }
    }
    const dest = path_1.default.join(projectDir, 'plugins', pluginName);
    await copyDir(sourceDir, dest);
}
async function copyDir(src, dest) {
    await fs_1.promises.mkdir(dest, { recursive: true });
    const items = await fs_1.promises.readdir(src, { withFileTypes: true });
    for (const it of items) {
        const s = path_1.default.join(src, it.name);
        const d = path_1.default.join(dest, it.name);
        if (it.isDirectory())
            await copyDir(s, d);
        else
            await fs_1.promises.copyFile(s, d);
    }
}
