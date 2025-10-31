"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStack = buildStack;
const core_1 = require("@terra/core");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function buildStack(projectDir) {
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
        await (0, core_1.build)(projectDir);
        console.log(chalk_1.default.green('✅ Build complete. Terraform files generated.'));
        console.log(chalk_1.default.gray('💡 Next steps:'));
        console.log(chalk_1.default.cyan('   terraform init'));
        console.log(chalk_1.default.cyan('   terraform plan'));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk_1.default.red('❌ Error: Failed to build project'));
            console.error(chalk_1.default.gray(`   ${error.message}`));
            // Provide specific hints for common errors
            if (error.message.includes('plugin.yml')) {
                console.error(chalk_1.default.yellow('💡 Check that all plugins have valid plugin.yml files'));
            }
            else if (error.message.includes('ENOENT')) {
                console.error(chalk_1.default.yellow('💡 Some plugin files may be missing. Try re-adding the plugins.'));
            }
            else if (error.message.includes('cycle') || error.message.includes('circular')) {
                console.error(chalk_1.default.yellow('💡 There may be a circular dependency in your plugin links'));
            }
        }
        else {
            console.error(chalk_1.default.red('❌ An unexpected error occurred during build'));
            console.error(chalk_1.default.gray(`   ${error}`));
        }
        process.exit(1);
    }
}
