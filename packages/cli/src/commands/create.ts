import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';



export async function createProject(name: string) {
    const target = path.resolve(process.cwd(), name);
    fs.mkdirSync(target, { recursive: true });


    // Prompt for provider and environment prefix
    const answers = await inquirer.prompt([
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
        plugins: [] as string[],
        links: [] as [string, string][]
    };


    fs.writeFileSync(path.join(target, 'terra.json'), JSON.stringify(manifest, null, 2));
}