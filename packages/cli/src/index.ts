#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './commands/create';
import { addPlugin } from './commands/add';
import { linkPlugins } from './commands/link';
import { buildStack } from './commands/build';


const program = new Command();
program
    .name('terra')
    .description('Composable Terraform Plugin Framework')
    .version('0.1.0');


program
    .command('create')
    .argument('<name>')
    .description('Create a new terra-plugins project')
    .action(async (name: string) => {
        await createProject(name);
        console.log(chalk.green(`✔ Project created: ${name}`));
    });


program
    .command('add')
    .argument('<plugin>')
    .description('Add a plugin (from registry.json or path)')
    .action(async (pluginName: string) => {
        await addPlugin(process.cwd(), pluginName);
    });


program
    .command('link')
    .argument('<from>')
    .argument('<to>')
    .description('Link plugin outputs to another plugin inputs (adds DAG edge)')
    .action(async (from: string, to: string) => {
        await linkPlugins(process.cwd(), from, to);
    });


program
    .command('build')
    .description('Generate Terraform files from selected plugins + DAG')
    .action(async () => {
        await buildStack(process.cwd());
    });


program.parse();