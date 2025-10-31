"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
async function createProject(name) {
    const target = path_1.default.resolve(process.cwd(), name);
    fs_1.default.mkdirSync(target, { recursive: true });
    // Prompt for provider and environment prefix
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'provider',
            message: 'Choose provider:',
            choices: ['aws', 'gcp', 'azure'],
            default: 'aws'
        },
        {
            type: 'input',
            name: 'envPrefix',
            message: 'Environment prefix (e.g., dev, prod):',
            default: 'dev'
        }
    ]);
    const manifest = {
        provider: answers.provider,
        envPrefix: answers.envPrefix,
        plugins: [],
        links: []
    };
    fs_1.default.writeFileSync(path_1.default.join(target, 'terra.json'), JSON.stringify(manifest, null, 2));
}
