"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkPlugins = linkPlugins;
const core_1 = require("@terra/core");
async function linkPlugins(projectDir, from, to) {
    const manifest = await (0, core_1.readManifest)(projectDir);
    manifest.links = manifest.links || [];
    manifest.links.push([from, to]);
    await (0, core_1.writeManifest)(projectDir, manifest);
    console.log(`🔗 Linked ${from} -> ${to}`);
}
