"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStack = buildStack;
const core_1 = require("@terra/core");
async function buildStack(projectDir) {
    await (0, core_1.build)(projectDir);
    console.log('🏗 Build complete. Terraform files generated.');
}
