import { readManifest, writeManifest } from '@terra/core';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';


export async function linkPlugins(projectDir: string, from: string, to: string) {
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

        const manifest = await readManifest(projectDir);

        // Validate that both plugins exist in the project
        if (!manifest.plugins.includes(from)) {
            console.error(chalk.red(`❌ Error: Plugin "${from}" is not added to this project`));
            console.error(chalk.yellow('💡 Add it first with:'));
            console.error(chalk.cyan(`   terra add ${from.split('/').join(' ')}`));
            console.error(chalk.gray(`\n   Current plugins: ${manifest.plugins.join(', ') || 'none'}`));
            process.exit(1);
        }

        if (!manifest.plugins.includes(to)) {
            console.error(chalk.red(`❌ Error: Plugin "${to}" is not added to this project`));
            console.error(chalk.yellow('💡 Add it first with:'));
            console.error(chalk.cyan(`   terra add ${to.split('/').join(' ')}`));
            console.error(chalk.gray(`\n   Current plugins: ${manifest.plugins.join(', ') || 'none'}`));
            process.exit(1);
        }

        // Check for duplicate links
        manifest.links = manifest.links || [];
        const linkExists = manifest.links.some(([f, t]) => f === from && t === to);

        if (linkExists) {
            console.log(chalk.yellow(`⚠️  Link ${from} -> ${to} already exists`));
            return;
        }

        manifest.links.push([from, to]);
        await writeManifest(projectDir, manifest);
        console.log(chalk.green(`✅ Linked ${from} -> ${to}`));
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red('❌ Error: Failed to create link'));
            console.error(chalk.gray(`   ${error.message}`));
        } else {
            console.error(chalk.red('❌ An unexpected error occurred'));
            console.error(chalk.gray(`   ${error}`));
        }
        process.exit(1);
    }
}