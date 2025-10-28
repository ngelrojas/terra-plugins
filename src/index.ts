#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
    .name("terra")
    .description("Composable Terraform Plugin Framework")
    .version("0.1.0");

program
    .command("init <project>")
    .description("Initialize a new Terra project")
    .action((project) => {
        console.log(chalk.green(`🚀 Creating project ${project}...`));
    });

program.parse();
