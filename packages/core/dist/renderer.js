"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTerraform = renderTerraform;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
async function renderTerraform(projectDir, manifest, metas, order) {
    const outMain = [];
    const outVars = [];
    const outOuts = [];
    for (const name of order) {
        const meta = metas.find(m => m.name === name);
        const sourcePath = `./plugins/${name}`;
        outMain.push(`module "${name.replace(/-/g, '_')}" {\n source = \"${sourcePath}\"\n}`);
    }
    await fs_1.promises.writeFile(path_1.default.join(projectDir, 'main.tf'), outMain.join('\n\n'));
    await fs_1.promises.writeFile(path_1.default.join(projectDir, 'variables.tf'), outVars.join('\n'));
    await fs_1.promises.writeFile(path_1.default.join(projectDir, 'outputs.tf'), outOuts.join('\n'));
}
