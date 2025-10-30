"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = build;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const pluginLoader_1 = require("./pluginLoader");
const dagEngine_1 = require("./dagEngine");
const renderer_1 = require("./renderer");
__exportStar(require("./pluginLoader"), exports);
__exportStar(require("./types"), exports);
async function build(projectDir) {
    const manifest = await (0, pluginLoader_1.readManifest)(projectDir);
    const metas = await Promise.all(manifest.plugins.map(async (name) => (0, pluginLoader_1.loadPluginMeta)(path_1.default.join(projectDir, 'plugins', name))));
    const nodes = metas.map(m => ({ name: m.name, meta: m }));
    const edges = (0, dagEngine_1.buildDag)(nodes, manifest.links || []);
    const order = (0, dagEngine_1.topoSort)(nodes, edges);
    await (0, renderer_1.renderTerraform)(projectDir, manifest, metas, order);
    // policies (alpha): write a placeholder for now
    await fs_1.promises.mkdir(path_1.default.join(projectDir, 'policies'), { recursive: true });
    await fs_1.promises.writeFile(path_1.default.join(projectDir, 'policies', 'README.md'), '# Policies will be synthesized in a next step');
}
