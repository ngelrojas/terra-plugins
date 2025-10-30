#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const create_1 = require("./commands/create");
const add_1 = require("./commands/add");
const link_1 = require("./commands/link");
const build_1 = require("./commands/build");
const program = new commander_1.Command();
program
    .name('terra')
    .description('Composable Terraform Plugin Framework')
    .version('0.1.0');
program
    .command('create')
    .argument('<name>')
    .description('Create a new terra-plugins project')
    .action(async (name) => {
    await (0, create_1.createProject)(name);
    console.log(chalk_1.default.green(`✔ Project created: ${name}`));
});
program
    .command('add')
    .argument('<plugin>')
    .description('Add a plugin (from registry.json or path)')
    .action(async (pluginName) => {
    await (0, add_1.addPlugin)(process.cwd(), pluginName);
});
program
    .command('link')
    .argument('<from>')
    .argument('<to>')
    .description('Link plugin outputs to another plugin inputs (adds DAG edge)')
    .action(async (from, to) => {
    await (0, link_1.linkPlugins)(process.cwd(), from, to);
});
program
    .command('build')
    .description('Generate Terraform files from selected plugins + DAG')
    .action(async () => {
    await (0, build_1.buildStack)(process.cwd());
});
program.parse();
