"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkPlugins = linkPlugins;
const core_1 = require("@terra/core");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function linkPlugins(projectDir, from, to) {
    try {
        // Check if terra.json exists
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
        // Validate that both plugins exist in the project
        if (!manifest.plugins.includes(from)) {
            console.error(chalk_1.default.red(`❌ Error: Plugin "${from}" is not added to this project`));
            console.error(chalk_1.default.yellow('💡 Add it first with:'));
            console.error(chalk_1.default.cyan(`   terra add ${from.split('/').join(' ')}`));
            console.error(chalk_1.default.gray(`\n   Current plugins: ${manifest.plugins.join(', ') || 'none'}`));
            process.exit(1);
        }
        if (!manifest.plugins.includes(to)) {
            console.error(chalk_1.default.red(`❌ Error: Plugin "${to}" is not added to this project`));
            console.error(chalk_1.default.yellow('💡 Add it first with:'));
            console.error(chalk_1.default.cyan(`   terra add ${to.split('/').join(' ')}`));
            console.error(chalk_1.default.gray(`\n   Current plugins: ${manifest.plugins.join(', ') || 'none'}`));
            process.exit(1);
        }
        // Check for duplicate links
        manifest.links = manifest.links || [];
        const linkExists = manifest.links.some(([f, t]) => f === from && t === to);
        if (linkExists) {
            console.log(chalk_1.default.yellow(`⚠️  Link ${from} -> ${to} already exists`));
            return;
        }
        manifest.links.push([from, to]);
        await (0, core_1.writeManifest)(projectDir, manifest);
        console.log(chalk_1.default.green(`✅ Linked ${from} -> ${to}`));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk_1.default.red('❌ Error: Failed to create link'));
            console.error(chalk_1.default.gray(`   ${error.message}`));
        }
        else {
            console.error(chalk_1.default.red('❌ An unexpected error occurred'));
            console.error(chalk_1.default.gray(`   ${error}`));
        }
        process.exit(1);
    }
}
