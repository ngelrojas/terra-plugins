import path from 'path';
import { promises as fs } from 'fs';
import type { PluginMeta, ProjectManifest } from './types';


export async function renderTerraform(projectDir: string, manifest: ProjectManifest, metas: PluginMeta[], order: string[]) {
    const outMain: string[] = [];
    const outVars: string[] = [];
    const outOuts: string[] = [];


    for (const name of order) {
        const meta = metas.find(m => m.name === name)!;
        const sourcePath = `./plugins/${name}`;
        outMain.push(`module "${name.replace(/-/g, '_')}" {\n source = \"${sourcePath}\"\n}`);
    }


    await fs.writeFile(path.join(projectDir, 'main.tf'), outMain.join('\n\n'));
    await fs.writeFile(path.join(projectDir, 'variables.tf'), outVars.join('\n'));
    await fs.writeFile(path.join(projectDir, 'outputs.tf'), outOuts.join('\n'));
}