import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';


export async function createProject(name: string) {
    const target = path.resolve(process.cwd(), name);
    fs.mkdirSync(target, { recursive: true });


// Basic manifest
    const answers = await inquirer.prompt([
        { type: 'list', name: 'provider', message: 'Choose provider', choices: ['aws'], default: 'aws' },
        { type: 'input', name: 'envPrefix', message: 'Environment prefix', default: 'prod' }
    ]);


    const manifest = {
        provider: answers.provider,
        envPrefix: answers.envPrefix,
        plugins: [] as string[],
        links: [] as [string, string][]
    };


    fs.writeFileSync(path.join(target, 'terra.json'), JSON.stringify(manifest, null, 2));
    fs.mkdirSync(path.join(target, 'plugins'), { recursive: true });
}