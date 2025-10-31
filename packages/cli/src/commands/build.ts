import { build } from '@terra/core';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';


export async function buildStack(projectDir: string) {
    try {
        // Check if terra.json exists
        try {
            await fs.access(path.join(projectDir, 'terra.json'));
        } catch {
            console.error(chalk.red('❌ Error: Not a terra project directory'));
            console.error(chalk.yellow('💡 Hint: Run this command from a terra project, or create one with:'));
            console.error(chalk.cyan('   terra create <project-name>'));
            process.exit(1);
        }

        await build(projectDir);
        console.log(chalk.green('✅ Build complete. Terraform files generated.'));
        console.log(chalk.gray('💡 Next steps:'));
        console.log(chalk.cyan('   terraform init'));
        console.log(chalk.cyan('   terraform plan'));
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red('❌ Error: Failed to build project'));
            console.error(chalk.gray(`   ${error.message}`));

            // Provide specific hints for common errors
            if (error.message.includes('plugin.yml')) {
                console.error(chalk.yellow('💡 Check that all plugins have valid plugin.yml files'));
            } else if (error.message.includes('ENOENT')) {
                console.error(chalk.yellow('💡 Some plugin files may be missing. Try re-adding the plugins.'));
            } else if (error.message.includes('cycle') || error.message.includes('circular')) {
                console.error(chalk.yellow('💡 There may be a circular dependency in your plugin links'));
            }
        } else {
            console.error(chalk.red('❌ An unexpected error occurred during build'));
            console.error(chalk.gray(`   ${error}`));
        }
        process.exit(1);
    }
}